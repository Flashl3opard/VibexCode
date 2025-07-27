"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Clock } from "lucide-react";
import { account } from "@/lib/appwrite";

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const PersonalTODO = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [loading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔁 Fetch tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);

        const res = await fetch(`/api/tasks?userId=${user.$id}`);
        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: "Unknown error" }));
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    fetchData();
  }, []);

  // ➕ Add task
  const addTask = async () => {
    if (!input.trim() || !userId) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim(), priority, userId }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Failed to add task");
      }

      const savedTask = await res.json();
      setTasks([savedTask, ...tasks]);
      setInput("");
      setPriority("medium");
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // ✅ Toggle complete
  const toggleTask = async (id: string, currentCompleted: boolean) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted, userId }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Failed to update task");
      }

      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, completed: !currentCompleted } : task
        )
      );
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // ❌ Remove task
  const removeTask = async (id: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Failed to delete task");
      }

      setTasks(tasks.filter((task) => task._id !== id));
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // 🎨 Helper Functions
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 border-red-400";
      case "medium":
        return "text-yellow-400 border-yellow-400";
      case "low":
        return "text-green-400 border-green-400";
      default:
        return "text-slate-400 border-slate-400";
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  // Loading
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-xl p-6 flex items-center justify-center h-64 border border-slate-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-slate-400 text-sm">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <Clock size={48} className="mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error</h3>
          </div>
          <p className="text-slate-300 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col h-full max-h-[95vh] border border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Personal TODO</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-yellow-300">{pendingCount} pending</span>
          <span className="text-green-400">{completedCount} completed</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Priority */}
      <div className="mb-4">
        <label className="block text-sm text-slate-300 mb-2">Priority:</label>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                priority === p
                  ? getPriorityColor(p) + " bg-opacity-20"
                  : "text-slate-400 border-slate-600 hover:border-slate-500"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4 min-w-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-1 px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          onClick={addTask}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-4 bg-slate-700 p-1 rounded-lg">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              filter === f
                ? "bg-slate-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto mb-3 text-slate-500" size={48} />
            <p className="text-slate-400 text-sm">
              {filter === "all"
                ? "No tasks yet. Add one!"
                : filter === "pending"
                ? "No pending tasks!"
                : "No completed tasks!"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`group flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md ${
                  task.completed
                    ? "bg-slate-700 border-slate-600 opacity-75"
                    : "bg-slate-700 border-slate-600 hover:border-slate-500"
                }`}
              >
                <div
                  className={`w-1 h-8 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-400"
                      : task.priority === "medium"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                />

                <button
                  onClick={() => toggleTask(task._id, task.completed)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-slate-500 hover:border-green-400"
                  }`}
                >
                  {task.completed && <Check size={12} />}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm transition-all ${
                      task.completed
                        ? "text-slate-400 line-through"
                        : "text-white"
                    }`}
                  >
                    {task.text}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(task.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <button
                  onClick={() => removeTask(task._id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Total: {tasks.length} tasks</span>
            <span>
              {completedCount > 0 &&
                `${Math.round(
                  (completedCount / tasks.length) * 100
                )}% complete`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTODO;
