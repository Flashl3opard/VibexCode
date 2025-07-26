import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Messages";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const { senderId, body: newBody } = await req.json();

    if (!senderId || !newBody) {
      return NextResponse.json(
        { error: "Missing required fields (senderId or body)" },
        { status: 400 }
      );
    }

    const msgToUpdate = await Message.findById(id);
    if (!msgToUpdate) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (msgToUpdate.sender.toString() !== senderId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    msgToUpdate.body = newBody;
    await msgToUpdate.save();

    return NextResponse.json(
      { success: true, message: "Message updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/message/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const url = new URL(req.url);
    const senderId = url.searchParams.get("senderId");

    if (!senderId) {
      return NextResponse.json(
        { error: "Missing senderId in query parameters" },
        { status: 400 }
      );
    }

    const msgToDelete = await Message.findById(id);
    if (!msgToDelete) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (msgToDelete.sender.toString() !== senderId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await msgToDelete.deleteOne();

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/message/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
