"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();
      setMessage(data.message || "Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center px-4 py-10 dark:bg-[#020612] transition-all duration-300">
      {/* Man's Image */}
      <div className="hidden md:block absolute left-30 top-0 h-full">
        <Image
          src="/assets/guy1.png"
          alt="Student"
          width={500}
          height={900}
          className="h-full w-auto object-cover"
        />
      </div>

      {/* Signup Card */}
      <div className="relative z-10 ml-auto mr-[15vw] max-w-md h-[650px] w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 text-zinc-800 dark:text-white flex flex-col justify-between h-full">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-pink-600">VibeX</span>
              <span className="text-gray-400 dark:text-white">Code</span>
            </h1>
          </div>

          {/* Form + Links */}
          <div className="space-y-3">
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                required
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
              >
                Register
              </button>
            </form>

            {/* Message */}
            {message && (
              <p className="text-center text-sm mt-2 text-purple-500 dark:text-purple-300">
                {message}
              </p>
            )}

            {/* Sign In Redirect */}
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span className="cursor-pointer hover:underline">
                Already have an account?
              </span>
              <span className="cursor-pointer text-purple-500 hover:underline">
                Log In
              </span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="mt-4 space-y-2">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Or sign up with
            </div>
            <div className="flex justify-center gap-6 text-3xl">
              <FcGoogle className="cursor-pointer hover:scale-110 transition" />
              <FaGithub className="cursor-pointer hover:scale-110 transition dark:text-white" />
              <FaFacebook className="text-blue-500 cursor-pointer hover:scale-110 transition" />
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 leading-snug mt-3">
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
  );
};

export default Signup;
