import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITask extends Document {
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite error in Next.js
const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;
