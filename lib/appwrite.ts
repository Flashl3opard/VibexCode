// lib/appwrite.ts
import { Client, Account } from "appwrite";

// Instantiate the client and account once to avoid reinitializing
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

const account = new Account(client);

export { client, account };
