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
  logout(): Promise<{ success: boolean; error?: string }>;
  checkUser(): Promise<Models.User<Models.Preferences> | null>;
  sendPasswordReset(email: string): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  createSocialUser(
    email: string,
    name: string,
    uid: string
  ): Promise<Models.User<Models.Preferences>>;
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
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(`Sign in failed: ${error.message}`);
      }
      throw error;
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      // First try to delete current session
      await this.account.deleteSession("current");
      console.log("✅ Current session deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Current session delete failed:", error);

      // Check if user is already logged out
      if (error instanceof AppwriteException && error.code === 401) {
        console.log("✅ User was already logged out");
        return { success: true };
      }

      // Fallback: try to delete all sessions
      try {
        await this.account.deleteSessions();
        console.log("✅ All sessions deleted successfully (fallback)");
        return { success: true };
      } catch (fallbackError) {
        console.error("❌ Fallback logout also failed:", fallbackError);

        // If fallback also fails due to 401, user is already logged out
        if (
          fallbackError instanceof AppwriteException &&
          fallbackError.code === 401
        ) {
          console.log("✅ User was already logged out (fallback check)");
          return { success: true };
        }

        return {
          success: false,
          error:
            fallbackError instanceof Error
              ? fallbackError.message
              : "Unknown logout error",
        };
      }
    }
  }

  async checkUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      if (
        error instanceof AppwriteException &&
        (error.code === 401 || error.message.includes("missing scope"))
      ) {
        return null;
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

  /**
   * Create user via social login (e.g., Firebase).
   * Tries to create and login Appwrite user using social data.
   */
  async createSocialUser(
    email: string,
    name: string,
    uid: string
  ): Promise<Models.User<Models.Preferences>> {
    try {
      // Check if session already exists (user is logged in)
      const existingUser = await this.checkUser();
      if (existingUser) {
        return existingUser;
      }

      // Secure random placeholder password
      const password = crypto.randomUUID();

      // Create user with Firebase UID as Appwrite user ID
      const newUser = await this.account.create(uid, email, password, name);

      // Create session
      await this.account.createEmailPasswordSession(email, password);

      return newUser;
    } catch (error) {
      console.error("Error creating social user:", error);
      throw error;
    }
  }
}

/* Export a singleton instance */
const authservice: AuthServiceContract = new AppwriteAuthService();
export default authservice;
