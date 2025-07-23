import connectDB from "@/lib/mongodb";
import Questions from "@/models/Questions";
import { NextRequest, NextResponse } from "next/server";

// GET /api/questions/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is Promise now
): Promise<NextResponse> {
  await connectDB();

  const { id } = await context.params; // ✅ await params to get id string

  try {
    const question = await Questions.findById(id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, question },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error fetching question:", errorMessage);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
