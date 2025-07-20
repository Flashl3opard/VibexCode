// models/Poll.ts
import mongoose, { Schema } from "mongoose";

const PollSchema = new Schema({
  question: String,
  options: [String],
  votes: {
    type: Map,
    of: Number,
    default: {},
  },
});

export const Poll =
  mongoose.models.Poll || mongoose.model("Poll", PollSchema);
