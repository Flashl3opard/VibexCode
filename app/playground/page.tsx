"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { runJudge0 } from "@/lib/judge0";
import Navbar from "../components/Navbar";
import SoundBoard from "../components/SoundBoard";
import Lead from "../components/Lead";

// Dynamically load Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function PlaygroundPage() {
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const lang = ["Javascript", "Python", "Java", "C++"] as const;
  type Language = (typeof lang)[number];
  const [language, setLanguage] = useState<Language>("Javascript");

  const languageMap: Record<
    Language,
    { monacoLang: string; judge0Id: number }
  > = {
    Javascript: { monacoLang: "javascript", judge0Id: 63 },
    Python: { monacoLang: "python", judge0Id: 71 },
    Java: { monacoLang: "java", judge0Id: 62 },
    "C++": { monacoLang: "cpp", judge0Id: 54 },
  };

  const handleRun = async () => {
    setOutput("⏳ Running...");
    const result = await runJudge0(code, languageMap[language].judge0Id);
    if (result.stderr) {
      setOutput("❌ Error:\n" + result.stderr);
    } else if (result.compile_output) {
      setOutput("⚠️ Compile Error:\n" + result.compile_output);
    } else {
      setOutput("✅ Output:\n" + result.stdout);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />

      <div className="flex flex-1 p-3 gap-4 overflow-hidden flex-col md:flex-row">
        {/* ---------- Left Panel: Question + Testcases ---------- */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 overflow-auto">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[45%] flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">🧠 Question</h2>
            <p className="text-sm">
              Write a function to print &quot;Hello, World!&quot;. You can try
              using different languages.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg flex-1 overflow-auto flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">🧪 Testcases</h2>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Print &quot;Hello JavaScript&quot;</li>
              <li>Print &quot;Hello Python&quot;</li>
              <li>Print &quot;Hello Java&quot;</li>
              <li>Print &quot;Hello C++&quot;</li>
            </ul>
          </section>
        </div>

        {/* ---------- Center Panel: Monaco Editor + Output ---------- */}
        <div className="w-full md:w-2/4 flex flex-col gap-4 overflow-hidden">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[600px] overflow-hidden flex flex-col gap-y-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">💻 Code Editor</h2>
              <div className="flex gap-2 items-center">
                <select
                  className="text-sm rounded-md px-2 py-1 bg-gray-200 dark:bg-gray-700"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                >
                  {lang.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleRun}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                >
                  ▶ Run
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
              <MonacoEditor
                height="100%"
                language={languageMap[language].monacoLang}
                theme="vs-dark"
                value={code}
                onChange={(newCode) => setCode(newCode || "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-40 overflow-auto">
            <h2 className="text-lg font-semibold mb-2">📤 Output</h2>
            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
          </section>
        </div>

        {/* ---------- Right Panel: SoundBoard + Lead ---------- */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 overflow-auto">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[45%]">
            <SoundBoard />
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg flex-1">
            <Lead />
          </section>
        </div>
      </div>
    </div>
  );
}
