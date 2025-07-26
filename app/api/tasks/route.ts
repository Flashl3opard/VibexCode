import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // ✅ your MongoDB connection
import Task from "@/models/Tasks"; // ✅ your Task model

// GET: Fetch all tasks
export async function GET() {
  await connectDB();

  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST: Add a new task
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const newTask = await Task.create(body);
    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add task" },
      { status: 500 }
    );
  }
}
