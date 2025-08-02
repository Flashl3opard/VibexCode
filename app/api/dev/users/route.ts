import { NextResponse } from 'next/server';
import { Client, Users } from 'node-appwrite';

export async function GET() {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!) // example: 'https://cloud.appwrite.io/v1'
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!); // secret API key

    const users = new Users(client);
    const allUsers = await users.list();

    return NextResponse.json(allUsers.users);
  } catch (error) {
    console.error("Failed to fetch Appwrite users:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
