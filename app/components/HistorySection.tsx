// File: /app/components/HistorySection.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface HistoryItem {
  title: string;
  time: string;
}

interface Props {
  historyData: HistoryItem[];
}

const HistorySection = ({ historyData }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(historyData.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentItems = historyData.slice(startIndex, startIndex + perPage);

  return (
    <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 lg:p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">Recent Activity</h3>
        <div className="flex items-center gap-2 lg:gap-3">
          <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-zinc-700 flex-1 overflow-auto">
        {currentItems.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center mt-4">
            No submissions yet.
          </p>
        ) : (
          currentItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-2 py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 transition rounded-md"
            >
              <p className="truncate max-w-[70%] lg:max-w-[80%] text-sm">
                {item.title}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default HistorySection;
