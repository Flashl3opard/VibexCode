import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

const account = new Account(client);
const databases = new Databases(client);

// ✅ helpers
export const getAppwriteClient = () => client;
export const getAppwriteDatabases = () => databases;

export { client, account, databases, ID, Query };
