import { NextRequest, NextResponse } from "next/server";
import { ClanService } from "@/lib/clan";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Get user's clan
      const clan = ClanService.getUserClan(userId);
      return NextResponse.json({ clan });
    } else {
      // Get all clans
      const clans = ClanService.getAllClans();
      return NextResponse.json({ clans });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, creatorId, description } = body;

    if (!name || !creatorId) {
      return NextResponse.json(
        { error: "Name and creatorId are required" },
        { status: 400 }
      );
    }

    const clan = ClanService.createClan(name, creatorId, description);
    return NextResponse.json({ clan }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
