import mongoose, { Schema, models } from "mongoose";

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    testcases: { type: String, required: true },
    solutions: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Questions =
  models.Questions || mongoose.model("Questions", QuestionSchema);
