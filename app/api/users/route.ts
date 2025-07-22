// app/api/users/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";

export async function GET() {
  try {
    await connectDB();

    const users = await Users.find({}, "email username").lean(); // `name`, `status`, `activity` are not in schema

    return new NextResponse(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
