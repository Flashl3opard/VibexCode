"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";

const RouteProgress = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => NProgress.done(), 300); // fake delay
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default RouteProgress;
