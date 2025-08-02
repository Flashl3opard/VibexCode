// lib/clans.ts
export interface Clan {
  id: string;
  name: string;
  key: string;
  members: string[];
  createdAt: Date;
  createdBy: string;
  description?: string;
  maxMembers?: number;
}

export interface ClanMember {
  userId: string;
  username: string;
  joinedAt: Date;
  role: "owner" | "admin" | "member";
}

// In-memory clan store (replace with database in production)
export const clans: Record<string, Clan> = {};
export const userClans: Record<string, string> = {}; // userId -> clanId mapping

// Helper to generate a unique key
export function generateKey(name: string): string {
  const baseKey = name.trim().toLowerCase().replace(/[\s]+/g, "-");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${baseKey}-${randomSuffix}`;
}

// Helper to generate unique clan ID
export function generateClanId(): string {
  return `clan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Clan service functions
export class ClanService {
  static createClan(
    name: string,
    creatorId: string,
    description?: string
  ): Clan {
    if (!name.trim()) {
      throw new Error("Clan name cannot be empty");
    }

    if (userClans[creatorId]) {
      throw new Error("User is already in a clan");
    }

    const clanId = generateClanId();
    const key = generateKey(name);

    // Ensure unique key
    let finalKey = key;
    let counter = 1;
    while (Object.values(clans).some((clan) => clan.key === finalKey)) {
      finalKey = `${key}-${counter}`;
      counter++;
    }

    const newClan: Clan = {
      id: clanId,
      name: name.trim(),
      key: finalKey,
      members: [creatorId],
      createdAt: new Date(),
      createdBy: creatorId,
      description,
      maxMembers: 50, // Default max members
    };

    clans[clanId] = newClan;
    userClans[creatorId] = clanId;

    return newClan;
  }

  static joinClan(joinKey: string, userId: string): Clan {
    if (userClans[userId]) {
      throw new Error("User is already in a clan");
    }

    const clan = Object.values(clans).find((c) => c.key === joinKey);
    if (!clan) {
      throw new Error("Invalid join key");
    }

    if (clan.maxMembers && clan.members.length >= clan.maxMembers) {
      throw new Error("Clan is full");
    }

    if (clan.members.includes(userId)) {
      throw new Error("User is already a member of this clan");
    }

    clan.members.push(userId);
    userClans[userId] = clan.id;

    return clan;
  }

  static leaveClan(userId: string): boolean {
    const clanId = userClans[userId];
    if (!clanId) {
      throw new Error("User is not in any clan");
    }

    const clan = clans[clanId];
    if (!clan) {
      throw new Error("Clan not found");
    }

    // Remove user from clan
    clan.members = clan.members.filter((memberId) => memberId !== userId);
    delete userClans[userId];

    // If clan is empty, delete it
    if (clan.members.length === 0) {
      delete clans[clanId];
    }

    return true;
  }

  static getUserClan(userId: string): Clan | null {
    const clanId = userClans[userId];
    if (!clanId || !clans[clanId]) {
      return null;
    }
    return clans[clanId];
  }

  static getClanByKey(key: string): Clan | null {
    return Object.values(clans).find((clan) => clan.key === key) || null;
  }

  static getClanById(clanId: string): Clan | null {
    return clans[clanId] || null;
  }

  static getAllClans(): Clan[] {
    return Object.values(clans);
  }

  static updateClan(
    clanId: string,
    updates: Partial<Clan>,
    userId: string
  ): Clan {
    const clan = clans[clanId];
    if (!clan) {
      throw new Error("Clan not found");
    }

    if (clan.createdBy !== userId) {
      throw new Error("Only clan owner can update clan details");
    }

    // Prevent updating critical fields
    const allowedUpdates = ["name", "description", "maxMembers"];
    const filteredUpdates: Partial<Clan> = {};

    for (const key of allowedUpdates) {
      if (updates[key as keyof Clan] !== undefined) {
        filteredUpdates[key as keyof Clan] = updates[key as keyof Clan];
      }
    }

    Object.assign(clan, filteredUpdates);
    return clan;
  }

  static kickMember(
    clanId: string,
    memberToKick: string,
    requesterId: string
  ): boolean {
    const clan = clans[clanId];
    if (!clan) {
      throw new Error("Clan not found");
    }

    if (clan.createdBy !== requesterId) {
      throw new Error("Only clan owner can kick members");
    }

    if (memberToKick === requesterId) {
      throw new Error("Cannot kick yourself");
    }

    if (!clan.members.includes(memberToKick)) {
      throw new Error("User is not a member of this clan");
    }

    clan.members = clan.members.filter((memberId) => memberId !== memberToKick);
    delete userClans[memberToKick];

    return true;
  }
}
