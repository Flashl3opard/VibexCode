import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Messages from "@/models/Messages";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  const { conversationId } = req.query as { conversationId: string };

  try {
    await connectDB();

    const filter =
      mongoose.Types.ObjectId.isValid(conversationId)
        ? new mongoose.Types.ObjectId(conversationId)
        : conversationId; // accept string IDs like "global-community"

    const messages = await Messages.find({ conversation: filter })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (err) {
    console.error("❌  Fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
