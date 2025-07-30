// app/api/clans/route.ts

import { NextRequest, NextResponse } from "next/server";

// Define the Clan interface
interface Clan {
  name: string;
  key: string;
  members: string[];
}

// In-memory "database"
// In a real app, use a DB instead!
const clans: Record<string, Clan> = {};

// Helper to generate a unique key
function generateKey(name: string): string {
  return (
    name.trim().toLowerCase().replace(/[\s]+/g, "-") +
    "-" +
    Math.floor(1000 + Math.random() * 9000)
  );
}

// Handle POST: create clan
export async function POST(request: NextRequest) {
  const { name, creator } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const key = generateKey(name);
  clans[key] = {
    name,
    key,
    members: creator ? [creator] : [],
  };

  return NextResponse.json(clans[key], { status: 201 });
}

// Handle GET: list all clans (optional)
export async function GET() {
  // Returns all clans (array) for demo/testing
  return NextResponse.json(Object.values(clans));
}
