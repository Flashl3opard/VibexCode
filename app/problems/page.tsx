"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

type Question = {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  testcases?: string;
  solutions?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProblemsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags))).sort();

  // Filter tags based on tagSearch
  const filteredTags = tagSearch
    ? allTags.filter((tag) =>
        tag.toLowerCase().includes(tagSearch.toLowerCase())
      )
    : allTags;

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/questions", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch questions (${res.status})`);
        }
        const data = await res.json();
        if (data.success) {
          const sortedQuestions = data.questions.sort(
            (a: Question, b: Question) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
          );
          setQuestions(sortedQuestions);
        } else {
          setError(data.error || "Failed to load questions");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Network error - please check your connection"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Filter questions based on search and tag
  useEffect(() => {
    let filtered = questions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.description.toLowerCase().includes(term) ||
          q.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((q) => q.tags.includes(selectedTag));
    }

    setFilteredQuestions(filtered);
  }, [questions, searchTerm, selectedTag]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        showTagDropdown &&
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(e.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTagDropdown]);

  const toggleExpanded = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(questionId)) {
        newExpanded.delete(questionId);
      } else {
        newExpanded.add(questionId);
      }
      return newExpanded;
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
    setTagSearch("");
  };

  const retryFetch = () => {
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-10 dark:bg-[#020612] text-gray-900 dark:text-gray-200 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Problems List</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore and solve programming challenges from the community
            </p>
          </div>

          {/* Search and Filter Section */}
          {!loading && !error && questions.length > 0 && (
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search questions by title, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white dark:bg-[#1a1a1d] border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Tag Filter with Search inside dropdown */}
                <div className="relative sm:w-64">
                  <button
                    type="button"
                    onClick={() => setShowTagDropdown((v) => !v)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedTag
                        ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                        : "bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-gray-200"
                    } border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none`}
                  >
                    {selectedTag ? `Tag: ${selectedTag}` : "Filter by tag..."}
                    <span className="float-right ml-2">&#x25BC;</span>
                  </button>

                  {showTagDropdown && (
                    <div
                      ref={tagDropdownRef}
                      className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1d] border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg z-20"
                    >
                      <input
                        autoFocus
                        type="text"
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        placeholder="Search tags..."
                        className="w-full p-2 border-b border-gray-300 dark:border-gray-700 rounded-t-xl bg-gray-50 dark:bg-[#23232c] text-sm outline-none"
                      />
                      <div className="max-h-56 overflow-y-auto">
                        {filteredTags.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">
                            No tags found
                          </div>
                        ) : (
                          filteredTags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSelectedTag(tag);
                                setShowTagDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-700 ${
                                selectedTag === tag
                                  ? "bg-blue-100 dark:bg-blue-700 font-semibold"
                                  : ""
                              }`}
                            >
                              {tag}
                            </button>
                          ))
                        )}
                      </div>
                      <div>
                        {selectedTag && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTag("");
                              setShowTagDropdown(false);
                            }}
                            className="w-full text-red-600 dark:text-red-400 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#262630] text-xs"
                          >
                            Clear tag filter
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters & Stats */}
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>
                    Showing {filteredQuestions.length} of {questions.length}{" "}
                    questions
                  </span>
                  {(searchTerm || selectedTag) && (
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                {selectedTag && (
                  <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                    Tag: {selectedTag}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-lg">Loading questions...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button
                  onClick={retryFetch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && questions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold mb-2">No questions yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to submit a question to the community!
              </p>
              <a
                href="/submit"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Submit First Question
              </a>
            </div>
          )}

          {/* No Results State */}
          {!loading &&
            !error &&
            questions.length > 0 &&
            filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">
                  No questions found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

          {/* Questions List */}
          {!loading && !error && filteredQuestions.length > 0 && (
            <div className="space-y-6">
              {filteredQuestions.map((q) => {
                const isExpanded = expandedQuestions.has(q._id);
                const showExpandButton = q.description.length > 200;

                return (
                  <article
                    key={q._id}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1d] shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 leading-tight">
                        {q.title}
                      </h2>
                      {q.createdAt && (
                        <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                          {formatDate(q.createdAt)}
                        </time>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {showExpandButton && !isExpanded
                          ? `${q.description.slice(0, 200)}...`
                          : q.description}
                      </p>

                      {showExpandButton && (
                        <button
                          onClick={() => toggleExpanded(q._id)}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 font-medium"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>

                    {/* Additional Details (when expanded) */}
                    {isExpanded && (
                      <div className="space-y-4 mb-4 p-4 bg-gray-50 dark:bg-[#2a2a2f] rounded-lg">
                        {q.testcases && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">
                              Test Cases:
                            </h4>
                            <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                              {q.testcases}
                            </pre>
                          </div>
                        )}

                        {q.solutions && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">
                              Solutions:
                            </h4>
                            <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                              {q.solutions}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {q.tags.map((tag, index) => (
                          <button
                            key={`${tag}-${index}`}
                            onClick={() =>
                              setSelectedTag(selectedTag === tag ? "" : tag)
                            }
                            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                              selectedTag === tag
                                ? "bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100"
                                : "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
