import mongoose, { Schema } from "mongoose";


const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Reference to the User model (Admin assigning the task)
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // The admin who created the task
      required: true,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
)

const Task = mongoose.model("Task", taskSchema)

export default Task