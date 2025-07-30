// app/api/clans/[key]/route.ts

import { NextRequest, NextResponse } from "next/server";

// Define the Clan interface (should match others)
interface Clan {
  name: string;
  key: string;
  members: string[];
}

// This should share the same clans storage as `clans/route.ts` and `join/route.ts`
// For the sake of this example, clans are re-declared here.
// In a real app, extract clans state to a shared module or use a database.
const clans: Record<string, Clan> = {};

// Handle GET /api/clans/:key to fetch clan info by key
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  const clan = clans[key];
  if (!clan) {
    return NextResponse.json({ error: "Clan not found" }, { status: 404 });
  }

  return NextResponse.json(clan);
}
