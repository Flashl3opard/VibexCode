import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import { Types } from "mongoose";

// PATCH
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const { completed, userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { message: "Task not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { message: "Failed to update task", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId });

    if (!deletedTask) {
      return NextResponse.json(
        { message: "Task not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { message: "Failed to delete task", error: err.message },
      { status: 500 }
    );
  }
}
