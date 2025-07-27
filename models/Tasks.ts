import mongoose, { Schema, Document, models, model, Types } from "mongoose";

export interface ITask extends Document {
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  userId: Types.ObjectId | string; // 👈 Add userId here
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
    userId: {
      type: Schema.Types.Mixed, // Can be ObjectId or string (Appwrite ID)
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;
