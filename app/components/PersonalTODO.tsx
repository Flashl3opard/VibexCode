"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const PersonalTODO = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([input.trim(), ...tasks]);
    setInput("");
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-800 rounded-2xl shadow-xl p-5 flex flex-col h-full max-h-[90vh]">
      <h2 className="text-xl font-semibold text-white mb-4">Personal TODO</h2>

      {/* Input Row - Fixed overflow */}
      <div className="flex gap-2 mb-4 min-w-0">
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && addTask()
          }
          placeholder="Add a task..."
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          onClick={addTask}
          className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex-shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-8">
            No tasks yet. Add one!
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded-lg shadow-sm min-w-0"
              >
                <span className="text-white truncate flex-1 mr-2">{task}</span>
                <button
                  onClick={() => removeTask(index)}
                  className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalTODO;
