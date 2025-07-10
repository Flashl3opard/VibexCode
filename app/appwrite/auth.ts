// app/appwrite/auth.ts
import { Client, Account, ID } from 'appwrite';             // 🔧 add ID
// ❌  useId removed – hooks can’t be used in a class

class AuthService {
  private client: Client;
  private account: Account;

  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

    this.account = new Account(this.client);
  }

  // 🔧 signUp now uses ID.unique() instead of useId()
  async signUp(email: string, password: string, name: string) {
    return await this.account.create(ID.unique(), email, password, name);
  }

  async signIn(email: string, password: string) {
    return await this.account.createEmailPasswordSession(email, password);
  }

  async logout() {
    await this.account.deleteSession('current');
  }

  async checkUser() {
    return await this.account.get();
  }
}

const authservice = new AuthService();
export default authservice;
