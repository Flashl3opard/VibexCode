import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

interface TaskBody {
  text: string;
  priority: "low" | "medium" | "high";
  userId: string;
}

export async function GET(req: NextRequest) {
  await connectDB();

  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  try {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { message: "Failed to fetch tasks", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { text, priority, userId } = (await req.json()) as TaskBody;

    if (!text || !priority || !userId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newTask = await Task.create({ text, priority, userId });
    return NextResponse.json(newTask);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { message: "Failed to create task", error: err.message },
      { status: 500 }
    );
  }
}
