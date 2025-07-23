import { NextRequest, NextResponse } from "next/server";

const JUDGE0_SUBMIT_URL = "https://judge0-ce.p.rapidapi.com/submissions";

export async function POST(request: NextRequest) {
  try {
    const { source_code, language_id } = await request.json();

    if (!source_code || !language_id) {
      return NextResponse.json(
        { error: "Missing source_code or language_id" },
        { status: 400 }
      );
    }

    const res = await fetch(JUDGE0_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY as string,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code,
        language_id,
        stdin: "",
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Submit failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ token: data.token });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
