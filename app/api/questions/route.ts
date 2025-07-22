import { NextResponse } from "next/server";
import Questions from "@/models/Questions";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const question = await Questions.create(data);
    return NextResponse.json({ success: true, question });
  } catch (error) {
    const err = error as Error; // 👈 fix for 'unknown' type
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
