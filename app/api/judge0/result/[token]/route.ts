import { NextRequest, NextResponse } from "next/server";

const JUDGE0_RESULT_URL = "https://judge0-ce.p.rapidapi.com/submissions";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const params = await context.params;
    const { token } = params;

    const res = await fetch(`${JUDGE0_RESULT_URL}/${token}`, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY as string,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to get result" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      compile_output: data.compile_output || "",
      status: data.status || {},
      time: data.time || null,
      memory: data.memory || null,
    });
  } catch (err) {
    console.error("Result error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
