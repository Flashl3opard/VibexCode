import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Messages";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    await connectDB();
    const { conversationId } = await context.params; // await here

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });

    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> } // params is a Promise here too
) {
  try {
    await connectDB();
    const { conversationId } = await context.params; // <-- await added

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    const body = await req.json();
    const { senderId, senderName, body: messageBody, image } = body;

    if (!senderId || !messageBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMessage = new Message({
      conversation: conversationId,
      sender: senderId,
      senderName,
      body: messageBody,
      image,
    });

    await newMessage.save();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("❌ Error saving message:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


