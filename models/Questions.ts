import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  testcases: { type: String, required: true },
  solutions: { type: String, required: true },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
