import { NextRequest, NextResponse } from "next/server";
// Using the client-side import as requested.
import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
const CLANS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_CLANS_COLLECTION_ID as string;

// GET information for a specific clan
export async function GET(
  request: NextRequest,
  { params }: { params: { clanId: string } }
) {
  try {
    const { clanId } = params;

    if (!clanId) {
      return NextResponse.json(
        { message: "Clan ID is required" },
        { status: 400 }
      );
    }

    // ⚠️ May fail if your collection does not allow read access
    const clanData = await databases.getDocument(
      DATABASE_ID,
      CLANS_COLLECTION_ID,
      clanId
    );

    return NextResponse.json(clanData);
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: "Failed to fetch clan data", error: errMessage },
      { status: 500 }
    );
  }
}
