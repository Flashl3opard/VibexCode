"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import Logo from "../components/Logo";

export default function App() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-around p-4  dark:bg-black transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full items-center">
          {/* Left Section */}
          <div className="hidden flex-col items-center justify-center lg:flex">
            <img
              src="assets/guy.png"
              alt="Student"
              className="rounded-2xl w-full max-w-xs mb-6 shadow-lg dark:shadow-none"
            />
            <div className="flex gap-6">
              <button className="bg-white dark:bg-zinc-700 dark:text-white px-6 py-2 rounded-full text-purple-600 font-semibold shadow-md hover:scale-105 transition">
                Sign In
              </button>
              <button className="bg-white dark:bg-zinc-700 dark:text-white px-6 py-2 rounded-full text-purple-600 font-semibold shadow-md hover:scale-105 transition">
                Home
              </button>
            </div>
          </div>

          {/* Right Section (Form) */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl w-full text-zinc-800 dark:text-white transition">
            <div className="p-5 -mx-0 scale-105">
              <Logo />
            </div>

            <input
              type="email"
              placeholder="Mail Id"
              className="w-full mb-4 p-3 bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 p-3 bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition">
              Register
            </button>

            <p className="text-center mt-4 text-sm text-zinc-700 dark:text-zinc-300">
              Have an Account?{" "}
              <a href="#" className="text-purple-600 font-semibold">
                Log In
              </a>
            </p>

            <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Or sign up with
            </div>
            <div className="flex justify-center gap-6 mt-4 scale-200">
              <FcGoogle className="cursor-pointer hover:scale-110 transition" />
              <FaGithub className="cursor-pointer hover:scale-110 transition dark:text-white" />
              <FaFacebook className="text-blue-500 cursor-pointer hover:scale-110 transition" />
            </div>

            <p className="mt-6 text-[10px] text-center text-gray-500 dark:text-gray-400">
              This site is protected by reCAPTCHA and the Google <br />
              <a href="#" className="underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
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
