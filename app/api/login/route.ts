import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Users from "@/models/Users";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await Users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Set token cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );

    // Dummy token (you can use JWT or session ID here)
    const token = user._id.toString(); // or a JWT if you're using that

    response.cookies.set("token", token, {
      path: "/",
      httpOnly: false, // set to true if not accessing from frontend JS
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
