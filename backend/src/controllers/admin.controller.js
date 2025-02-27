
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import Admin from "../models/admin.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await Admin.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

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
    if (!username || !email) {
        throw new ApiError(400, "Either username or email is required")
    }

    const user = await Admin.findOne({
        $or: [{ username }, { email }],
    })

    if (!user) {
        throw new ApiError(404, "User does not exist!! \n Contact Your Admin");
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials !! \n Contact Your Admin")
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
        user._id
    )
    // console.log(refreshToken, accessToken)

    const loggedInAdmin = await Admin.findById(user._id).select(
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
                    user: loggedInAdmin,
                    accessToken,
                    refreshToken,
                },
                "Login is successful !"
            )
        )
})

const registerAdmin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (
        [username, email, password].some((allFields) => {
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

    const user = await Admin.create({
        username: username.toLowerCase(),
        email,
        password,
    })

    // console.log("\nUser Details->", user);

    const createdAdmin = await Admin.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdAdmin) {
        throw new ApiError(500, "Internal server error: registering the user")
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

    const user = await Admin.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "Admin not found");
    }

    // Update user details
    const updatedAdmin = await Admin.findByIdAndUpdate(
        req.user._id,
        { $set: updatedData },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, updatedAdmin, "Admin details updated successfully"));
})


//user Functions
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Create new user
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










export { adminLogin, registerAdmin, getAdmin, updateAdmin, getUser, createUser, deleteUser }

