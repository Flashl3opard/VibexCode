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

  const questionsData = [
    {
      name: "Arrays",
      questionCount: 3,
      progress: 60,
      questions: [
        "Find the maximum subarray sum",
        "Rotate the array by k positions",
        "Check if two arrays are equal after sorting",
      ],
    },
    {
      name: "Recursion",
      questionCount: 2,
      progress: 30,
      questions: [
        "Find factorial using recursion",
        "Print all subsets of a string",
      ],
    },
    {
      name: "Graphs",
      questionCount: 2,
      progress: 90,
      questions: [
        "Detect cycle in a directed graph",
        "Find number of connected components",
      ],
    },
    {
      name: "Stacks",
      questionCount: 1,
      progress: 100,
      questions: ["Implement min stack with O(1) getMin"],
    },
    {
      name: "Trees",
      questionCount: 2,
      progress: 50,
      questions: ["Inorder traversal", "Check if a tree is balanced"],
    },
  ];

  return (
    <div className="min-h-screen dark:bg-[#020612] text-gray-800 dark:text-white transition-all">
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
            questionsData={questionsData}
          />
          <HistorySection historyData={historyData} />
        </main>
      </div>
    </div>
  );
}
