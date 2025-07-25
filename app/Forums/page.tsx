"use client";

import { useEffect, useState } from "react";
import { FaCode, FaGamepad, FaPython, FaBolt } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";
import authservice from "../appwrite/auth";
import ForumSelector from "../components/ForumSelector";

interface User {
  $id: string;
  name: string;
}

// Icon map for forums
const forumIcons: Record<string, React.ReactNode> = {
  dev: <FaCode className="text-lg mr-2" />,
  cp: <SiLeetcode className="text-lg mr-2" />,
  python: <FaPython className="text-lg mr-2" />,
  games: <FaGamepad className="text-lg mr-2" />,
};

const forums = ["dev", "cp", "python", "games", "general"];

export default function ForumsPage() {
  const [selected, setSelected] = useState("dev");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const appwriteUser = await authservice.checkUser();
        if (appwriteUser) {
          setUser({
            $id: appwriteUser.$id,
            name: appwriteUser.name || appwriteUser.email || "User",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch Appwrite user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-400">
        Loading your chat profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 dark:text-red-400">
        User not found or not logged in.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col  text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-64 flex flex-col border-r 
           border-gray-200 text-gray-900
          dark:bg-[#020612] dark:text-white dark:border-gray-800 transition-colors"
        >
          <ul className="flex-1 p-4 space-y-3 overflow-y-auto">
            {forums.map((forum) => {
              const isSelected = forum === selected;
              return (
                <li key={forum}>
                  <button
                    onClick={() => setSelected(forum)}
                    className={`w-full flex items-center px-4 py-2 rounded-lg font-medium transition duration-200
                      ${
                        isSelected
                          ? "bg-purple-900 text-white shadow dark:bg-[#d946ef]" // Accent - adjust as desired
                          : "bg-gray-200 text-gray-900 hover:bg-[#e9d5ff] hover:text-[#c026d3] dark:bg-[#23263b] dark:text-gray-200 dark:hover:bg-[#c026d3] dark:hover:text-white"
                      }`}
                  >
                    {forumIcons[forum] ?? <FaBolt className="text-lg mr-2" />}
                    <span className="capitalize font-semibold">{forum}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f9faff] dark:bg-[#101226] text-gray-900 dark:text-white transition-colors">
          {/* Optional: Use selector at top on small screens */}
          <div className="block md:hidden">
            <ForumSelector selected={selected} onSelect={setSelected} />
          </div>
          <div className="flex h-full w-full">
            <ChatWindow
              conversationId={selected}
              selfId={user.$id}
              selfName={user.name}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
