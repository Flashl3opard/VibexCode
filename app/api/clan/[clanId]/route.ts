import { NextRequest, NextResponse } from "next/server";
import { ClanService } from "@/lib/clan";

interface RouteParams {
  params: {
    clanId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const clan = ClanService.getClanById(params.clanId);
    if (!clan) {
      return NextResponse.json({ error: "Clan not found" }, { status: 404 });
    }
    return NextResponse.json({ clan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { updates, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    const clan = ClanService.updateClan(params.clanId, updates, userId);
    return NextResponse.json({ clan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
