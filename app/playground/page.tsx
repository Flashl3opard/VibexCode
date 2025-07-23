"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { runJudge0Advanced } from "@/lib/judge0";
import Navbar from "../components/Navbar";
import SoundBoard from "../components/SoundBoard";
import Lead from "../components/Lead";

// Dynamically load Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function PlaygroundPage() {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const lang = ["Javascript", "Python", "Java", "C++"] as const;
  type Language = (typeof lang)[number];
  const [language, setLanguage] = useState<Language>("Javascript");

  const languageMap: Record<
    Language,
    { monacoLang: string; judge0Id: number; defaultCode: string }
  > = {
    Javascript: {
      monacoLang: "javascript",
      judge0Id: 63,
      defaultCode: `// JavaScript Hello World
console.log("Hello, World!");

// Try different examples:
// console.log("Hello JavaScript");
// let name = "Developer";
// console.log("Hello " + name);`,
    },
    Python: {
      monacoLang: "python",
      judge0Id: 71,
      defaultCode: `# Python Hello World
print("Hello, World!")

# Try different examples:
# print("Hello Python")
# name = "Developer"
# print(f"Hello {name}")`,
    },
    Java: {
      monacoLang: "java",
      judge0Id: 62,
      defaultCode: `// Java Hello World
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try different examples:
        // System.out.println("Hello Java");
        // String name = "Developer";
        // System.out.println("Hello " + name);
    }
}`,
    },
    "C++": {
      monacoLang: "cpp",
      judge0Id: 54,
      defaultCode: `// C++ Hello World
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Try different examples:
    // cout << "Hello C++" << endl;
    // string name = "Developer";
    // cout << "Hello " << name << endl;
    
    return 0;
}`,
    },
  };

  const [code, setCode] = useState(languageMap[language].defaultCode);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(languageMap[newLanguage].defaultCode);
    setOutput("");
  };

  const handleRun = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("⏳ Running code...");

    try {
      const result = await runJudge0Advanced(
        code,
        languageMap[language].judge0Id
      );

      // Handle different types of output
      if (result.error) {
        setOutput(`❌ API Error:\n${result.error}`);
      } else if (result.stderr) {
        setOutput(`❌ Runtime Error:\n${result.stderr}`);
      } else if (result.compile_output) {
        setOutput(`⚠️ Compile Error:\n${result.compile_output}`);
      } else if (result.stdout) {
        const executionInfo =
          result.time || result.memory
            ? `\n\n📊 Execution Time: ${result.time || "N/A"}ms | Memory: ${
                result.memory || "N/A"
              }KB`
            : "";
        setOutput(`✅ Output:\n${result.stdout}${executionInfo}`);
      } else {
        setOutput("✅ Code executed successfully (no output)");
      }
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`❌ Execution Error:\n${error.message}`);
      } else {
        setOutput(`❌ Unknown Error:\n${JSON.stringify(error)}`);
      }
    }

    setIsRunning(false);
  };

  const handleClearOutput = () => {
    setOutput("");
  };

  const handleResetCode = () => {
    setCode(languageMap[language].defaultCode);
    setOutput("");
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#020612] bg-gray-50 text-gray-900 dark:text-white">
      <Navbar />

      <div className="flex flex-1 p-3 gap-4 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel: Question + Testcases */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4 overflow-auto">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg dark:shadow-xl h-[200px] lg:h-[45%] flex flex-col gap-y-3">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              🧠 Challenge
            </h2>
            <div className="flex-1 overflow-auto">
              <p className="text-sm leading-relaxed">
                Write a program to print{" "}
                <strong>&quot;Hello, World!&quot;</strong> in your chosen
                language.
              </p>
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  💡 <strong>Tip:</strong> Try experimenting with different
                  languages and see the syntax differences!
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg dark:shadow-xl flex-1 overflow-auto flex flex-col gap-y-3">
            <h2 className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              🧪 Test Cases
            </h2>
            <div className="flex-1 overflow-auto">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-500">✓</span>
                  <span>Print &quot;Hello JavaScript&quot;</span>
                </li>
                <li className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-500">✓</span>
                  <span>Print &quot;Hello Python&quot;</span>
                </li>
                <li className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-500">✓</span>
                  <span>Print &quot;Hello Java&quot;</span>
                </li>
                <li className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-500">✓</span>
                  <span>Print &quot;Hello C++&quot;</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Center Panel: Monaco Editor + Output */}
        <div className="w-full lg:w-2/4 flex flex-col gap-4 overflow-hidden">
          {/* Code Editor Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg dark:shadow-xl h-[400px] lg:h-[600px] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                💻 Code Editor
              </h2>
              <div className="flex items-center gap-3">
                <select
                  className="dark:bg-gray-700 bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={language}
                  onChange={(e) =>
                    handleLanguageChange(e.target.value as Language)
                  }
                  disabled={isRunning}
                >
                  {lang.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleResetCode}
                  className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                  disabled={isRunning}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <MonacoEditor
                height="100%"
                language={languageMap[language].monacoLang}
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isRunning
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">▶️ Run Code</span>
                )}
              </button>
            </div>
          </section>

          {/* Output Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg dark:shadow-xl max-h-48 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                📄 Output
              </h2>
              {output && (
                <button
                  onClick={handleClearOutput}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              {output ? (
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {output}
                </pre>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  Output will appear here after running your code...
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right Panel: SoundBoard + Lead */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4 overflow-auto">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg dark:shadow-xl h-[200px] lg:h-[45%]">
            <SoundBoard />
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg dark:shadow-xl flex-1 overflow-auto">
            <Lead />
          </section>
        </div>
      </div>
    </div>
  );
}
