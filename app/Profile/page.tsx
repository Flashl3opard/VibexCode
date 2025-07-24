"use client";

import { useState, useEffect } from "react";

import ProfileSection from "../components/ProfileSection";
import FriendsSection from "../components/FriendsSection";
import QuestionsSection from "../components/QuestionsSection";
import HistorySection from "../components/HistorySection";
import Navbar from "../components/Navbar";
import { historyData } from "@/lib/data";

type SolvedQuestionCategory = {
  name: string;
  questionCount: number;
  progress: number;
  questions: string[];
};

export default function Page() {
  const [questionsPerView, setQuestionsPerView] = useState(3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [solvedQuestionsData, setSolvedQuestionsData] = useState<
    SolvedQuestionCategory[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Responsive questions per view depending on viewport width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setQuestionsPerView(1);
      else if (width < 1024) setQuestionsPerView(2);
      else setQuestionsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user's solved questions from backend API
  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      try {
        setLoading(true);

        // Use your dedicated GET endpoint for fetching solved questions
        const res = await fetch("/api/user/solved-questions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Optional, if your backend requires credentials/cookies
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch solved questions (${res.status})`);
        }

        const data = await res.json();

        // Expect data.success and data.solvedQuestions as an array
        if (data.success && Array.isArray(data.solvedQuestions)) {
          setSolvedQuestionsData(data.solvedQuestions);
          setError("");
        } else {
          throw new Error(data.error || "Failed to fetch solved questions");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSolvedQuestions();
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
          {loading ? (
            <p className="text-center text-gray-500">
              Loading solved questions...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : solvedQuestionsData.length === 0 ? (
            <p className="text-center text-gray-500">
              No solved questions yet.
            </p>
          ) : (
            <QuestionsSection
              questionsPerView={questionsPerView}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              questionsData={solvedQuestionsData}
            />
          )}
          <HistorySection historyData={historyData} />
        </main>
      </div>
    </div>
  );
}
