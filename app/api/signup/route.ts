import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    console.log("✅ API hit: /api/signup");

    const body = await req.json();
    const { email, username, password } = body;
    console.log("📥 Received body:", body);

    if (!email || !username || !password) {
      console.log("⚠️ Missing fields");
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectToDB();
    console.log("🔗 Connected to DB");

    const userExists = await Users.findOne({ email });
    console.log("👀 Existing user?", userExists);

    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ New user saved");

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Server Error in /api/signup:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
