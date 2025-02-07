import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import crypto from "crypto"
import sendEmail from "../utils/sendmail.js"
import bcrypt from "bcrypt"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
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

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body
    if (
        [username, email, fullName, password].some((allFields) => {
            return allFields?.trim() === "";
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    })

    if (existedUser) {
        throw new ApiError(409, "Your are  already registered !! \nClick on login to continue")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
    })
    // for debugging
    // console.log("\nUser Details->", user);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "Internal server error: registering the user")
    }
    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User successfully Registered !! \n Save your credentials and Please login again to continue"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
    if (!username) {
        throw new ApiError(400, "username is required")
    }

    const user = await User.findOne({ username })

    if (!user) {
        throw new ApiError(404, "User does not exist!! \n Click on Register to continue");
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials !! \n Click on forgot password to reset your password")
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
        user._id
    )
    // console.log(refreshToken, accessToken)


    const loggedInUser = await User.findById(user._id).select(
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
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "Login is successful !! \n Glad to see you again"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
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
        .json(new ApiResponse(200, {}, "Logged out successfully !! \n waiting to See you soon"))
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

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(
            user._id
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

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password! Please enter correct password and try again")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(
            200, {}, "Password is changed successfully"
        )
    )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, oldPassword, newPassword } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "Full name and email are required");
    }

    const updatedData = { fullName, email };
    let avatarUrl;

    // Handle avatar upload if provided
    if (req.file) {
        const avatarLocalPath = req.file.path;
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            throw new ApiError(400, "Failed to upload avatar");
        }
        avatarUrl = avatar.secure_url;
        updatedData.avatar = avatarUrl;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Handle password change if provided
    if (oldPassword && newPassword) {
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid old password");
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updatedData },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
})

const uploadFiles = asyncHandler(async (req, res) => {

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "No files uploaded.")
    }

    const images = []

    for (let i = 0; i < req.files.length; i++) {
        const localFilePath = req.files[i].path;
        const uploadedFile = await uploadOnCloudinary(localFilePath)
        if (!uploadedFile) {
            throw new ApiError(500, "Error uploading file to Cloudinary.")
        }
        images.push({
            url: uploadedFile.url,
            publicId: uploadedFile.public_id
        })
    }

    // Create a record for the uploaded images associated with the user
    const fileRecord = await File.create({
        user: req.user._id,
        images: images
    })

    // Send response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                fileRecord,
                "Files uploaded successfully")
        )
})

const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body
    // Check if the user exists
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: "5m" })
    const resetURL = `${process.env.FRONTEND_URL}/reset.password.html?token=${resetToken}`
    await sendEmail(user.email, "Password Reset Request",
        `Click the link to reset your password: ${resetURL}`
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset link sent to your email!! Please check your email"
            )
        )
})

const resetPassword = asyncHandler(async (req, res) => {

    const { token } = req.params;
    const { newPassword } = req.body;

   const decode = jwt.verify(token, process.env.RESET_PASSWORD_SECRET)
   const user = await User.findById(decode.userId)

    if (!user) {
        throw new ApiError(400, "Invalid or expired token")
    }
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save({ validateBeforeSave: false })


    res.status(200).json(new ApiResponse(200, {}, "Password reset successful!! Please login with your new password"))

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    uploadFiles,
    forgotPassword,
    resetPassword


}
