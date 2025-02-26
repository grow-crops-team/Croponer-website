
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


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










export { getUser,createUser,deleteUser }

