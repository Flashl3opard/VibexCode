"use client";
import { useState, useEffect } from "react";

import ProfileSection from "../components/ProfileSection";
import FriendsSection from "../components/FriendsSection";
import QuestionsSection from "../components/QuestionsSection";
import HistorySection from "../components/HistorySection";
import Navbar from "../components/Navbar";
import { historyData } from "@/lib/data";

export default function Page() {
  const [questionsPerView, setQuestionsPerView] = useState(3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all">
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen p-4 lg:p-6">
        <aside className="lg:col-span-3 space-y-6">
          <ProfileSection />
          <FriendsSection />
        </aside>
        <main className="lg:col-span-9 space-y-6 flex flex-col">
          <QuestionsSection
            questionsPerView={questionsPerView}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
          <HistorySection historyData={historyData} />
        </main>
      </div>
    </div>
  );
}
