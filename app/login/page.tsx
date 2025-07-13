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

export default function Page() {
  // ---------------- Types -----------------
  type Hform = { email: string; password: string };

  // ---------------- Hooks -----------------
  const [banner, setBanner] = useState<{ msg: string; type: "error" | "ok" }>();
  const { register, handleSubmit } = useForm<Hform>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // -------------- Submit ------------------
  const onSubmit = async (data: Hform) => {
    setBanner(undefined);
    try {
      setLoading(true);
      const session = await authservice.signIn(data.email, data.password);
      if (session) {
        const userData = await authservice.checkUser();
        if (userData) dispatch(login({ status: true, userData }));
        setBanner({ msg: "Sign‑in successful! Redirecting…", type: "ok" });
        router.push("/");
      }
    } catch (err) {
      console.error("Sign‑in error:", err);
      setBanner({ msg: "Sign‑in failed. Please try again.", type: "error" });
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
                <p
                  className={`text-center text-sm px-2 ${
                    banner.type === "error" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {banner.msg}
                </p>
              )}

              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="email"
                  placeholder="Mail ID"
                  {...register("email", { required: true })}
                  className="w-full p-3 sm:p-4 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                  className="w-full p-3 sm:p-4 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="submit"
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
                Or sign up with
              </div>
              <div className="flex justify-center gap-4 sm:gap-6 text-2xl sm:text-3xl">
                <FcGoogle className="cursor-pointer hover:scale-110 transition" />
                <FaGithub className="cursor-pointer hover:scale-110 transition dark:text-white" />
                <FaFacebook className="text-blue-500 cursor-pointer hover:scale-110 transition" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
