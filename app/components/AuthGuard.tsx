"use client";

import authservice from "@/app/appwrite/auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const publicRoutes = ["/", "/login", "/signup"];

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!pathname) return; // 🛡️ Ensure pathname is defined

    const checkAuth = async () => {
      const user = await authservice.checkUser();

      if (user) {
        if (["/login", "/signup"].includes(pathname)) {
          router.replace("/");
        } else {
          setChecking(false);
        }
      } else {
        if (!publicRoutes.includes(pathname)) {
          router.replace("/login");
        } else {
          setChecking(false);
        }
      }
    };

    checkAuth();
  }, [pathname]);

  if (checking) return <div className="p-4">Loading...</div>;

  return <>{children}</>;
}
