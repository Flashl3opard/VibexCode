import { NextResponse } from "next/server";
import { Questions } from "@/models/Questions";
import connectDB from "@/lib/mongodb";

type LeanQuestion = {
  _id: string | { toString(): string }; // Handles both ObjectId or string
  title?: string;
  description?: string;
  testcases?: string;
  solutions?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export async function POST(req: Request) {
  try {
    console.log("POST /api/questions - Starting request");

    // Connect to database with timeout
    console.log("Attempting to connect to database...");
    await connectDB();
    console.log("Database connected successfully");

    // Parse request data with error handling
    let data;
    try {
      data = await req.json();
      console.log("Received data:", JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON data" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.title?.trim()) {
      console.log("Validation failed: Missing title");
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!data.description?.trim()) {
      console.log("Validation failed: Missing description");
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    // Sanitize and prepare data
    const questionData = {
      title: data.title.trim(),
      description: data.description.trim(),
      testcases: data.testcases?.trim() || "",
      solutions: data.solutions?.trim() || "",
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag: string) => tag?.trim())
        : [],
    };

    console.log("Sanitized data:", questionData);

    // Create question with better error handling
    console.log("Attempting to create question...");
    const question = await Questions.create(questionData);
    console.log("Question created successfully:", question._id);

    return NextResponse.json({
      success: true,
      question: {
        _id: question._id,
        title: question.title,
        description: question.description,
        testcases: question.testcases,
        solutions: question.solutions,
        tags: question.tags,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("POST Error Details:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
      timestamp: new Date().toISOString(),
    });

    // Handle specific MongoDB/Mongoose errors
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: `Validation error: ${err.message}` },
        { status: 400 }
      );
    }

    if (err.name === "MongoServerError" || err.message.includes("MongoDB")) {
      return NextResponse.json(
        { success: false, error: "Database connection error" },
        { status: 503 }
      );
    }

    if (err.name === "CastError") {
      return NextResponse.json(
        { success: false, error: "Invalid data format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("GET /api/questions - Starting request");

    // Connect to database with timeout
    console.log("Attempting to connect to database...");
    await connectDB();
    console.log("Database connected successfully");

    // Fetch questions with error handling
    console.log("Fetching questions from database...");
    const questions = (await Questions.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec()) as LeanQuestion[];
    console.log(`Successfully fetched ${questions.length} questions`);

    // Transform questions to ensure consistent data structure
    const transformedQuestions = questions.map((q) => ({
      _id: q._id.toString(),
      title: q.title || "",
      description: q.description || "",
      testcases: q.testcases || "",
      solutions: q.solutions || "",
      tags: Array.isArray(q.tags) ? q.tags : [],
      createdAt: q.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: q.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      questions: transformedQuestions,
      count: transformedQuestions.length,
    });
  } catch (error) {
    const err = error as Error;
    console.error("GET Error Details:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
      timestamp: new Date().toISOString(),
    });

    // Handle specific MongoDB/Mongoose errors
    if (err.name === "MongoServerError" || err.message.includes("MongoDB")) {
      console.error("Database connection issue detected");
      return NextResponse.json(
        {
          success: false,
          error: "Database connection error",
          details:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        },
        { status: 503 }
      );
    }

    if (err.name === "MongooseError") {
      console.error("Mongoose error detected");
      return NextResponse.json(
        {
          success: false,
          error: "Database query error",
          details:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        },
        { status: 500 }
      );
    }

    // Network or connection timeout errors
    if (err.message.includes("timeout") || err.message.includes("ETIMEDOUT")) {
      console.error("Database timeout detected");
      return NextResponse.json(
        {
          success: false,
          error: "Database connection timeout",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD() {
  try {
    await connectDB();
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return new Response(null, { status: 503 });
  }
}
