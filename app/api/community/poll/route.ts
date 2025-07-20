
import connectDB from "@/lib/mongodb";
import { Poll } from "@/models/Polls";

import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  let poll = await Poll.findOne({ question: "Topic for first test" });

  if (!poll) {
    poll = await Poll.create({
      question: "Topic for first test",
      options: ["Frontend", "Backend", "Fullstack", "AI", "DSA"],
      votes: {
        Frontend: 0,
        Backend: 0,
        Fullstack: 0,
        AI: 0,
        DSA: 0,
      },
    });
  }

  return NextResponse.json(poll);
}

export async function POST(req: Request) {
  const { option } = await req.json();
  await connectDB();

  const poll = await Poll.findOne({ question: "Topic for first test" });
  if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });

  const prev = poll.votes.get(option) || 0;
  poll.votes.set(option, prev + 1);
  await poll.save();

  return NextResponse.json(poll);
}
