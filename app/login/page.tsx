"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import  authservice  from "../appwrite/auth";
import { login } from "../store/authSlice";

export default function page() {
  // Define the form type for TypeScript
  type Hform = {
    email: string;
    password: string;
    name: string;
  }


  //Trying out hook form and redux for state management
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm<Hform>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const onSubmit = async (data: Hform) => {
    setError(""); // Reset error message
    try {
      setLoading(true);
      const session = await authservice.signIn(data.email, data.password);
      if(session){
        const userData = await authservice.checkUser();
        if (userData) dispatch(login({ status: true, userData }));
        setError("Sign In successful! Redirecting...");
        setLoading(false)
        router.push("/");
        
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Sign In failed. Please try again.");
    }
  }
  
  
  
  
  
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [errorMsg, setErrorMsg] = useState("");
  // const [successMsg, setSuccessMsg] = useState("");
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token === "logged-in") {
  //     router.push("/profile");
  //   }
  // }, [router]);

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setErrorMsg("");
  //   setSuccessMsg("");

  //   try {
  //     const res = await fetch("/api/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       // ✅ FIX: Store both token AND user data in localStorage
  //       localStorage.setItem("token", "logged-in");
  //       localStorage.setItem("email", data.user.email); // <-- needed by /profile
  //       localStorage.setItem("username", data.user.username); // optional

  //       setSuccessMsg("Login successful!");
  //       setTimeout(() => {
  //         router.push("/profile");
  //       }, 500);
  //     } else {
  //       setErrorMsg(data.message || "Login failed");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setErrorMsg("Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 dark:bg-[#020612] transition-all duration-300">
        <div className="hidden lg:block absolute left-4 xl:left-30 top-0 h-full scale-90 -translate-x-15 -translate-y-10">
          <Image
            src="/assets/login.svg"
            alt="Student"
            width={500}
            height={900}
            className="h-full w-auto object-cover"
          />
        </div>

        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:ml-auto lg:mr-[10vw] xl:mr-[15vw] h-auto min-h-[580px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between h-full min-h-[580px]">
            <div className="text-center mb-6 sm:mb-8">
              <Link href="/">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-pink-600">VibeX</span>
                  <span className="text-gray-400 dark:text-white">Code</span>
                </h1>
              </Link>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
              {error && (
                <div className="text-red-500 text-sm text-center px-2">
                  {error}
                </div>
              )}
              {error && (
                <div className="text-green-500 text-sm text-center px-2">
                  {error}
                </div>
              )}

              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
};
