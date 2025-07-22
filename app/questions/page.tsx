"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function SubmitQuestionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    testcases: "",
    solutions: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && currentTag.trim() !== "") {
      e.preventDefault();
      const newTag = currentTag.trim();
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("✅ Question submitted successfully!");
        setFormData({
          title: "",
          description: "",
          testcases: "",
          solutions: "",
        });
        setTags([]);
        setCurrentTag("");
      } else {
        setMessage("❌ Failed to submit question.");
      }
    } catch (error) {
      setMessage("❌ An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-10 dark:bg-[#020612] text-gray-900 dark:text-gray-200 transition-colors duration-300">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#1a1a1d] shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700 transition">
          <h1 className="text-3xl font-bold mb-6 text-center">
            📝 Submit a New Question
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Title", name: "title" },
              { label: "Description", name: "description", textarea: true },
              { label: "Test Cases", name: "testcases", textarea: true },
              { label: "Solutions", name: "solutions", textarea: true },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="block mb-1 font-medium">{field.label}</span>
                {field.textarea ? (
                  <textarea
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    rows={field.name === "description" ? 4 : 3}
                    required
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                )}
              </label>
            ))}

            {/* Tag input */}
            <div className="block">
              <span className="block mb-1 font-medium">Tags (press space)</span>
              <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] border border-gray-300 dark:border-gray-600">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 dark:hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  name="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="Type tag and press space"
                  className="flex-grow min-w-[100px] bg-transparent outline-none px-1 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Submitting..." : "Submit Question"}
            </button>

            {message && (
              <p
                className={`text-center font-medium ${
                  message.includes("✅") ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
