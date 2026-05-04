import { NextRequest, NextResponse } from "next/server";
import { getAppwriteDatabases } from "@/lib/appwrite"; // server-side client

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
const CLANS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_CLANS_COLLECTION_ID as string;
const PROFILES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROFILES_COLLECTION_ID as string;

// GET the current user's clan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const databases = getAppwriteDatabases();

    const profile = await databases.getDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      userId
    );

    if (!profile.clanId) {
      return NextResponse.json(
        { message: "User not in a clan" },
        { status: 404 }
      );
    }

    const clanData = await databases.getDocument(
      DATABASE_ID,
      CLANS_COLLECTION_ID,
      profile.clanId as string
    );

    return NextResponse.json(clanData);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as any).code === 404
    ) {
      return NextResponse.json(
        { message: "User not in a clan" },
        { status: 404 }
      );
    }

    const errMessage =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { message: "Server error", error: errMessage },
      { status: 500 }
    );
  }
}
