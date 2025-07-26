import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/Users";
import Question from "@/models/Questions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers if needed
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
      method: req.method,
    });
  }

  try {
    console.log("🔍 History API: Starting request");

    // Connect to database
    try {
      await dbConnect();
      console.log("✅ Database connected");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Unknown database error";
      return res.status(500).json({
        success: false,
        error: "Database connection failed",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    // Get JWT token from Authorization header
    const authHeader = req.headers.authorization;
    console.log("🔑 Auth header present:", !!authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No valid token provided",
        receivedHeader: authHeader
          ? "Bearer token malformed"
          : "No authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token and get user ID
    let appwriteUserId: string;
    try {
      // Option 1: If you have access to Appwrite SDK server-side
      // const jwt = await account.getJWT(); // This might not work server-side

      // Option 2: Decode JWT client-side (less secure but works for development)
      const jwt = require("jsonwebtoken");
      const decoded = jwt.decode(token) as any;
      console.log("🔓 Token decoded:", {
        userId: decoded?.userId,
        sub: decoded?.sub,
      });

      appwriteUserId = decoded?.userId || decoded?.sub;

      if (!appwriteUserId) {
        throw new Error("Invalid token structure - no userId found");
      }
    } catch (tokenError) {
      console.error("❌ Token verification failed:", tokenError);
      const errorMessage =
        tokenError instanceof Error
          ? tokenError.message
          : "Unknown token error";
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    console.log("👤 Looking for user with Appwrite ID:", appwriteUserId);

    // Find user by Appwrite ID
    let user;
    try {
      user = await User.findOne({ appwriteId: appwriteUserId });
      console.log("👤 User found:", !!user);
    } catch (userError) {
      console.error("❌ User lookup failed:", userError);
      const errorMessage =
        userError instanceof Error
          ? userError.message
          : "Unknown user lookup error";
      return res.status(500).json({
        success: false,
        error: "Failed to lookup user",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    if (!user) {
      console.log("❌ User not found for Appwrite ID:", appwriteUserId);
      return res.status(404).json({
        success: false,
        error: "User not found",
        appwriteId: appwriteUserId,
      });
    }

    // Get solved questions - handle both old and new format
    let solvedQuestionIds: string[] = [];

    if (
      user.solvedQuestions &&
      Array.isArray(user.solvedQuestions) &&
      user.solvedQuestions.length > 0
    ) {
      // New format with embedded objects
      if (
        typeof user.solvedQuestions[0] === "object" &&
        user.solvedQuestions[0].questionId
      ) {
        solvedQuestionIds = user.solvedQuestions.map((sq: any) =>
          sq.questionId.toString()
        );
      } else {
        // Old format with just IDs
        solvedQuestionIds = user.solvedQuestions.map((id: any) =>
          id.toString()
        );
      }
    } else if (
      user.solvedQuestionIds &&
      Array.isArray(user.solvedQuestionIds)
    ) {
      // Fallback to legacy field
      solvedQuestionIds = user.solvedQuestionIds;
    }

    console.log("📚 Solved question IDs:", solvedQuestionIds.length);

    if (solvedQuestionIds.length === 0) {
      return res.status(200).json({
        success: true,
        history: [],
        totalSolved: 0,
        message: "No solved questions yet",
      });
    }

    // Fetch question details for solved questions
    let questions = [];
    try {
      questions = await Question.find({
        _id: { $in: solvedQuestionIds },
      })
        .select("_id title difficulty createdAt updatedAt")
        .lean();

      console.log("📖 Questions fetched:", questions.length);
    } catch (questionError) {
      console.error("❌ Failed to fetch questions:", questionError);
      // Return partial success with just IDs
      const history = solvedQuestionIds.map((id, index) => ({
        title: `Question ${index + 1}`,
        time: "Unknown",
        questionId: id,
        difficulty: "Unknown",
      }));

      return res.status(200).json({
        success: true,
        history,
        totalSolved: solvedQuestionIds.length,
        warning: "Question details could not be loaded",
      });
    }

    // Create history items with relative time
    const history = questions.map((question) => {
      const timeAgo = getRelativeTime(
        question.updatedAt || question.createdAt || new Date()
      );
      return {
        title: question.title || "Untitled Question",
        time: timeAgo,
        questionId: (question._id as string).toString(),
        difficulty: question.difficulty || "Unknown",
      };
    });

    // Sort by most recently solved (reverse order)
    history.reverse();

    console.log("✅ History prepared:", history.length, "items");

    return res.status(200).json({
      success: true,
      history,
      totalSolved: solvedQuestionIds.length,
      message: `Found ${history.length} solved questions`,
    });
  } catch (error) {
    console.error("💥 History API Critical Error:", error);

    // Always return a JSON response, even for unexpected errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : undefined;

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "An unexpected error occurred while fetching history",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: errorMessage,
              stack: errorStack,
            }
          : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  try {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    if (diffInWeeks < 4)
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

    return new Date(date).toLocaleDateString();
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "Unknown time";
  }
}
