import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/Users";



// POST /api/user/mark-solved
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No auth token" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });

    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/account/sessions/jwt/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.NEXT_PUBLIC_PROJECT_ID!,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY!,
        },
        body: JSON.stringify({ jwt: token }),
      }
    );

    if (!verifyResponse.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const verifyData = await verifyResponse.json();

    await connectDB();
    const user = await UserModel.findOne({ appwriteId: verifyData.userId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const questionId = body.questionId;
    if (!questionId || typeof questionId !== "string") {
      return NextResponse.json({ error: "Invalid questionId" }, { status: 400 });
    }

    if (!user.solvedQuestions) user.solvedQuestions = [];
    if (!user.solvedQuestions.includes(questionId)) {
      user.solvedQuestions.push(questionId);
      await user.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking solved question with Appwrite auth:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
