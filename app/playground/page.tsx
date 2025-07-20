"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SoundBoard from "../components/SoundBoard";
import Lead from "../components/Lead";
import Navbar from "../components/Navbar";

// Dynamically load Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

 function page() {
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const lang = ["Javascript", "Python", "Java", "C++"] as const;
  type Language = typeof lang[number];
  const [language, setLanguage] = useState<Language>("Javascript");

  // Mapping to Monaco-compatible language strings
  const languageMap: Record<Language, string> = {
    Javascript: "javascript",
    Python: "python",
    Java: "java",
    "C++": "cpp",
  };

  const handleRun = () => {
    setOutput("✅ Code ran successfully!\nOutput: Hello World");
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#020612] text-gray-900 dark:text-white">
      <Navbar />

      <div className="flex flex-1 p-3 gap-4 overflow-hidden flex-col md:flex-row">
        {/* ---------- Left Panel: Question + Testcases ---------- */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 overflow-auto">
          {/* Question Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[45%] flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">🧠 Question</h2>
            <p className="text-sm">
              Write a function to print &quot;Hello, World!&quot; to the
              console. Make sure to handle errors and print meaningful messages.
            </p>
          </section>

          {/* Testcases Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg flex-1 overflow-auto flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">🧪 Testcases</h2>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Test 1: No input → Output: Hello World</li>
              <li>Test 2: Input &quot;Alice&quot; → Output: Hello Alice</li>
            </ul>
          </section>
        </div>

        {/* ---------- Center Panel: Monaco Editor + Result ---------- */}
        <div className="w-full md:w-2/4 flex flex-col gap-4 overflow-hidden">
          {/* Editor Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[600px] overflow-hidden flex flex-col gap-y-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">💻 Compiler</h2>
              <select
                className="dark:bg-gray-800 px-2 py-1 rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                {lang.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language={languageMap[language]}
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value || "")}
              />
            </div>

            <div className="mt-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleRun}
              >
                Run Code
              </button>
            </div>
          </section>

          {/* Output Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg max-h-40 overflow-auto flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">📄 Result</h2>
            <pre className="text-sm whitespace-pre-wrap">{output}</pre>
          </section>
        </div>

        {/* ---------- Right Panel: SoundBoard + Lead ---------- */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 overflow-auto">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[45%]">
            <SoundBoard />
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg flex-1 overflow-auto">
            <Lead />
          </section>
        </div>
      </div>
    </div>
  );
}

export default page;