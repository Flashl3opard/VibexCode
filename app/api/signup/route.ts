
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Users from "@/models/Users";




export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();
    await connectToDB();

    const userExists = await Users.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const newUser = new Users({ email, username, password });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
