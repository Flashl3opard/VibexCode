import { ClanService } from "@/lib/clan";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ clanId: string }> };

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { clanId } = await context.params;

  try {
    const body = await request.json();
    const { memberToKick, requesterId } = body;

    if (!memberToKick || !requesterId) {
      return NextResponse.json(
        { error: "memberToKick and requesterId are required" },
        { status: 400 }
      );
    }

    const success = await ClanService.kickMember(
      clanId,
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