"use client";

import { useEffect } from "react";

import ProfileSection from "../components/ProfileSection";
import FriendsSection from "../components/FriendsSection";
import HistorySection from "../components/HistorySection";
import Navbar from "../components/Navbar";
import { historyData } from "@/lib/data";

export default function Page() {
  // Responsive effect still included in case you want to add responsiveness later
  useEffect(() => {
    const handleResize = () => {};
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen dark:bg-[#020612] text-gray-800 dark:text-white transition-all">
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen p-4 lg:p-6">
        <aside className="lg:col-span-3 space-y-6">
          <ProfileSection />
          <FriendsSection />
        </aside>
        <main className="lg:col-span-9 space-y-6 flex flex-col">
          <HistorySection historyData={historyData} />
        </main>
      </div>
    </div>
  );
}
