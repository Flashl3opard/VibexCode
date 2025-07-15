// app/appwrite/auth.ts
import { Client, Account, ID, Models, AppwriteException } from "appwrite";

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

  checkUser(): Promise<Models.User<Models.Preferences> | null>;

  /** Send a reset‑password e‑mail that redirects to /reset-password */
  sendPasswordReset(email: string): Promise<void>;

  /** Check if user is authenticated */
  isAuthenticated(): Promise<boolean>;
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
    try {
      // Returns User<Preferences> in SDK v12
      return await this.account.create(ID.unique(), email, password, name);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(`Sign up failed: ${error.message}`);
      }
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      // Returns Session in SDK v12
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(`Sign in failed: ${error.message}`);
      }
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch {
      // Ignore errors during logout - user might already be logged out
      console.warn("Logout warning: user may already be logged out");
    }
  }

  async checkUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await this.account.get();
    } catch (error) {
      if (error instanceof AppwriteException) {
        // If user is not authenticated, return null instead of throwing
        if (error.code === 401 || error.message.includes("missing scope")) {
          return null;
        }
      }
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.checkUser();
      return user !== null;
    } catch {
      return false;
    }
  }

  /**
   * Password‑reset flow for **SDK v12**.
   * If you ever upgrade to v13, change this to `createEmailPasswordRecovery`.
   */
  async sendPasswordReset(email: string) {
    try {
      await this.account.createRecovery(email, this.resetRedirect);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(`Password reset failed: ${error.message}`);
      }
      throw error;
    }
  }
}

/* Export a singleton instance */
const authservice: AuthServiceContract = new AppwriteAuthService();
export default authservice;
