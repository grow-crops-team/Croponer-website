import Task from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

/**
 * @desc Create a new task
 * @route POST /api/v1/admin/tasks
 * @access Admin
 */
const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    
    if (!title || !description || !assignedTo) {
        throw new ApiError(400, "Title, description, and assignedTo are required");
    }

    const newTask = await Task.create({
        title,
        description,
        status: "pending",
        priority: priority || "medium",
        assignedTo,
        dueDate,
    });

    const task = await Task.findById(task._id)

    if (!task) {
        throw new ApiError(500, "Failed to create task");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201, 
            task, 
            "Task created successfully!"
        ));
});

/**
 * @desc Get all tasks
 * @route GET /api/v1/admin/tasks
 * @access Admin
 */
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find()
    if (tasks.length === 0){
        throw new ApiError(404, "No tasks found");
    } 

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            tasks, 
            "Tasks fetched successfully!"
        ))
})

/**
 * @desc Update a task (status, details)
 * @route PUT /api/v1/admin/tasks/:id
 * @access Admin
 */
const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, status, priority, dueDate },
        { new: true, runValidators: true }
    );

    if (!updatedTask) throw new ApiError(404, "Task not found");

    return res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully!"))
});

/**
 * @desc Delete a task
 * @route DELETE /api/v1/admin/tasks/:id
 * @access Admin
 */
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID")
    }

    const deletedTask = await Task.findByIdAndDelete(id)
    if (!deletedTask) throw new ApiError(404, "Task not found")

    return res.status(200).json(new ApiResponse(200, null, "Task deleted successfully!"))
});

export { createTask, getTasks, updateTask, deleteTask }
