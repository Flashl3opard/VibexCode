"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

type QuestionFormFields = {
  title: string;
  description: string;
  testcases: string;
  solutions: string;
};

export default function SubmitQuestionPage() {
  const [formData, setFormData] = useState<QuestionFormFields>({
    title: "",
    description: "",
    testcases: "",
    solutions: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && currentTag.trim() !== "") {
      e.preventDefault();
      const newTag = currentTag.trim().toLowerCase();

      // Validate tag length
      if (newTag.length > 20) {
        setMessage("❌ Tags must be 20 characters or less");
        return;
      }

      // Check for duplicates (case insensitive)
      if (!tags.some((tag) => tag.toLowerCase() === newTag)) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }

    // Allow backspace to remove last tag if input is empty
    if (e.key === "Backspace" && currentTag === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Optional validation for test cases and solutions
    if (formData.testcases.trim() && formData.testcases.trim().length < 5) {
      newErrors.testcases =
        "Test cases must be at least 5 characters if provided";
    }

    if (formData.solutions.trim() && formData.solutions.trim().length < 5) {
      newErrors.solutions =
        "Solutions must be at least 5 characters if provided";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("❌ Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        testcases: formData.testcases.trim(),
        solutions: formData.solutions.trim(),
        tags: tags.filter((tag) => tag.trim() !== ""), // Remove empty tags
      };

      console.log("Sending payload:", payload);

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Response:", result);

      if (res.ok && result.success) {
        setMessage("✅ Question submitted successfully!");

        // Clear form
        setFormData({
          title: "",
          description: "",
          testcases: "",
          solutions: "",
        });
        setTags([]);
        setCurrentTag("");
        setErrors({});

        // Auto-clear success message after 5 seconds
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage(
          `❌ ${
            result.error || result.message || `Server error (${res.status})`
          }`
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage(
        `❌ Network error: ${
          error instanceof Error
            ? error.message
            : "Please check your connection"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      label: "Title *",
      name: "title",
      placeholder: "Enter a descriptive title for your question...",
      maxLength: 100,
    },
    {
      label: "Description *",
      name: "description",
      textarea: true,
      placeholder: "Provide a detailed description of the problem...",
      rows: 5,
    },
    {
      label: "Test Cases",
      name: "testcases",
      textarea: true,
      placeholder: "Example: Input: [1,2,3] Output: 6",
      rows: 4,
    },
    {
      label: "Solutions",
      name: "solutions",
      textarea: true,
      placeholder: "Provide solution approaches or code...",
      rows: 4,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-10 dark:bg-[#020612] text-gray-900 dark:text-gray-200 transition-colors duration-300">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#1a1a1d] shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700 transition">
          <h1 className="text-3xl font-bold mb-2 text-center">
            📝 Submit a New Question
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Share your programming questions with the community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field) => {
              const fieldName = field.name as keyof QuestionFormFields;
              const fieldValue = formData[fieldName];

              return (
                <div key={field.name} className="block">
                  <label className="block mb-2 font-medium text-sm">
                    {field.label}
                    {field.maxLength && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({fieldValue.length}/{field.maxLength})
                      </span>
                    )}
                  </label>

                  {field.textarea ? (
                    <textarea
                      name={field.name}
                      value={fieldValue}
                      onChange={handleChange}
                      rows={field.rows || 3}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      className={`w-full p-3 rounded-lg bg-gray-50 dark:bg-[#2a2a2f] border transition-colors resize-none ${
                        errors[field.name]
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      } outline-none`}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={fieldValue}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      className={`w-full p-3 rounded-lg bg-gray-50 dark:bg-[#2a2a2f] border transition-colors ${
                        errors[field.name]
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      } outline-none`}
                    />
                  )}

                  {errors[field.name] && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Enhanced Tag input */}
            <div className="block">
              <label className="block mb-2 font-medium text-sm">
                Tags (press space or Enter to add)
                <span className="text-xs text-gray-500 ml-2">
                  ({tags.length}/10 tags)
                </span>
              </label>

              <div className="min-h-[52px] flex flex-wrap gap-2 p-3 rounded-lg bg-gray-50 dark:bg-[#2a2a2f] border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 dark:hover:text-red-300 ml-1 font-bold text-lg leading-none"
                      aria-label={`Remove ${tag} tag`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder={
                    tags.length === 0 ? "Type tag and press space..." : ""
                  }
                  disabled={tags.length >= 10}
                  className="flex-grow min-w-[120px] bg-transparent outline-none text-sm py-1"
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use tags like: javascript, react, algorithms, data-structures
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Submitting...
                </span>
              ) : (
                "Submit Question"
              )}
            </button>

            {message && (
              <div
                className={`text-center font-medium p-4 rounded-lg border transition-colors ${
                  message.includes("✅")
                    ? "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800"
                    : "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800"
                }`}
              >
                {message}
              </div>
            )}
          </form>

          {/* Development debug info */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
              <summary className="font-bold mb-2 cursor-pointer">
                Debug Info
              </summary>
              <div className="space-y-2 mt-2">
                <p>
                  <strong>Form Data:</strong>
                </p>
                <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
                <p>
                  <strong>Tags:</strong> {JSON.stringify(tags)}
                </p>
                <p>
                  <strong>Errors:</strong> {JSON.stringify(errors)}
                </p>
              </div>
            </details>
          )}
        </div>
      </div>
    </>
  );
}
