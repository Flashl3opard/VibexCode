"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SoundBoard from "../components/SoundBoard";
import Lead from "../components/Lead";
import Navbar from "../components/Navbar";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function Page() {
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput("✅ Code ran successfully!\nOutput: Hello World");
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#020612] text-gray-900 dark:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 p-3 gap-4 overflow-hidden flex-col md:flex-row">
        {/* Left Side */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 overflow-auto">
          {/* Question Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[45%] flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">🧠 Question</h2>
            <p className="text-sm">
              Write a function to print "Hello, World!" to the console. Make
              sure to handle errors and print meaningful messages.
            </p>
          </section>

          {/* Testcase Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg flex-1 overflow-auto flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">🧪 Testcases</h2>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Test 1: No input → Output: Hello World</li>
              <li>Test 2: Input "Alice" → Output: Hello Alice</li>
            </ul>
          </section>
        </div>

        {/* Center Section */}
        <div className="w-full md:w-2/4 flex flex-col gap-4 overflow-hidden">
          {/* Compiler */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[600px] overflow-hidden flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">💻 Compiler</h2>
            <div className="flex-1">
              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
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

          {/* Result */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg max-h-40 overflow-auto flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">📄 Result</h2>
            <pre className="text-sm whitespace-pre-wrap">{output}</pre>
          </section>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 overflow-auto">
          {/* Soundboard Component */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[45%]">
            <SoundBoard />
          </section>

          {/* Leaderboard Component */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg flex-1 overflow-auto">
            <Lead />
          </section>
        </div>
      </div>
    </div>
  );
}
