import mongoose from "mongoose";

/**
 * Lazy MongoDB connection.
 *
 * The previous version threw at module load if MONGODB_URI was missing,
 * which broke `next build` whenever env vars weren't fully configured —
 * even for pages that never actually touch the database (Next collects
 * page data for every route at build time). Now the URI is validated only
 * when a route actually calls connectDB(); build always succeeds, and
 * runtime requests that need Mongo fail with a clear, contextual error.
 */
export default async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    // 1 = connected, 2 = connecting — already wired up.
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Configure it in .env.local (local) or in your hosting environment (production)."
    );
  }

  try {
    await mongoose.connect(uri, { bufferCommands: false });
    if (process.env.NODE_ENV !== "production") {
      console.log("📦 MongoDB connected via Mongoose");
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
