"use client";

import { useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const PersonalTODO = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([input.trim(), ...tasks]);
    setInput("");
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Personal TODO
      </h2>

      {/* Input Row */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-grow px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white outline-none"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <FaPlus />
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-2 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No tasks yet. Add one!
          </p>
        ) : (
          tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm"
            >
              <span className="text-gray-800 dark:text-white truncate">
                {task}
              </span>
              <button
                onClick={() => removeTask(index)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <FaTrashAlt size={14} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PersonalTODO;
