"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  questionsPerView: number;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (i: number) => void;
}

const QuestionsSection = ({
  questionsPerView,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}: Props) => {
  const totalQuestions = 10;
  const maxQuestionIndex = Math.max(0, totalQuestions - questionsPerView);

  return (
    <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">Questions</h3>
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
            {Math.min(currentQuestionIndex + questionsPerView, totalQuestions)}{" "}
            of {totalQuestions}
          </span>
          <button
            onClick={() =>
              setCurrentQuestionIndex(
                Math.min(maxQuestionIndex, currentQuestionIndex + 1)
              )
            }
            disabled={currentQuestionIndex >= maxQuestionIndex}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(questionsPerView)].map((_, index) => {
          const questionNum = currentQuestionIndex + index + 1;
          if (questionNum > totalQuestions) return null;
          return (
            <div
              key={index}
              className="rounded-xl shadow-md hover:scale-105 transition-transform bg-gradient-to-tr from-purple-500 via-blue-500 to-indigo-500"
            >
              <div className="p-4 h-24 lg:h-32 flex items-center justify-center text-center text-base lg:text-lg font-semibold text-white">
                Question {questionNum}
              </div>
              <div className="bg-white/10 px-4 py-2 text-xs lg:text-sm flex justify-between border-t border-white/10 text-white">
                <span>Level: Easy</span>
                <span>{questionNum * 10}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuestionsSection;
