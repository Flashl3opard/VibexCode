/**
 * Auth service — Firebase-backed.
 *
 * Historically this wrapped Appwrite. We've consolidated auth onto Firebase
 * (one provider, no auto-pause, no dual-source-of-truth bugs). The exported
 * shape is preserved so callers in this repo keep working: `$id`, `name`,
 * `email`, `emailVerification` are populated from the Firebase user.
 *
 * The folder name `app/appwrite/` is kept only to avoid an import-path churn
 * across the codebase. Treat it as the "auth" folder.
 */

import { app } from "@/lib/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

const auth = getAuth(app);

/**
 * Public shape, preserved for backwards compatibility with callers that were
 * written against Appwrite's `Models.User<Models.Preferences>`.
 */
export interface AuthUser {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  /** Some legacy callers spread or read from `prefs`; keep it as an empty object. */
  prefs: Record<string, unknown>;
}

/** Lightweight session marker — callers only check truthiness. */
export interface AuthSession {
  $id: string;
  userId: string;
}

export interface AuthServiceContract {
  signUp(email: string, password: string, name: string): Promise<AuthUser>;
  signIn(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<{ success: boolean; error?: string }>;
  checkUser(): Promise<AuthUser | null>;
  sendPasswordReset(email: string): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  createSocialUser(
    email: string,
    name: string,
    uid: string
  ): Promise<AuthUser>;
  /**
   * For Firebase, the password reset URL carries an `oobCode` rather than
   * Appwrite's `userId`+`secret`. The first arg is unused — the second arg is
   * the oobCode from the URL — and the third is the new password.
   */
  updatePassword(
    userId: string,
    secretOrOobCode: string,
    newPassword: string
  ): Promise<{ $id: string }>;
}

function fromFirebaseUser(u: FirebaseUser): AuthUser {
  return {
    $id: u.uid,
    name: u.displayName || u.email?.split("@")[0] || "User",
    email: u.email || "",
    emailVerification: u.emailVerified,
    prefs: {},
  };
}

class FirebaseAuthService implements AuthServiceContract {
  async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name && cred.user) {
      try {
        await updateProfile(cred.user, { displayName: name });
      } catch {
        // Non-fatal — we have a user, just no displayName persisted.
      }
    }
    return fromFirebaseUser(cred.user);
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { $id: cred.user.uid, userId: cred.user.uid };
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown logout error",
      };
    }
  }

  /**
   * Resolves the current user. Waits for the first `onAuthStateChanged` event
   * so a freshly-loaded page doesn't return null while Firebase rehydrates
   * the session from local storage.
   */
  checkUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user ? fromFirebaseUser(user) : null);
        },
        () => {
          unsubscribe();
          resolve(null);
        }
      );
    });
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.checkUser()) !== null;
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  async updatePassword(
    _userId: string,
    oobCode: string,
    newPassword: string
  ): Promise<{ $id: string }> {
    await confirmPasswordReset(auth, oobCode, newPassword);
    return { $id: oobCode };
  }

  /**
   * For social logins: Firebase already populated `auth.currentUser` after
   * `signInWithPopup`. Just return it (or wait for it via onAuthStateChanged).
   * The legacy Appwrite implementation created a parallel Appwrite user with
   * the social user's email — we no longer need that bookkeeping.
   */
  // The Appwrite-era signature carried email/name/uid because we had to mirror
  // the Firebase user into Appwrite. Firebase already has the user after
  // signInWithPopup, so we just resolve whatever Firebase says is current.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createSocialUser(_email: string, _name: string, _uid: string): Promise<AuthUser> {
    const u = await this.checkUser();
    if (u) return u;
    throw new Error("Social sign-in did not produce a Firebase user");
  }
}

const authservice: AuthServiceContract = new FirebaseAuthService();
export default authservice;
