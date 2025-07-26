// /app/api/user/solved-questions/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/Users";
import Questions from "@/models/Questions";

// Interface for the JWT verification response from Appwrite
interface AppwriteJWTVerifyResponse {
  userId: string;
  // Avoid index signature with any; add fields here if needed
}

// Computed type for the solved questions data by category
type SolvedQuestionCategory = {
  name: string;
  questionCount: number;
  progress: number; // Percentage solved in category
  questions: string[];
};

// Helper: Verify Appwrite JWT token via Appwrite REST API
async function verifyAppwriteJWT(token: string): Promise<AppwriteJWTVerifyResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/account/sessions/jwt/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": process.env.NEXT_PUBLIC_PROJECT_ID!,
        "X-Appwrite-Key": process.env.APPWRITE_API_KEY!, // Server API key (keep secret!)
      },
      body: JSON.stringify({ jwt: token }),
    }
  );
  if (!res.ok) {
    throw new Error("Invalid or expired token");
  }

  const verified: AppwriteJWTVerifyResponse = await res.json();

  if (!verified.userId || typeof verified.userId !== "string") {
    throw new Error("Invalid token response structure");
  }

  return verified;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid auth token" }, { status: 401 });
    }
    const token = authHeader.substring(7);

    // Verify token & get user ID
    const verified = await verifyAppwriteJWT(token);
    const appwriteUserId = verified.userId;
    if (!appwriteUserId) {
      return NextResponse.json({ error: "User not found in token" }, { status: 401 });
    }

    // Connect to DB
    await connectDB();

    // Find user by Appwrite ID
    const user = await User.findOne({ appwriteId: appwriteUserId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const solvedIds = user.solvedQuestions || [];

    // Fetch solved questions data
    const solvedQuestions = await Questions.find({ _id: { $in: solvedIds } }).lean();

    // Fetch all questions for progress calculation
    const allQuestions = await Questions.find({}).lean();

    // Calculate totals per category
    const totalByCategory: Record<string, number> = {};
    allQuestions.forEach((q) => {
      if (q.category && typeof q.category === "string") {
        totalByCategory[q.category] = (totalByCategory[q.category] || 0) + 1;
      }
    });

    // Group solved questions per category
    const categoryMap: Record<
      string,
      { questions: string[]; totalQuestions: number }
    > = {};

    solvedQuestions.forEach((q) => {
      if (!q.category || typeof q.category !== "string") return; // skip if no category or invalid
      if (!categoryMap[q.category]) {
        categoryMap[q.category] = {
          questions: [],
          totalQuestions: totalByCategory[q.category] || 0,
        };
      }
      categoryMap[q.category].questions.push(q.title || "Untitled");
    });

    // Format the output
    const solvedQuestionsData: SolvedQuestionCategory[] = Object.entries(categoryMap).map(
      ([category, { questions, totalQuestions }]) => ({
        name: category,
        questionCount: questions.length,
        progress: totalQuestions ? Math.round((questions.length / totalQuestions) * 100) : 0,
        questions,
      })
    );

    return NextResponse.json({ success: true, solvedQuestions: solvedQuestionsData });
  } catch (error: unknown) {
    console.error("[GET] /api/user/solved-questions error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
