"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import authservice from "../appwrite/auth";
import Navbar from "../components/Navbar";
import { Eye, EyeOff } from "lucide-react";

// Types
type FormValues = {
  password: string;
  confirmPassword: string;
};

type Banner = { msg: string; type: "error" | "ok" };

export default function ResetPasswordPage() {
  const [banner, setBanner] = useState<Banner>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams?.get("userId") || "";
  const secret = searchParams?.get("secret") || "";

  useEffect(() => {
    if (!userId || !secret) {
      setBanner({ msg: "Invalid or expired reset link.", type: "error" });
    }
  }, [userId, secret]);

  const onSubmit = async (data: FormValues) => {
    setBanner(undefined);
    setLoading(true);

    if (data.password !== data.confirmPassword) {
      setBanner({ msg: "Passwords do not match.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      await authservice.updatePassword(userId, secret, data.password);
      setBanner({
        msg: "Password reset successful! Redirecting...",
        type: "ok",
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: unknown) {
      console.error(error);
      setBanner({
        msg: "Failed to reset password. Link may have expired.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 dark:bg-[#020612] transition-all duration-300">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md min-h-[480px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-zinc-800 dark:text-white flex flex-col justify-between min-h-[480px]">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <span className="text-gray-400">Reset</span>
                <span className="text-gray-400 dark:text-white">Password</span>
              </h1>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
              {banner && (
                <div
                  className={`text-center text-sm px-2 py-2 rounded-md ${
                    banner.type === "error"
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      : "text-green-500 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  }`}
                >
                  {banner.msg}
                </div>
              )}

              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    {...register("password", { required: true, minLength: 8 })}
                    className="w-full p-3 sm:p-4 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmPassword", { required: true })}
                    className="w-full p-3 sm:p-4 rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Updating…" : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
