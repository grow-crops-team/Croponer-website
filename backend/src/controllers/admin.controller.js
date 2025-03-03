
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import Admin from "../models/admin.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong when generate access and refresh token"
        )
    }
}

const adminLogin = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
    
    if (!username && !email) {
        throw new ApiError(400, "Either username or email is required")
    }

    const admin = await Admin.findOne({
        $or: [{ username }, { email }],
    })

    if (!admin) {
        throw new ApiError(404, "User does not exist!! \n Contact Your Admin");
    }
    const isPasswordValid = await admin.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials !! \n Contact Your Admin")
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
        admin._id
    )
    // console.log(refreshToken, accessToken)

    const loggedInAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true,
    }
    // secure: process.env.NODE_ENV === "production",

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    accessToken,
                    refreshToken,
                },
                "Login is successful !"
            )
        )
})

const registerAdmin = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body
    if (
        [username, fullName, email, password].some((allFields) => {
            return allFields?.trim() === "";
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await Admin.findOne({
        $or: [{ username }, { email }],
    })

    if (existedUser) {
        throw new ApiError(409, "Your are  already registered !")
    }

    const admin = await Admin.create({
        username: username.toLowerCase(),
        fullName: fullName,
        email,
        password,
    })

    // console.log("\nUser Details->", user);

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    );
    if (!createdAdmin) {
        throw new ApiError(500, "Internal server error: registering the Admin")
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdAdmin,
                "Admin successfully Registered !! \n Save your credentials "
            ))
})

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully !"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorize request ")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const admin = await Admin.findById(decodedToken?._id)
        if (!admin) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incomingRefreshToken !== admin?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(
            admin._id
        )

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken,
                    refreshToken: newRefreshToken,
                })
            )
    } catch (error) {
        throw new ApiError(401, error?.message, "Invalid Refresh token")

    }
})

const getAdmin = asyncHandler(async (req, res) => {
    const admins = await Admin.find()

    if (admins.length === 0) {
        throw new ApiError(404, "No Admin found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admins, "Admin fetched successfully!"))
})


const updateAdmin = asyncHandler(async (req, res) => {
    const {  email, username, role } = req.body;

    if (!username || !email) {
        throw new ApiError(400, "Username or email are required");
    }

    const updatedData = { username, email,role };

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    // Update admin details
    const updatedAdmin = await Admin.findByIdAndUpdate(
        req.admin._id,
        { $set: updatedData },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, updatedAdmin, "Admin details updated successfully"));
})


//User Functions
const getUser = asyncHandler(async (req, res, next) => {
    const users = await User.find();

    if (users.length === 0)
        throw new ApiError(404, "No users found")

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully!"))
})

const createUser = asyncHandler(async (req, res, next) => {
    const { username, fullName, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!username || !fullName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Create new admin
    const newUser = await User.create({
        username,
        fullName,
        email,
        password,  // Ensure password is hashed in the User model
        role: role || "user",  // Default role is "user"
    });

    return res.status(201).json(new ApiResponse(201, newUser, "User created successfully!"));
});


const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully!"));
});


export { adminLogin, registerAdmin, logoutAdmin, refreshAccessToken, getAdmin, updateAdmin, getUser, createUser, deleteUser }

