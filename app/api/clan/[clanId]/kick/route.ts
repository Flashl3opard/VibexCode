import { NextRequest, NextResponse } from "next/server";
import { ClanService } from "@/lib/clan";

interface RouteParams {
  params: {
    clanId: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { memberToKick, requesterId } = body;

    if (!memberToKick || !requesterId) {
      return NextResponse.json(
        { error: "memberToKick and requesterId are required" },
        { status: 400 }
      );
    }

    const success = ClanService.kickMember(
      params.clanId,
      memberToKick,
      requesterId
    );
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
