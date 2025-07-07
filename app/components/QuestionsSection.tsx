"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dummyQuestions from "@/lib/questions";

interface Topic {
  name: string;
  progress: number;
  questions: string[];
}

interface Props {
  questionsPerView: number;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (i: number) => void;
  questionsData: Topic[];
}

const QuestionsSection = ({
  questionsPerView,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  questionsData,
}: Props) => {
  const dataToUse = questionsData.length > 0 ? questionsData : dummyQuestions;
  const totalTopics = dataToUse.length;
  const maxTopicIndex = Math.max(0, totalTopics - questionsPerView);

  const CircularProgress = ({
    percentage,
    size = 36,
    strokeWidth = 4,
  }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ffffff40"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize={size * 0.3}
          fill="white"
          className="rotate-[90deg]"
        >
          {percentage}%
        </text>
      </svg>
    );
  };

  return (
    <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">Topics</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 min-w-[80px] lg:min-w-[100px] text-center">
            {currentQuestionIndex + 1}-
            {Math.min(currentQuestionIndex + questionsPerView, totalTopics)} of{" "}
            {totalTopics}
          </span>
          <button
            onClick={() =>
              setCurrentQuestionIndex(
                Math.min(maxTopicIndex, currentQuestionIndex + 1)
              )
            }
            disabled={currentQuestionIndex >= maxTopicIndex}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataToUse
          .slice(currentQuestionIndex, currentQuestionIndex + questionsPerView)
          .map((topic, index) => (
            <Link href={`/topic/${encodeURIComponent(topic.name)}`} key={index}>
              <div className="rounded-xl shadow-md hover:scale-105 transition-transform bg-gradient-to-tr from-purple-500 via-blue-500 to-indigo-500 cursor-pointer">
                <div className="p-4 h-24 lg:h-32 flex items-center justify-center text-center text-base lg:text-lg font-semibold text-white">
                  {topic.name}
                </div>
                <div className="bg-white/10 px-4 py-2 text-xs lg:text-sm flex justify-between items-center border-t border-white/10 text-white rounded-b-xl">
                  <span>{topic.questions.length} Questions</span>
                  <CircularProgress percentage={topic.progress} />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default QuestionsSection;
