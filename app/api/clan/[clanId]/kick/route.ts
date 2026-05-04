import { NextRequest, NextResponse } from "next/server";
// Using the client-side import as requested.
import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
const PROFILES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROFILES_COLLECTION_ID as string;

// POST to kick a member from a clan
export async function POST(request: NextRequest) {
  try {
    const { userIdToKick } = await request.json();

    if (!userIdToKick) {
      return NextResponse.json(
        { message: "User ID to kick is required" },
        { status: 400 }
      );
    }

    // ⚠️ This may fail if your Appwrite instance isn’t authenticated with admin permissions
    await databases.updateDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      userIdToKick,
      { clanId: null }
    );

    return NextResponse.json({ message: "Successfully kicked user" });
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: "Failed to kick user", error: errMessage },
      { status: 500 }
    );
  }
}
