"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store"; // Adjust path as needed

import ProfileSection from "../components/ProfileSection";
import FriendsSection from "../components/FriendsSection";
import HistorySection from "../components/HistorySection";
import Navbar from "../components/Navbar";

interface HistoryItem {
  title: string;
  time: string;
}

interface Submission {
  questionTitle?: string;
  submittedAt: string;
  // add more fields here if needed
}

export default function Page() {
  const { userData, status: isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoggedIn || !userData) {
      // Clear history if not logged in
      setHistoryData([]);
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/user-submissions?userEmail=${encodeURIComponent(
            userData.email
          )}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch submission history");
        }

        const data = await res.json();

        // Map submissions to HistoryItem[]
        const historyArray: HistoryItem[] = (data.submissions || []).map(
          (sub: Submission) => ({
            title: sub.questionTitle || "Untitled",
            time: new Date(sub.submittedAt).toLocaleString(),
          })
        );

        setHistoryData(historyArray);
      } catch (error) {
        console.error("Error fetching user submissions:", error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [isLoggedIn, userData]);

  return (
    <div className="min-h-screen dark:bg-[#020612] text-gray-800 dark:text-white transition-all">
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen p-4 lg:p-6">
        <aside className="lg:col-span-3 space-y-6">
          <ProfileSection />
          <FriendsSection />
        </aside>
        <main className="lg:col-span-9 space-y-6 flex flex-col">
          {loading ? (
            <p className="text-center p-4">Loading submission history...</p>
          ) : (
            <HistorySection historyData={historyData} />
          )}
        </main>
      </div>
    </div>
  );
}
