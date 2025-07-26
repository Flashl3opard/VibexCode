// File: /app/api/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Submissions from "@/models/Submissions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userName, questionId, questionTitle, answerMarkdown, submittedAt } = await req.json();

    if (!userEmail || !questionId || !answerMarkdown) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: userEmail, questionId and answerMarkdown" },
        { status: 400 }
      );
    }

    await connectDB();

    const newSubmission = await Submissions.create({
      userEmail,
      userName,
      questionId,
      questionTitle,
      answerMarkdown,
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
    });

    return NextResponse.json({ success: true, submission: newSubmission }, { status: 201 });
  } catch (error) {
    console.error("Submission POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
