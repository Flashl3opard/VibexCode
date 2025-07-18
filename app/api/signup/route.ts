import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Create response
    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          email: newUser.email,
          username: newUser.username,
        },
      },
      { status: 201 }
    );

    // ✅ Set login cookie
    response.headers.set(
      "Set-Cookie",
      `token=loggedin; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
