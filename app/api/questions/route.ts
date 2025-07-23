import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Questions from "@/models/Questions";
import { Types } from "mongoose";

type LeanQuestion = {
  _id: string;
  title: string;
  description: string;
  testcases: string;
  solutions: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  updatedAt: string;
};

type RawQuestion = {
  _id: Types.ObjectId; // fixed from any to mongoose.Types.ObjectId
  title?: string;
  description?: string;
  testcases?: string;
  solutions?: string;
  tags?: string[];
  difficulty?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const {
      title,
      description,
      testcases = "",
      solutions = "",
      tags = [],
      difficulty = "easy",
    } = data;

    // Validate input
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: "Difficulty must be one of easy, medium, hard" },
        { status: 400 }
      );
    }

    const newQuestion = await Questions.create({
      title: title.trim(),
      description: description.trim(),
      testcases: testcases.trim(),
      solutions: solutions.trim(),
      tags: Array.isArray(tags)
        ? tags.map((t: string) => t.trim()).filter((t) => t.length > 0)
        : [],
      difficulty: difficulty,
    });

    return NextResponse.json({
      success: true,
      question: {
        _id: newQuestion._id.toString(),
        title: newQuestion.title,
        description: newQuestion.description,
        testcases: newQuestion.testcases,
        solutions: newQuestion.solutions,
        tags: newQuestion.tags,
        difficulty: newQuestion.difficulty,
        createdAt: newQuestion.createdAt.toISOString(),
        updatedAt: newQuestion.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const err = error as Error;
    const message = err.message || "Unknown error";

    if (message.includes("ValidationError")) {
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "0");

    const questionsRaw = await Questions.find()
      .sort({ createdAt: -1 })
      .limit(limit > 0 ? limit : 0)
      .lean()
      .exec();

    const questions: LeanQuestion[] = (questionsRaw as RawQuestion[]).map((q) => ({
      _id: q._id.toString(),
      title: q.title || "",
      description: q.description || "",
      testcases: q.testcases || "",
      solutions: q.solutions || "",
      tags: Array.isArray(q.tags) ? q.tags : [],
      difficulty:
        q.difficulty === "easy" ||
        q.difficulty === "medium" ||
        q.difficulty === "hard"
          ? q.difficulty
          : "easy",
      createdAt: q.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: q.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions", details: err.message },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  try {
    await connectDB();
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
