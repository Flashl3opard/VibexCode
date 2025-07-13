"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import authservice from "../appwrite/auth";

export default function ForgotPasswordPage() {
  // ------------------ Types ------------------
  type FPForm = { email: string };

  // ------------------ Hooks ------------------
  const { register, handleSubmit } = useForm<FPForm>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>(""); // success or error

  // ------------------ Handlers ---------------
  const onSubmit = async (data: FPForm) => {
    setMessage("");
    setLoading(true);
    try {
      // sendPasswordReset returns void → just await it
      await authservice.sendPasswordReset(data.email);

      // ✅ Success
      setMessage(
        "✅ If an account exists, a reset link has been sent. Please check your email."
      );
    } catch (err) {
      console.error("Password‑reset error:", err);
      setMessage(
        "❌ Something went wrong. Please double‑check the email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UI ---------------------
  return (
    <>
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 dark:bg-[#020612] transition-all duration-300">
        {/* Illustration */}
        <div className="hidden lg:block absolute left-4 xl:left-30 top-0 h-full scale-90 -translate-x-20 -translate-y-10">
          <Image
            src="/assets/login.svg" // supply your own SVG or reuse signup.svg
            alt="Forgot password illustration"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
            priority
          />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:ml-auto lg:mr-[10vw] xl:mr-[15vw] h-auto min-h-[550px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between h-full min-h-[550px]">
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
              <h2 className="text-center text-xl sm:text-2xl font-semibold mb-2">
                Forgot your password?
              </h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                Enter the email you used to register and we’ll send you a reset
                link.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
                <input
                  type="email"
                  placeholder="Email ID"
                  {...register("email", { required: true })}
                  className="w-full p-3 sm:p-4 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Sending link..." : "Send reset link"}
                </button>
              </form>

              {/* Result banner */}
              {message && (
                <p
                  className={`text-center text-sm px-2 ${
                    message.startsWith("✅")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Back to login */}
              <div className="text-center mt-4 sm:mt-6">
                <Link href="/login">
                  <span className="text-purple-500 hover:underline text-xs sm:text-sm">
                    Back to login
                  </span>
                </Link>
              </div>
            </div>

            {/* reCAPTCHA footer */}
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
