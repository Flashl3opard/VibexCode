// pages/api/user/mark-solved.ts (or app/api/user/mark-solved/route.ts for App Router)
import { NextApiRequest, NextApiResponse } from "next";
import { account } from "@/lib/appwrite";
import User from "@/models/Users";
import Question from "@/models/Questions";
import dbConnect from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Get JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "No valid token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Extract user ID from JWT token
    let appwriteUserId: string;
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.decode(token) as any;
      appwriteUserId = decoded?.userId || decoded?.sub;

      if (!appwriteUserId) {
        throw new Error("Invalid token structure");
      }
    } catch (error) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // Extract request body
    const {
      questionId,
      answerMarkdown,
      language = "Javascript",
      executionStats,
    } = req.body;

    if (!questionId) {
      return res
        .status(400)
        .json({ success: false, error: "Question ID is required" });
    }

    // Find user and question
    const [user, question] = await Promise.all([
      User.findOne({ appwriteId: appwriteUserId }),
      Question.findById(questionId),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    // Add solved question using the model method
    const wasAdded = user.addSolvedQuestion(
      questionId,
      answerMarkdown || "",
      language,
      executionStats
    );

    // Update difficulty-specific stats if question was newly solved
    if (wasAdded && question.difficulty) {
      const difficulty = question.difficulty.toLowerCase();
      if (difficulty === "easy") user.stats.easyCount += 1;
      else if (difficulty === "medium") user.stats.mediumCount += 1;
      else if (difficulty === "hard") user.stats.hardCount += 1;
    }

    // Update favorite language based on usage
    const languageCount = user.solvedQuestions.reduce((acc: any, sq: any) => {
      acc[sq.language] = (acc[sq.language] || 0) + 1;
      return acc;
    }, {});

    const mostUsedLanguage = Object.entries(languageCount).reduce(
      (a: any, b: any) => (languageCount[a[0]] > languageCount[b[0]] ? a : b)
    )[0];

    user.stats.favoriteLanguage = mostUsedLanguage;

    // Save user
    await user.save();

    // Return success response with updated stats
    return res.status(200).json({
      success: true,
      message: wasAdded
        ? "Question marked as solved!"
        : "Question was already solved",
      isNewSolve: wasAdded,
      stats: {
        totalSolved: user.stats.totalSolved,
        currentStreak: user.stats.currentStreak,
        longestStreak: user.stats.longestStreak,
        easyCount: user.stats.easyCount,
        mediumCount: user.stats.mediumCount,
        hardCount: user.stats.hardCount,
        favoriteLanguage: user.stats.favoriteLanguage,
      },
    });
  } catch (error) {
    console.error("Mark solved API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

// Alternative App Router version (app/api/user/mark-solved/route.ts)
/*
import { NextRequest, NextResponse } from "next/server";
import { account } from "@/lib/appwrite";
import User from "@/models/User";
import Question from "@/models/Question";
import dbConnect from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get JWT token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No valid token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Extract user ID from JWT token
    let appwriteUserId: string;
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(token) as any;
      appwriteUserId = decoded?.userId || decoded?.sub;
      
      if (!appwriteUserId) {
        throw new Error("Invalid token structure");
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Extract request body
    const { 
      questionId, 
      answerMarkdown, 
      language = "Javascript",
      executionStats 
    } = await request.json();

    if (!questionId) {
      return NextResponse.json(
        { success: false, error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Find user and question
    const [user, question] = await Promise.all([
      User.findOne({ appwriteId: appwriteUserId }),
      Question.findById(questionId)
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    // Add solved question using the model method
    const wasAdded = user.addSolvedQuestion(
      questionId,
      answerMarkdown || "",
      language,
      executionStats
    );

    // Update difficulty-specific stats if question was newly solved
    if (wasAdded && question.difficulty) {
      const difficulty = question.difficulty.toLowerCase();
      if (difficulty === "easy") user.stats.easyCount += 1;
      else if (difficulty === "medium") user.stats.mediumCount += 1;
      else if (difficulty === "hard") user.stats.hardCount += 1;
    }

    // Save user
    await user.save();

    // Return success response with updated stats
    return NextResponse.json({
      success: true,
      message: wasAdded ? "Question marked as solved!" : "Question was already solved",
      isNewSolve: wasAdded,
      stats: {
        totalSolved: user.stats.totalSolved,
        currentStreak: user.stats.currentStreak,
        longestStreak: user.stats.longestStreak,
        easyCount: user.stats.easyCount,
        mediumCount: user.stats.mediumCount,
        hardCount: user.stats.hardCount,
        favoriteLanguage: user.stats.favoriteLanguage
      }
    });

  } catch (error) {
    console.error("Mark solved API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
*/
