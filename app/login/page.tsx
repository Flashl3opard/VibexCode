"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === "logged-in") {
      router.push("/profile");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", "logged-in");
        setSuccessMsg("Login successful!");
        setTimeout(() => {
          router.push("/profile");
        }, 500); // Short delay for better UX
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex items-center px-4 py-10 dark:bg-[#020612] transition-all duration-300">
        <div className="hidden md:block absolute left-30 top-0 h-full">
          <Image
            src="/assets/guy1.png"
            alt="Student"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
          />
        </div>

        <div className="relative z-10 ml-auto mr-[15vw] max-w-md h-[580px] w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 text-zinc-800 dark:text-white flex flex-col justify-between h-full">
            <div className="text-center">
              <Link href="/">
                <h1 className="text-3xl font-bold">
                  <span className="text-pink-600">VibeX</span>
                  <span className="text-gray-400 dark:text-white">Code</span>
                </h1>
              </Link>
            </div>

            <div className="space-y-3">
              {errorMsg && (
                <div className="text-red-500 text-sm text-center">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="text-green-500 text-sm text-center">
                  {successMsg}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Mail ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-md border border-purple-300 dark:bg-zinc-800 dark:border-zinc-700"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="cursor-pointer hover:underline">
                  Forgot Password?
                </span>
                <Link href="/signup">
                  <span className="cursor-pointer text-purple-500 hover:underline">
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Or sign up with
            </div>
            <div className="flex justify-center gap-6 text-3xl">
              <FcGoogle className="cursor-pointer hover:scale-110 transition" />
              <FaGithub className="cursor-pointer hover:scale-110 transition dark:text-white" />
              <FaFacebook className="text-blue-500 cursor-pointer hover:scale-110 transition" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
