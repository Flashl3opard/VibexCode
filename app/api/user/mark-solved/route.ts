import { NextRequest, NextResponse } from "next/server";
import { Client } from "appwrite";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/Users";

// Load environment variables and validate
const appwriteEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
const appwriteProject = process.env.NEXT_PUBLIC_PROJECT_ID;
const appwriteKey = process.env.APPWRITE_API_KEY;

if (!appwriteEndpoint || !appwriteProject || !appwriteKey) {
  throw new Error("Missing required Appwrite environment variables");
}

const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProject);

export async function POST(req: NextRequest) {
  try {
    // Get Authorization header (case-insensitive)
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer", "").trim();
    if (!token) {
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
    }

    // Verify JWT with Appwrite
    const verifyResponse = await fetch(
      `${appwriteEndpoint}/account/sessions/jwt/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": appwriteProject!,  // non-null assertion
          "X-Appwrite-Key": appwriteKey!,          // non-null assertion
        },
        body: JSON.stringify({ jwt: token }),
      }
    );

    if (!verifyResponse.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const verifyData = await verifyResponse.json();
    const appwriteId = verifyData.userId || verifyData.$id || verifyData.user_id;

    if (!appwriteId) {
      return NextResponse.json(
        { error: "Appwrite user ID not found" },
        { status: 401 }
      );
    }

    // Parse JSON body
    const body = await req.json();
    const { questionId } = body;
    if (!questionId || typeof questionId !== "string") {
      return NextResponse.json({ error: "Invalid questionId" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await UserModel.findOne({ appwriteId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize solvedQuestions array if not present
    if (!user.solvedQuestions) user.solvedQuestions = [];

    // Add questionId if not already solved
    if (!user.solvedQuestions.includes(questionId)) {
      user.solvedQuestions.push(questionId);
      await user.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking solved question:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
