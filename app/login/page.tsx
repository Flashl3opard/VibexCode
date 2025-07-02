"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import Logo from "../components/Logo";

const Page = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 dark:bg-black  transition-all duration-300">
        <div className="flex flex-col md:flex-row bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full ">
          {/* Left Section */}
          <div className="hidden md:block w-1/2">
            <img
              src="/assets/guy1.png"
              alt="Student"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-10 space-y-6 text-zinc-800 dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="scale-120 mx-3">
                <Logo />
              </div>
              <div className="flex gap-5 items-center">
                <a href="#" className="text-sm text-purple-300 hover:underline">
                  Log In
                </a>
                <button className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full">
                  <Link href="/signup">Sign Up</Link>
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <input
                type="email"
                placeholder="EMail ID"
                className="w-full p-3 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
              >
                Log In
              </button>
            </form>

            {/* Links */}
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span className="cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            {/* Social Login */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Or sign up with
            </div>
            <div className="flex justify-center gap-6 text-3xl mt-2">
              <FcGoogle className="cursor-pointer hover:scale-110 transition" />
              <FaGithub className="cursor-pointer hover:scale-110 transition dark:text-white" />
              <FaFacebook className="text-blue-500 cursor-pointer hover:scale-110 transition" />
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-[10px] text-center text-gray-400 dark:text-gray-500 leading-snug">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="underline text-purple-500">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-purple-500">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
