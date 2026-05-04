import { NextRequest, NextResponse } from "next/server";
// Using the client-side import as requested.
import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
const PROFILES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROFILES_COLLECTION_ID as string;

// POST to leave a clan
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // ⚠️ This may fail with 401 Unauthorized unless Appwrite is authenticated
    await databases.updateDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      userId,
      { clanId: null }
    );

    return NextResponse.json({ message: "Successfully left clan" });
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: "Failed to leave clan", error: errMessage },
      { status: 500 }
    );
  }
}
