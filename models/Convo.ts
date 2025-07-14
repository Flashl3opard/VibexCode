import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  // other fields like participants, etc.
});

const Convo = mongoose.models.Convo || mongoose.model("Convo", conversationSchema);
export default Convo;
