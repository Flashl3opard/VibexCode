import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.headers.set(
    "Set-Cookie",
    "token=; Path=/; HttpOnly; Max-Age=0"
  );
  return response;
}
