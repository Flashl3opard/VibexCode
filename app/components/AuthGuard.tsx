"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import authservice from "@/app/appwrite/auth";

interface Props {
  children: React.ReactNode;
}

// Make sure these routes exactly match your actual public routes without trailing slashes
const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    // Normalize pathname to remove trailing slash if any for consistent matching
    const normalizedPathname = pathname.replace(/\/$/, "");

    console.log("Normalized pathname:", normalizedPathname);

    const checkAuth = async () => {
      try {
        const user = await authservice.checkUser();
        console.log("User from auth check:", user);

        if (user) {
          // If user is logged in, prevent access to auth pages
          if (
            ["/login", "/signup", "/forgot_password"].includes(
              normalizedPathname
            )
          ) {
            router.replace("/"); // Redirect logged-in user away from auth pages
          } else {
            setChecking(false); // User logged in and allowed route, show content
          }
        } else {
          // Not logged in
          if (!publicRoutes.includes(normalizedPathname)) {
            router.replace("/login"); // Redirect to login if trying to access private routes
          } else {
            setChecking(false); // Public route, allow access
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setChecking(false); // Fail safe: allow access if error occurs
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  // Once checking is done, render children content
  return <>{children}</>;
}
