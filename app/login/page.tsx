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
import { FaFacebook, FaGithub } from "react-icons/fa";
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

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export default function Page() {
  // ---------------- Types -----------------
  type Hform = { email: string; password: string };

  // ---------------- Hooks -----------------
  const [banner, setBanner] = useState<{ msg: string; type: "error" | "ok" }>();
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Hform>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // -------------- Social Login Handler ------------------
  // Social Login Handler with better error handling
  const handleSocialLogin = async (provider: AuthProvider) => {
    if (loadingSocial) return;

    setLoadingSocial(true);
    setBanner(undefined);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Social login successful:", user);

      // You can integrate this with your Appwrite auth here
      // For now, just show success message
      setBanner({
        msg: `Welcome ${user.displayName || user.email}!`,
        type: "ok",
      });

      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      console.error("Social login error:", error);

      let errorMessage = "Social login failed. Please try again.";

      if (error.code) {
        switch (error.code) {
          case "auth/cancelled-popup-request":
            errorMessage = "Login cancelled.";
            break;
          case "auth/popup-closed-by-user":
            errorMessage = "Login popup was closed.";
            break;
          case "auth/popup-blocked":
            errorMessage = "Popup was blocked by browser. Please allow popups.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "This sign-in method is not enabled.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage = "Account exists with different credentials.";
            break;
          default:
            errorMessage = `Login failed: ${error.message}`;
        }
      }

      setBanner({ msg: errorMessage, type: "error" });
    } finally {
      setLoadingSocial(false);
    }
  };

  // -------------- Submit ------------------
  const onSubmit = async (data: Hform) => {
    setBanner(undefined);
    setLoading(true);

    try {
      // Step 1: Sign in the user
      const session = await authservice.signIn(data.email, data.password);

      if (session) {
        // Step 2: Get user data - this should work since we have a session
        try {
          const userData = await authservice.checkUser();

          if (userData) {
            // Step 3: Update Redux state
            dispatch(login({ status: true, userData }));
            setBanner({ msg: "Sign‑in successful! Redirecting…", type: "ok" });

            // Small delay to show success message
            setTimeout(() => {
              router.push("/");
            }, 1000);
          } else {
            // This shouldn't happen but let's handle it
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
    } catch (err: any) {
      console.error("Sign‑in error:", err);

      // Handle specific authentication errors
      if (err.message) {
        if (
          err.message.includes("invalid_credentials") ||
          err.message.includes("Invalid credentials") ||
          err.message.includes("user_invalid_credentials")
        ) {
          setBanner({
            msg: "Invalid email or password. Please try again.",
            type: "error",
          });
        } else if (err.message.includes("too_many_requests")) {
          setBanner({
            msg: "Too many login attempts. Please wait a moment and try again.",
            type: "error",
          });
        } else if (err.message.includes("user_not_found")) {
          setBanner({
            msg: "No account found with this email. Please sign up first.",
            type: "error",
          });
        } else {
          setBanner({ msg: `Login failed: ${err.message}`, type: "error" });
        }
      } else {
        setBanner({ msg: "Sign‑in failed. Please try again.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------- UI ----------------------
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 dark:bg-[#020612] transition-all duration-300">
        {/* Illustration */}
        <div className="hidden lg:block absolute left-4 xl:left-30 top-0 h-full scale-90 -translate-x-15 -translate-y-10">
          <Image
            src="/assets/login.svg"
            alt="Student"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
          />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:ml-auto lg:mr-[10vw] xl:mr-[15vw] min-h-[580px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between min-h-[580px]">
            {/* Logo */}
            <div className="text-center mb-6 sm:mb-8">
              <Link href="/">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-pink-600">VibeX</span>
                  <span className="text-gray-400 dark:text-white">Code</span>
                </h1>
              </Link>
            </div>

            {/* Form */}
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

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 1,
                        message: "Password is required",
                      },
                    })}
                    className="w-full p-3 sm:p-4 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    disabled={loading}
                  />
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

              {/* Links under inputs */}
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

            {/* Social auth */}
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
