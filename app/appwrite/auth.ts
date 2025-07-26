import { Client, Account, ID, Models, AppwriteException } from "appwrite";

/**
 * Contract every auth service must fulfill.
 * Uses the exact return types the v12 SDK gives us.
 */

export const accountInstance = new Account(
  new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string)
);
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
  updatePassword(
    userId: string,
    secret: string,
    newPassword: string
  ): Promise<Models.Token>;
}

/**
 * Concrete Appwrite implementation.
 */
class AppwriteAuthService implements AuthServiceContract {
  private client: Client;
  private account: Account;
  private readonly resetRedirect = `${process.env.NEXT_PUBLIC_APP_URL}/resetPassword`;

  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

    this.account = new Account(this.client);
  }

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
      // Attempt to delete current session
      await this.account.deleteSession("current");
      return { success: true };
    } catch (error) {
      // If unauthorized, treat as success (session already deleted)
      if (error instanceof AppwriteException && error.code === 401) {
        return { success: true };
      }

      // Fallback: delete all sessions
      try {
        await this.account.deleteSessions();
        return { success: true };
      } catch (fallbackError) {
        if (
          fallbackError instanceof AppwriteException &&
          fallbackError.code === 401
        ) {
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
      return await this.account.get();
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

  async updatePassword(
    userId: string,
    secret: string,
    newPassword: string
  ): Promise<Models.Token> {
    try {
      return await this.account.updateRecovery(userId, secret, newPassword);
    } catch (error) {
      if (error instanceof AppwriteException) {
        throw new Error(`Password update failed: ${error.message}`);
      }
      throw error;
    }
  }

  async createSocialUser(
    email: string,
    name: string,
    uid: string
  ): Promise<Models.User<Models.Preferences>> {
    try {
      const existingUser = await this.checkUser();
      if (existingUser) return existingUser;

      // Use a crypto-polyfill or fallback if crypto.randomUUID() is not available
      const generateUUID = () => {
        if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
          return crypto.randomUUID();
        } else {
          // fallback UUID v4 generator
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            (c) => {
              const r = (Math.random() * 16) | 0;
              const v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            }
          );
        }
      };

      const password = generateUUID();

      // IMPORTANT: Make sure `uid` value complies with Appwrite user ID requirements
      // It should be a string with allowed characters and length <= 36.

      const newUser = await this.account.create(uid, email, password, name);

      // Auto-login by creating session for the new user
      await this.account.createEmailPasswordSession(email, password);

      return newUser;
    } catch (error) {
      console.error("Error creating social user:", error);
      throw error;
    }
  }
}

/* Export singleton */
const authservice: AuthServiceContract = new AppwriteAuthService();

export default authservice;
