"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import authservice from "../appwrite/auth";
import { login } from "../store/authSlice";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  type AuthProvider,
} from "firebase/auth";
import { app } from "@/lib/firebase";

// ────────────────────────────────────────────
// Firebase social‑login setup
// ────────────────────────────────────────────
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────
type Hform = { email: string; password: string; name: string };

type ErrorWithMessage = { message?: string; code?: string };

type BannerMessage = { msg: string; type: "error" | "success" };

export default function Page() {
  // ────────── UI state ──────────
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState<BannerMessage>();

  // ────────── hooks ──────────
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Hform>();

  // ────────── helpers ──────────
  const clearMessages = () => {
    setError("");
    setBanner(undefined);
  };

  const setLoginCookie = (value: string = "loggedin") => {
    // Cookie valid for 7 days; adjust as needed
    document.cookie = `token=${value}; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
  };

  // ────────── social login ──────────
  const handleSocialLogin = async (provider: AuthProvider) => {
    if (loadingSocial) return;
    setLoadingSocial(true);
    clearMessages();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Mark user as logged‑in for middleware
      setLoginCookie(user.uid);

      setBanner({
        msg: `Welcome ${user.displayName || user.email}!`,
        type: "success",
      });

      setTimeout(() => router.push("/"), 1500);
    } catch (err: unknown) {
      console.error("Social login error:", err);
      const error = err as ErrorWithMessage;

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
            errorMessage = "Popup was blocked by the browser.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "This sign‑in method is not enabled.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage = "Account exists with different credentials.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      setBanner({ msg: errorMessage, type: "error" });
    } finally {
      setLoadingSocial(false);
    }
  };

  // ────────── e‑mail + password signup ──────────
  const onSubmit = async (data: Hform) => {
    clearMessages();
    setLoading(true);

    try {
      // 1️⃣  Create account in Appwrite
      const newUser = await authservice.signUp(
        data.email,
        data.password,
        data.name
      );

      if (newUser) {
        // 2️⃣  Sign in immediately to create session
        try {
          const session = await authservice.signIn(data.email, data.password);

          if (session) {
            // 3️⃣  Get user data & store in Redux
            const userData = await authservice.checkUser();
            if (userData) {
              dispatch(login({ status: true, userData }));

              // ✅ Mark user as logged‑in for middleware
              setLoginCookie(userData.$id || "loggedin");

              setBanner({
                msg: "Sign‑up successful! Redirecting…",
                type: "success",
              });
              setTimeout(() => router.push("/"), 1000);
              return;
            }
          }
        } catch (autoSignInErr) {
          console.error("Auto sign‑in failed:", autoSignInErr);
          // Account created but session missing → force manual login
          setBanner({
            msg: "Account created successfully! Please log in.",
            type: "success",
          });
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
      }
    } catch (err: unknown) {
      const error = err as ErrorWithMessage;
      console.error("Registration error:", error);

      if (error.message) {
        if (error.message.includes("user_already_exists")) {
          setError("An account with this email already exists. Please log in.");
        } else if (error.message.includes("password")) {
          setError("Password must be at least 8 characters long.");
        } else if (error.message.includes("email")) {
          setError("Please enter a valid email address.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ────────── UI ──────────
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 dark:bg-[#020612] transition-all duration-300">
        {/* Illustration */}
        <div className="hidden lg:block absolute left-4 xl:left-30 top-0 h-full scale-90 -translate-x-20 -translate-y-10">
          <Image
            src="/assets/signup.svg"
            alt="Student"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
          />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:ml-auto lg:mr-[10vw] xl:mr-[15vw] min-h-[650px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between min-h-[650px]">
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email ID"
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

                {/* Username */}
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    {...register("name", {
                      required: "Username is required",
                      minLength: {
                        value: 2,
                        message: "Username must be at least 2 characters",
                      },
                    })}
                    className="w-full p-3 sm:p-4 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="w-full p-3 sm:p-4 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-100 transition"
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || loadingSocial}
                  className="w-full py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Creating Account…" : "Register"}
                </button>
              </form>

              {/* Error / success messages */}
              {error && (
                <p
                  className={`text-center text-sm px-2 ${
                    error.includes("successful")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {error}
                </p>
              )}

              {banner && (
                <p
                  className={`text-center text-sm px-2 ${
                    banner.type === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {banner.msg}
                </p>
              )}

              {/* Links */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span className="cursor-pointer hover:underline">
                  Already have an account?
                </span>
                <Link href="/login" className="text-purple-500 hover:underline">
                  Log In
                </Link>
              </div>
            </div>

            {/* Social auth */}
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Or sign up with
              </p>
              <div className="flex justify-center gap-4 sm:gap-6 text-2xl sm:text-3xl">
                <FcGoogle
                  onClick={() => handleSocialLogin(googleProvider)}
                  className={`cursor-pointer hover:scale-110 transition ${
                    loadingSocial || loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
                <FaGithub
                  onClick={() => handleSocialLogin(githubProvider)}
                  className={`cursor-pointer hover:scale-110 transition dark:text-white ${
                    loadingSocial || loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
                <FaFacebook
                  onClick={() => handleSocialLogin(facebookProvider)}
                  className={`text-blue-500 cursor-pointer hover:scale-110 transition ${
                    loadingSocial || loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
              </div>
            </div>

            {/* Footer */}
            <p className="text-[9px] sm:text-[10px] text-center text-gray-400 dark:text-gray-500 leading-snug mt-3 sm:mt-4 px-2">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="#"
                className="underline text-purple-500 hover:text-purple-400"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline text-purple-500 hover:text-purple-400"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
