import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI as string;

if (!DB_URI) {
  throw new Error("❌ MONGODB_URI missing from .env.local");
}

export default async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    // 1 = connected, 2 = connecting
    return;
  }

  try {
    await mongoose.connect(DB_URI, {
      bufferCommands: false,
    });
    console.log("📦 MongoDB connected via Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
