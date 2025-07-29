"use client";

import { useEffect, useState } from "react";
import {
  FaCode,
  FaGamepad,
  FaPython,
  FaBolt,
  FaArrowLeft,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";
import authservice from "../appwrite/auth";

interface User {
  $id: string;
  name: string;
}

const forumIcons: Record<string, React.ReactNode> = {
  dev: <FaCode className="text-lg mr-2" />,
  cp: <SiLeetcode className="text-lg mr-2" />,
  python: <FaPython className="text-lg mr-2" />,
  games: <FaGamepad className="text-lg mr-2" />,
};

const forums = ["dev", "cp", "python", "games", "general"];

export default function ForumsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Track if on mobile screen by window width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // MOBILE VIEW

  if (isMobile) {
    // If no forum selected => show forums list styled like desktop sidebar (full screen)
    if (!selected) {
      return (
        <div className="min-h-screen bg-white dark:bg-[#020612] text-gray-900 dark:text-white flex flex-col">
          <Navbar />

          <aside
            className="w-full flex flex-col border-r border-gray-200 text-gray-900
                       dark:bg-[#020612] dark:text-white dark:border-gray-800 transition-colors"
          >
            <ul className="flex-1 p-4 space-y-3 overflow-y-auto">
              {forums.map((forum) => {
                // No selected forum on list screen, but can highlight last clicked if you want
                const isSelected = forum === selected;

                return (
                  <li key={forum}>
                    <button
                      onClick={() => setSelected(forum)}
                      className={`w-full flex items-center px-4 py-2 rounded-lg font-medium transition duration-200
                        ${
                          isSelected
                            ? "bg-purple-900 text-white shadow dark:bg-[#d946ef]"
                            : "bg-gray-200 text-gray-900 hover:bg-[#e9d5ff] hover:text-[#c026d3] dark:bg-[#23263b] dark:text-gray-200 dark:hover:bg-[#c026d3] dark:hover:text-white"
                        }
                      `}
                    >
                      {forumIcons[forum] ?? <FaBolt className="text-lg mr-2" />}
                      <span className="capitalize font-semibold">{forum}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      );
    }

    // Forum selected => show chat window with back button
    return (
      <div className="min-h-screen flex flex-col bg-[#f9faff] dark:bg-[#101226] text-gray-900 dark:text-white">
        <Navbar />

        <header className="flex items-center px-4 py-3 border-b dark:border-gray-700">
          <button
            onClick={() => setSelected(null)}
            className="mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#23263b]"
            aria-label="Back to forums"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold capitalize">{selected}</h1>
        </header>

        <main className="flex-1 overflow-hidden">
          <ChatWindow
            conversationId={selected}
            selfId={user.$id}
            selfName={user.name}
          />
        </main>
      </div>
    );
  }

  // DESKTOP VIEW

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-64 flex flex-col border-r border-gray-200 text-gray-900
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
          <ChatWindow
            conversationId={selected || "dev"}
            selfId={user.$id}
            selfName={user.name}
          />
        </main>
      </div>
    </div>
  );
}
