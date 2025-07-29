import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases, ID, Query };
