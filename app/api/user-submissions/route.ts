// File: /app/api/user-submissions/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Submissions from "@/models/Submissions";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    if (!userEmail) {
      return NextResponse.json({ success: false, error: "Missing userEmail parameter" }, { status: 400 });
    }

    const submissions = await Submissions.find({ userEmail }).sort({ submittedAt: -1 }).lean();

    return NextResponse.json({ success: true, submissions }, { status: 200 });
  } catch (error) {
    console.error("Submission GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
