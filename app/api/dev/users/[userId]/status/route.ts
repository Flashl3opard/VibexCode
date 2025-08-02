import { NextResponse } from 'next/server';
import { Client, Users } from 'node-appwrite';

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const body = await req.json();
  const { status } = body; // e.g., 'active', 'banned'

  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const users = new Users(client);
    await users.updatePrefs(userId, { status });

    return NextResponse.json({ message: 'Status updated' });
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
