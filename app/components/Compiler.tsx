"use client";
import React, { useState } from "react";
import axios from "axios";
import AceEditor from "react-ace";
import { FaPlay } from "react-icons/fa";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

const languages = [
  { name: "C++", id: 54, mode: "c_cpp" },
  { name: "Python", id: 71, mode: "python" },
  { name: "JavaScript", id: 63, mode: "javascript" },
];

const Compiler: React.FC = () => {
  const [languageId, setLanguageId] = useState<number>(54); // default C++
  const [editorMode, setEditorMode] = useState<string>("c_cpp");
  const [code, setCode] = useState<string>(
    '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}'
  );
  const [output, setOutput] = useState<string>("");

  const handleRun = async () => {
    setOutput("Running...");
    try {
      const encodedSource = btoa(code); // base64 encode

      const submissionRes = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: encodedSource,
          language_id: languageId,
          stdin: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY_HERE", // replace this!
          },
          params: { base64_encoded: "true", wait: "true" },
        }
      );

      const { stdout, stderr, compile_output, status } = submissionRes.data;

      if (status.description !== "Accepted") {
        setOutput(compile_output || stderr || "Error running code.");
      } else {
        setOutput(stdout || "No output");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setOutput("Error: " + error.message);
      } else {
        setOutput("Unknown error occurred.");
      }
    }
  };

  const handleLanguageChange = (langId: number, mode: string) => {
    setLanguageId(langId);
    setEditorMode(mode);
  };

  return (
    <div className="bg-slate-900 text-white w-full max-w-4xl mx-auto rounded-2xl p-4 shadow-xl border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-emerald-400 text-xl font-semibold">
          Judge0 Compiler
        </h2>
        <select
          className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm"
          onChange={(e) => {
            const selected = languages[parseInt(e.target.selectedIndex)];
            handleLanguageChange(selected.id, selected.mode);
          }}
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <AceEditor
        mode={editorMode}
        theme="monokai"
        value={code}
        onChange={(val) => setCode(val)}
        name="code-editor"
        fontSize={14}
        width="100%"
        height="300px"
        showPrintMargin={false}
        className="rounded-md"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          useWorker: false,
        }}
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleRun}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition"
        >
          <FaPlay /> Run
        </button>
      </div>

      <div className="mt-4 bg-slate-800 p-3 rounded-md border border-slate-700 text-sm whitespace-pre-wrap">
        <span className="text-emerald-300 font-semibold">Output:</span>
        <pre className="mt-1 text-white">{output}</pre>
      </div>
    </div>
  );
};

export default Compiler;
