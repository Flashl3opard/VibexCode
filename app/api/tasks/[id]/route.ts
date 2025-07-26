import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import { Types } from "mongoose";

// ✅ PATCH = toggle completed
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise here
) {
  await connectDB();

  const { id } = await params; // await params to get id
  const { completed } = await req.json();

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    await Task.findByIdAndUpdate(id, { completed });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}

// ✅ DELETE = remove task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise here
) {
  await connectDB();

  const { id } = await params; // await params to get id

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
