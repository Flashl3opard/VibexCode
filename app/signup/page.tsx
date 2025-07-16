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

/* Type definitions */
type Hform = {
  email: string;
  password: string;
  name: string;
};
type ErrorWithMessage = { message?: string };

export default function Page() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Hform>();
  const router = useRouter();

  const onSubmit = async (data: Hform) => {
    setError("");
    setLoading(true);

    try {
      const newUser = await authservice.signUp(
        data.email,
        data.password,
        data.name
      );

      if (newUser) {
        try {
          const session = await authservice.signIn(data.email, data.password);

          if (session) {
            const userData = await authservice.checkUser();

            if (userData) {
              dispatch(login({ status: true, userData }));
              setError("Sign up successful! Redirecting...");
              setTimeout(() => {
                router.push("/");
              }, 1000);
            }
          }
        } catch (signInError) {
          console.error("Auto sign-in after signup failed:", signInError);
          setError("Account created successfully! Please log in.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      }
    } catch (err: unknown) {
      const message = (err as ErrorWithMessage)?.message;

      console.error("Error during registration:", err);

      if (message) {
        if (message.includes("user_already_exists")) {
          setError("An account with this email already exists. Please log in.");
        } else if (message.includes("password")) {
          setError("Password must be at least 8 characters long.");
        } else if (message.includes("email")) {
          setError("Please enter a valid email address.");
        } else {
          setError(message);
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
        {/* Background Image */}
        <div className="hidden lg:block absolute left-4 xl:left-30 top-0 h-full scale-90 -translate-x-20 -translate-y-10">
          <Image
            src="/assets/signup.svg"
            alt="Student"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
          />
        </div>

        {/* Signup Form */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:ml-auto lg:mr-[10vw] xl:mr-[15vw] min-h-[650px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between min-h-[650px]">
            {/* Header */}
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

                {/* Password Field with Eye Toggle */}
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
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-300 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </form>

              {/* Feedback */}
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

              {/* Navigation Links */}
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

            {/* Social Sign Up */}
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Or sign up with
              </div>
              <div className="flex justify-center gap-4 sm:gap-6 text-2xl sm:text-3xl">
                <FcGoogle className="cursor-pointer hover:scale-110 transition" />
                <FaGithub className="cursor-pointer hover:scale-110 transition dark:text-white" />
                <FaFacebook className="text-blue-500 cursor-pointer hover:scale-110 transition" />
              </div>
            </div>

            {/* Legal Footer */}
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
