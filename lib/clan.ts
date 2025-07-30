// lib/clans.ts

export interface Clan {
  name: string;
  key: string;
  members: string[];
}

// In-memory clan store (shared)
export const clans: Record<string, Clan> = {};

// Helper to generate a unique key
export function generateKey(name: string): string {
  return (
    name.trim().toLowerCase().replace(/[\s]+/g, "-") +
    "-" +
    Math.floor(1000 + Math.random() * 9000)
  );
}
