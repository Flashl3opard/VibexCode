import { NextRequest, NextResponse } from "next/server";
// Using the client-side import as requested.
import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
const PROFILES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROFILES_COLLECTION_ID as string;

// POST to join a clan
export async function POST(request: NextRequest) {
  try {
    const { userId, clanId } = await request.json();

    if (!userId || !clanId) {
      return NextResponse.json(
        { message: "User ID and Clan ID are required" },
        { status: 400 }
      );
    }

    // ⚠️ This may fail if the Appwrite instance is not authenticated
    await databases.updateDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      userId,
      { clanId }
    );

    return NextResponse.json({ message: "Successfully joined clan" });
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: "Failed to join clan", error: errMessage },
      { status: 500 }
    );
  }
}
