// app/api/clans/join/route.ts

import { NextRequest, NextResponse } from "next/server";
import { clans, Clan } from "@/lib/clan";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, member } = body;

    if (!key) {
      return NextResponse.json(
        { error: "Join key is required" },
        { status: 400 }
      );
    }

    const clan = clans[key];
    if (!clan) {
      return NextResponse.json({ error: "Clan not found" }, { status: 404 });
    }

    if (member && !clan.members.includes(member)) {
      clan.members.push(member);
    }

    return NextResponse.json(clan);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
