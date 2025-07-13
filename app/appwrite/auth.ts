// app/appwrite/auth.ts
import { Client, Account, ID, Models } from "appwrite";

/**
 * Contract every auth service must fulfil.
 * Uses the exact return types the v12 SDK gives us.
 */
export interface AuthServiceContract {
  signUp(
    email: string,
    password: string,
    name: string
  ): Promise<Models.User<Models.Preferences>>;

  signIn(email: string, password: string): Promise<Models.Session>;

  logout(): Promise<void>;

  checkUser(): Promise<Models.User<Models.Preferences>>;

  /** Send a reset‑password e‑mail that redirects to /reset-password */
  sendPasswordReset(email: string): Promise<void>;
}

/**
 * Concrete Appwrite implementation.
 * Compatible with **SDK v12 or earlier** (uses `createRecovery`).
 */
class AppwriteAuthService implements AuthServiceContract {
  private client: Client;
  private account: Account;
  private readonly resetRedirect = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;

  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

    this.account = new Account(this.client);
  }

  /* ───────────── Auth methods ───────────── */

  async signUp(email: string, password: string, name: string) {
    // Returns User<Preferences> in SDK v12
    return this.account.create(ID.unique(), email, password, name);
  }

  async signIn(email: string, password: string) {
    // Returns Session in SDK v12
    return this.account.createEmailPasswordSession(email, password);
  }

  async logout() {
    await this.account.deleteSessions();
  }

  async checkUser() {
    return this.account.get();
  }

  /**
   * Password‑reset flow for **SDK v12**.
   * If you ever upgrade to v13, change this to `createEmailPasswordRecovery`.
   */
  async sendPasswordReset(email: string) {
    await this.account.createRecovery(email, this.resetRedirect);
  }
}

/* Export a singleton instance */
const authservice: AuthServiceContract = new AppwriteAuthService();
export default authservice;
