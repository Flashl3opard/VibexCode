"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import authservice from "@/app/appwrite/auth";

interface Props {
  children: React.ReactNode;
}

const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    // Normalize pathname
    let normalizedPathname = pathname.replace(/\/$/, "");
    if (normalizedPathname === "") normalizedPathname = "/";

    console.log("Normalized pathname:", normalizedPathname);

    const checkAuth = async () => {
      try {
        const user = await authservice.checkUser();
        console.log("User from auth check:", user);

        if (user) {
          if (
            ["/login", "/signup", "/forgot-password"].includes(
              normalizedPathname
            )
          ) {
            router.replace("/");
          } else {
            setChecking(false);
          }
        } else {
          if (!publicRoutes.includes(normalizedPathname)) {
            router.replace("/login");
          } else {
            setChecking(false);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setChecking(false);
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

  return <>{children}</>;
}
