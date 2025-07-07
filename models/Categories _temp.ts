import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  progress: { type: Number, default: 0 },
  questions: [{ type: String }],
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
