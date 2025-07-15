"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
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

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export default function Page() {
  // Define the form type for TypeScript
  type Hform = {
    email: string;
    password: string;
    name: string;
  };

  // All hooks must be inside the component function
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [banner, setBanner] = useState<{ msg: string; type: "error" | "ok" }>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm<Hform>();

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

  // Function to handle form submission
  const onSubmit = async (data: Hform) => {
    setError("");
    setLoading(true);

    try {
      // Step 1: Create the user account
      const newUser = await authservice.signUp(
        data.email,
        data.password,
        data.name
      );

      if (newUser) {
        // Step 2: Sign in the user to create a session
        try {
          const session = await authservice.signIn(data.email, data.password);

          if (session) {
            // Step 3: Now we can safely get user data since we have a session
            const userData = await authservice.checkUser();

            if (userData) {
              dispatch(login({ status: true, userData }));
              setError("Sign up successful! Redirecting...");

              // Small delay to show success message
              setTimeout(() => {
                router.push("/");
              }, 1000);
            }
          }
        } catch (signInError) {
          console.error("Auto sign-in after signup failed:", signInError);
          setError("Account created successfully! Please log in.");

          // Redirect to login page after showing message
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("Error during registration:", error);

      // Handle specific Appwrite errors
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

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 dark:bg-[#020612] transition-all duration-300">
        {/* Background Image - Hidden on mobile, visible on larger screens */}
        <div className="hidden lg:block absolute left-4 xl:left-30 top-0 h-full scale-90 -translate-x-20 -translate-y-10">
          <Image
            src="/assets/signup.svg"
            alt="Student"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
          />
        </div>

        {/* Signup Form Container */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:ml-auto lg:mr-[10vw] xl:mr-[15vw] h-auto min-h-[650px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between h-full min-h-[650px]">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <Link href="/">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-pink-600">VibeX</span>
                  <span className="text-gray-400 dark:text-white">Code</span>
                </h1>
              </Link>
            </div>

            {/* Form Section */}
            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
              {/* Registration Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
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
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="w-full p-3 sm:p-4 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </form>

              {/* Success/Error Message */}
              {error && (
                <div
                  className={`text-center text-sm px-2 ${
                    error.includes("successful") ||
                    error.includes("Redirecting")
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {error}
                </div>
              )}

              {/* Social login banner */}
              {banner && (
                <div
                  className={`text-center text-sm px-2 ${
                    banner.type === "ok"
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {banner.msg}
                </div>
              )}

              {/* Links */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span className="cursor-pointer hover:underline">
                  Already have an account?
                </span>
                <Link href="/login">
                  <span className="cursor-pointer text-purple-500 hover:underline">
                    Log In
                  </span>
                </Link>
              </div>
            </div>

            {/* Social Login Section */}
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Or sign up with
              </div>
              <div className="flex justify-center gap-4 sm:gap-6 text-2xl sm:text-3xl">
                <FcGoogle
                  onClick={() => handleSocialLogin(googleProvider)}
                  className={`cursor-pointer hover:scale-110 transition ${
                    loadingSocial ? "pointer-events-none opacity-50" : ""
                  }`}
                />

                <FaGithub
                  onClick={() => handleSocialLogin(githubProvider)}
                  className={`cursor-pointer hover:scale-110 transition dark:text-white ${
                    loadingSocial ? "pointer-events-none opacity-50" : ""
                  }`}
                />

                <FaFacebook
                  onClick={() => handleSocialLogin(facebookProvider)}
                  className={`text-blue-500 cursor-pointer hover:scale-110 transition ${
                    loadingSocial ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </div>
            </div>

            {/* Terms and Privacy */}
            <p className="text-[9px] sm:text-[10px] text-center text-gray-400 dark:text-gray-500 leading-snug mt-3 sm:mt-4 px-2">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="#"
                className="underline text-purple-500 hover:text-purple-400 transition"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline text-purple-500 hover:text-purple-400 transition"
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
