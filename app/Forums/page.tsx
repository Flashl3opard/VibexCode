"use client";

import { useEffect, useState } from "react";
import { FaCode, FaGamepad, FaPython, FaBolt } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdOutlineForum } from "react-icons/md";

import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";
import authservice from "../appwrite/auth";

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

// Forum options
const forums = ["dev", "cp", "python", "games"];

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
    <div className="min-h-screen flex flex-col ">
      {/* Navbar */}
      <Navbar />

      {/* Main layout with sidebar + chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#111827] text-white flex flex-col border-r border-gray-800">
          <div className="p-6 border-b border-gray-700 flex items-center space-x-2">
            <MdOutlineForum className="text-2xl text-primary" />
            <h2 className="text-xl font-bold">Forums</h2>
          </div>

          <ul className="flex-1 p-4 space-y-3 overflow-y-auto">
            {forums.map((forum) => {
              const isSelected = forum === selected;
              return (
                <li key={forum}>
                  <button
                    onClick={() => setSelected(forum)}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition duration-200
                      ${
                        isSelected
                          ? "bg-primary text-white dark:text-white"
                          : "text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                      }`}
                  >
                    {forumIcons[forum] ?? <FaBolt className="text-lg mr-2" />}
                    <span className="capitalize">{forum}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex h-full w-full bg-[#1a1c23] text-white p-4">
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
