// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Online", "Idle", "Busy", "Offline"],
    default: "Offline",
  },
  activity: { type: String, default: "" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
