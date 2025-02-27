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
      type:String,
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