"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import authservice from "@/app/appwrite/auth";

interface Props {
  children: React.ReactNode;
}

const publicRoutes = ["/", "/login", "/signup", "/forgot_password"];

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    const checkAuth = async () => {
      try {
        const user = await authservice.checkUser();

        if (user) {
          if (["/login", "/signup"].includes(pathname)) {
            router.replace("/"); // Already logged in, redirect to home
          } else {
            setChecking(false); // Access granted
          }
        } else {
          if (!publicRoutes.includes(pathname)) {
            router.replace("/login"); // Not logged in, redirect to login
          } else {
            setChecking(false); // Public route, allow access
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setChecking(false); // Fallback to allow access on error
      }
    };

    checkAuth();
  }, [pathname, router]); // ✅ Included router to satisfy exhaustive-deps

  if (checking) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
