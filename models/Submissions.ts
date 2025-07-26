import mongoose, { Schema, models } from "mongoose";

const submissionSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String },
    questionId: { type: String, required: true },
    questionTitle: { type: String },
    answerMarkdown: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reload
const Submissions = models.Submissions || mongoose.model("Submissions", submissionSchema);
export default Submissions;
