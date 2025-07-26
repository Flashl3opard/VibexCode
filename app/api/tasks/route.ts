import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; //
import Task from "@/models/Tasks"; //

// GET: Fetch all tasks
export async function GET() {
  await connectDB();

  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
    console.error("Error adding new task:", error);
    return NextResponse.json(
      { message: "Failed to add task" },
      { status: 500 }
    );
  }
}
