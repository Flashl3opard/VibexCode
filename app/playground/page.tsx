"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { runJudge0Advanced } from "@/lib/judge0";
import Navbar from "../components/Navbar";
import SoundBoard from "../components/SoundBoard";
import Lead from "../components/Lead";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type Question = {
  _id: string;
  title: string;
  description: string;
  testcases?: string;
  solutions?: string;
  difficulty?: string;
};

const languages = ["Javascript", "Python", "Java", "C++"] as const;
type Language = (typeof languages)[number];

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

export default function PlaygroundPage() {
  const searchParams = useSearchParams();
  const questionId = searchParams?.get("id");

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState<Language>("Javascript");
  const [code, setCode] = useState(languageMap[language].defaultCode);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const [answerInput, setAnswerInput] = useState<string>("");

  useEffect(() => {
    if (!questionId) {
      setError("❌ No question ID provided in URL.");
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${questionId}`);
        if (!res.ok)
          throw new Error(`Failed to fetch question (${res.status})`);
        const data = await res.json();
        if (data.success) {
          setQuestion(data.question);
          setAnswerInput(data.question.solutions || "");
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  // Reset code and output on language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(languageMap[newLanguage].defaultCode);
    setOutput("");
  };

  const handleRun = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("⏳ Running...");

    try {
      const result = await runJudge0Advanced(
        code,
        languageMap[language].judge0Id
      );

      if ("error" in result && result.error) {
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

  const handleResetCode = () => {
    setCode(languageMap[language].defaultCode);
    setOutput("");
  };

  const handleClearOutput = () => {
    setOutput("");
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#020612] text-gray-900 dark:text-white">
      <Navbar />

      <div className="flex flex-1 p-3 gap-4 overflow-hidden flex-col md:flex-row">
        {/* --------- Left Panel: Question + Testcases + Editable Answer --------- */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 overflow-auto">
          {/* Question Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[30%] flex flex-col">
            <h2 className="text-xl font-semibold mb-2">🧠 Question</h2>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Error: {error}</p>
            ) : question ? (
              <>
                <h3 className="font-bold mb-2">{question.title}</h3>
                <div className="text-sm overflow-auto flex-1 prose dark:prose-invert">
                  <ReactMarkdown>{question.description}</ReactMarkdown>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No question found</p>
            )}
          </section>

          {/* Testcases Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[30%] flex flex-col">
            <h2 className="text-lg font-semibold mb-2">🧪 Testcases</h2>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : question?.testcases ? (
              <pre className="text-sm whitespace-pre-wrap overflow-auto flex-1">
                {question.testcases}
              </pre>
            ) : (
              <p className="text-sm text-gray-500">No testcases available</p>
            )}
          </section>

          {/* Editable Answer Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[400px] md:h-[40%] flex flex-col">
            <h2 className="text-lg font-semibold mb-2">
              📝 Your Answer (Markdown)
            </h2>
            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Write your solution in Markdown here..."
              className="flex-1 resize-none p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-[#2a2a2f] text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h3 className="mt-4 mb-2 font-semibold text-sm">Live Preview</h3>
            <div className="flex-1 overflow-auto prose dark:prose-invert border border-gray-200 dark:border-gray-700 rounded p-3 bg-white dark:bg-gray-900 text-sm">
              <ReactMarkdown>
                {answerInput || "_Nothing to preview_"}
              </ReactMarkdown>
            </div>
          </section>
        </div>

        {/* -------- Center Panel: Editor + Output -------- */}
        <div className="w-full md:w-2/4 flex flex-col gap-4 overflow-hidden">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg h-[200px] md:h-[600px] overflow-hidden flex flex-col gap-y-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">💻 Compiler</h2>
              <div className="flex items-center gap-3">
                <select
                  className="dark:bg-gray-800 px-2 py-1 rounded"
                  value={language}
                  onChange={(e) =>
                    handleLanguageChange(e.target.value as Language)
                  }
                  disabled={isRunning}
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleResetCode}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md"
                  disabled={isRunning}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language={languageMap[language].monacoLang}
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </div>

            <div className="mt-2">
              <button
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500`}
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? "⏳ Running..." : "Run Code"}
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow dark:shadow-lg max-h-40 overflow-auto flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">📄 Result</h2>
              {output && (
                <button
                  onClick={handleClearOutput}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
            <pre className="text-sm whitespace-pre-wrap">
              {output || "Output will appear here after running your code..."}
            </pre>
          </section>
        </div>

        {/* -------- Right Panel: SoundBoard + Leaderboard -------- */}
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
