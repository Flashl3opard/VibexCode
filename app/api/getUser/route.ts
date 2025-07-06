// app/api/getUser/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Users from "@/models/Users";


export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await mongoose.connect(process.env.MONGODB_URI!);

    const user = await Users.findOne({ email });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ username: user.username });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
