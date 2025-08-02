import { NextRequest, NextResponse } from "next/server";
import { ClanService } from "@/lib/clan";

interface RouteParams {
  params: Promise<{
    clanId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { clanId } = await params;
    const clan = ClanService.getClanById(clanId);
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
    const { clanId } = await params;
    const body = await request.json();
    const { updates, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    const clan = ClanService.updateClan(clanId, updates, userId);
    return NextResponse.json({ clan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}