"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import authservice from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../store/store";
import { login } from "../store/authSlice";
import { FaFacebook, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  type AuthProvider,
} from "firebase/auth";
import { app } from "@/lib/firebase";

// Firebase setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Types
type Hform = { email: string; password: string };
type Banner = { msg: string; type: "error" | "ok" };
type AppwriteErr = { message?: string };

interface UserData {
  $id: string;
  name: string;
  email: string;
  emailVerification?: boolean;
}

export default function Page() {
  const [banner, setBanner] = useState<Banner>();
  const [loading, setLoading] = useState(false);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Hform>();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSuccessfulAuth = async (userData: UserData, message: string) => {
    dispatch(login({ status: true, userData }));
    setBanner({ msg: message, type: "ok" });
    document.cookie = `token=${userData.$id || "loggedin"}; path=/;`;
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1000);
  };

  const handleSocialLogin = async (provider: AuthProvider) => {
    if (loadingSocial) return;
    setLoadingSocial(true);
    setBanner(undefined);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Social login successful:", user);

      const mockUserData: UserData = {
        $id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email || "unknown",
        emailVerification: user.emailVerified,
      };

      await handleSuccessfulAuth(
        mockUserData,
        `Welcome ${user.displayName || user.email}!`
      );
    } catch (error: unknown) {
      console.error("Social login error:", error);
      let errorMessage = "Social login failed. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code: unknown }).code === "string"
      ) {
        const errorCode = (error as { code: string }).code;

        switch (errorCode) {
          case "auth/cancelled-popup-request":
            errorMessage = "Login cancelled.";
            break;
          case "auth/popup-closed-by-user":
            errorMessage = "Login popup was closed.";
            break;
          case "auth/popup-blocked":
            errorMessage = "Popup was blocked by browser.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "This sign-in method is not enabled.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage = "Account exists with different credentials.";
            break;
          default:
            errorMessage =
              "message" in error && typeof error.message === "string"
                ? `Login failed: ${error.message}`
                : "Login failed.";
        }
      }

      setBanner({ msg: errorMessage, type: "error" });
    } finally {
      setLoadingSocial(false);
    }
  };

  const onSubmit = async (data: Hform) => {
    setBanner(undefined);
    setLoading(true);

    try {
      const session = await authservice.signIn(data.email, data.password);

      if (session) {
        try {
          const userData = await authservice.checkUser();

          if (userData) {
            await handleSuccessfulAuth(
              userData,
              "Sign‑in successful! Redirecting…"
            );
          } else {
            setBanner({
              msg: "Authentication failed. Please try again.",
              type: "error",
            });
          }
        } catch (userError) {
          console.error("Error fetching user data:", userError);
          setBanner({
            msg: "Failed to load user data. Please try again.",
            type: "error",
          });
        }
      }
    } catch (err: unknown) {
      const { message } = (err as AppwriteErr) ?? {};

      if (message) {
        if (
          message.includes("invalid_credentials") ||
          message.includes("Invalid credentials") ||
          message.includes("user_invalid_credentials")
        ) {
          setBanner({
            msg: "Invalid email or password. Please try again.",
            type: "error",
          });
        } else if (message.includes("too_many_requests")) {
          setBanner({
            msg: "Too many login attempts. Please wait a moment.",
            type: "error",
          });
        } else if (message.includes("user_not_found")) {
          setBanner({
            msg: "No account found with this email. Please sign up first.",
            type: "error",
          });
        } else {
          setBanner({ msg: `Login failed: ${message}`, type: "error" });
        }
      } else {
        setBanner({ msg: "Sign‑in failed. Please try again.", type: "error" });
      }

      console.error("Sign‑in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 dark:bg-[#020612] transition-all duration-300">
        <div className="hidden lg:block absolute left-4 xl:left-30 top-0 h-full scale-90 -translate-x-15 -translate-y-10">
          <Image
            src="/assets/login.svg"
            alt="Student"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
          />
        </div>

        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:ml-auto lg:mr-[10vw] xl:mr-[15vw] min-h-[580px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between min-h-[580px]">
            <div className="text-center mb-6 sm:mb-8">
              <Link href="/">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-pink-600">VibeX</span>
                  <span className="text-gray-400 dark:text-white">Code</span>
                </h1>
              </Link>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
              {banner && (
                <div
                  className={`text-center text-sm px-2 py-2 rounded-md ${
                    banner.type === "error"
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      : "text-green-500 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  }`}
                >
                  {banner.msg}
                </div>
              )}

              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <input
                    type="email"
                    placeholder="Mail ID"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full p-3 sm:p-4 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 1, message: "Password is required" },
                    })}
                    className="w-full p-3 sm:p-4 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10"
                    disabled={loading}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-300 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Logging in…" : "Log In"}
                </button>
              </form>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Link href="/forgot-password">
                  <span className="cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="cursor-pointer text-purple-500 hover:underline">
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 space-y-4">
              <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Or sign in with
              </div>
              <div className="flex justify-center gap-4 sm:gap-6 text-2xl sm:text-3xl">
                <FcGoogle
                  className={`cursor-pointer hover:scale-110 transition ${
                    loadingSocial ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={() => handleSocialLogin(googleProvider)}
                />
                <FaGithub
                  className={`cursor-pointer hover:scale-110 transition dark:text-white ${
                    loadingSocial ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={() => handleSocialLogin(githubProvider)}
                />
                <FaFacebook
                  className={`text-blue-500 cursor-pointer hover:scale-110 transition ${
                    loadingSocial ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={() => handleSocialLogin(facebookProvider)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
