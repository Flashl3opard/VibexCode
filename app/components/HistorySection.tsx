"use client";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { account } from "@/lib/appwrite";

interface HistoryItem {
  title: string;
  time: string;
  questionId?: string;
  difficulty?: string;
}

interface Props {
  onQuestionSolved?: (questionTitle: string, questionId: string) => void;
  className?: string;
}

const HistorySection = ({ onQuestionSolved, className = "" }: Props) => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSolved, setTotalSolved] = useState(0);

  const perPage = 10;
  const totalPages = Math.ceil(historyData.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentItems = historyData.slice(startIndex, startIndex + perPage);

  // Enhanced function to fetch history data with detailed error handling
  const fetchHistoryData = useCallback(async () => {
    console.log("🔄 Starting history fetch...");

    try {
      setLoading(true);
      setError("");
      setDebugInfo("");

      // Step 1: Get JWT token from Appwrite
      console.log("1️⃣ Getting JWT token...");
      let jwt;
      try {
        jwt = await account.createJWT();
        console.log("✅ JWT token created successfully");
      } catch (jwtError) {
        console.error("❌ JWT creation failed:", jwtError);
        throw new Error(`Authentication failed: ${jwtError.message}`);
      }

      // Step 2: Make API request
      console.log("2️⃣ Making API request...");
      const response = await fetch("/api/user/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.jwt}`,
        },
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Step 3: Check if response is ok
      if (!response.ok) {
        console.error(
          "❌ Response not ok:",
          response.status,
          response.statusText
        );

        // Try to get error details
        let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          console.log("📄 Error response body:", errorText);

          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText);
              errorDetails = errorJson.error || errorDetails;
            } catch (parseError) {
              errorDetails = `${errorDetails} - Raw response: ${errorText.substring(
                0,
                200
              )}`;
            }
          }
        } catch (textError) {
          console.error("Failed to read error response:", textError);
        }

        throw new Error(errorDetails);
      }

      // Step 4: Parse JSON response
      console.log("3️⃣ Parsing JSON response...");
      let data;
      try {
        const responseText = await response.text();
        console.log("📄 Raw response:", responseText.substring(0, 500) + "...");

        if (!responseText || responseText.trim() === "") {
          throw new Error("Empty response from server");
        }

        data = JSON.parse(responseText);
        console.log("✅ JSON parsed successfully:", data);
      } catch (jsonError) {
        console.error("❌ JSON parsing failed:", jsonError);
        throw new Error(`Invalid JSON response: ${jsonError.message}`);
      }

      // Step 5: Process successful response
      if (data.success) {
        console.log("4️⃣ Processing successful response...");
        setHistoryData(data.history || []);
        setTotalSolved(data.totalSolved || 0);
        setDebugInfo(`Loaded ${data.history?.length || 0} items successfully`);
        console.log("✅ History data set successfully");
      } else {
        throw new Error(data.error || "API returned unsuccessful response");
      }
    } catch (err) {
      console.error("💥 History fetch error:", err);

      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setDebugInfo(`Error details: ${errorMessage}`);

      // Set fallback data for development
      if (process.env.NODE_ENV === "development") {
        console.log("🔧 Setting fallback data for development");
        setHistoryData([
          {
            title: "Development Fallback Question",
            time: "Just now",
            questionId: "fallback-1",
            difficulty: "Easy",
          },
        ]);
        setTotalSolved(1);
      } else {
        setHistoryData([]);
        setTotalSolved(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to add new solved question
  const addSolvedQuestion = useCallback(
    (questionTitle: string, questionId: string) => {
      console.log("➕ Adding solved question:", questionTitle, questionId);

      const newItem: HistoryItem = {
        title: questionTitle,
        time: "Just now",
        questionId: questionId,
      };

      setHistoryData((prev) => {
        const updated = [newItem, ...prev];
        console.log("✅ History updated, new length:", updated.length);
        return updated;
      });

      setTotalSolved((prev) => prev + 1);

      // Call parent callback if provided
      onQuestionSolved?.(questionTitle, questionId);
    },
    [onQuestionSolved]
  );

  // Expose function globally (for backward compatibility)
  useEffect(() => {
    // @ts-ignore
    window.addSolvedQuestion = addSolvedQuestion;

    return () => {
      // @ts-ignore
      delete window.addSolvedQuestion;
    };
  }, [addSolvedQuestion]);

  // Fetch data on component mount
  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  // Reset to page 1 when historyData changes
  useEffect(() => {
    setCurrentPage(1);
  }, [historyData.length]);

  // Handle page navigation
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));

  // Get difficulty badge color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <section
      className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 lg:p-6 flex-1 flex flex-col ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg lg:text-xl font-semibold">Recent Activity</h3>
          {totalSolved > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              {totalSolved} solved
            </span>
          )}
          {error && (
            <AlertTriangle size={16} className="text-red-500" title={error} />
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button
            onClick={fetchHistoryData}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            disabled={loading}
            title="Refresh history"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          {totalPages > 0 && (
            <>
              <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && debugInfo && (
        <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
          🔧 Debug: {debugInfo}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading history...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <AlertTriangle size={32} className="text-red-500" />
            <div className="text-center">
              <p className="text-sm text-red-500 font-medium mb-1">
                Unable to load history
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 max-w-xs">
                {error}
              </p>
              <button
                onClick={fetchHistoryData}
                className="text-xs px-3 py-1.5 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : currentItems.length > 0 ? (
          <div className="space-y-1">
            {currentItems.map((item, index) => (
              <div
                key={`${item.questionId || index}-${item.time}-${currentPage}`}
                className="flex justify-between items-center px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-lg transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-green-500 text-sm flex-shrink-0">
                    ✅
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </p>
                    {item.difficulty && (
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getDifficultyColor(
                          item.difficulty
                        )}`}
                      >
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm text-center">No completed questions yet</p>
            <p className="text-xs text-center mt-1 opacity-75">
              Solve your first question to see it here!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySection;
