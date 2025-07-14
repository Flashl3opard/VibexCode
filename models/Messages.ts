// models/Messages.ts
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversation: { type: String, required: true },
    sender: { type: String, required: true },
    senderName: { type: String },
    body: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
