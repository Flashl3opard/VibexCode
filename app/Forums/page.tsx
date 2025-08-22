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

// Using the icons from your original code to maintain consistency
const forumIcons: Record<string, React.ReactNode> = {
  dev: <FaCode className="mr-3 text-lg" />,
  cp: <SiLeetcode className="mr-3 text-lg" />,
  python: <FaPython className="mr-3 text-lg" />,
  games: <FaGamepad className="mr-3 text-lg" />,
  general: <FaBolt className="mr-3 text-lg" />,
};

const forums = ["dev", "cp", "python", "games", "general"];

export default function ForumsPage() {
  const [selected, setSelected] = useState<string>("cp"); // Default to 'cp' as in the image
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This logic remains the same
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
      <div className="flex items-center justify-center h-screen bg-[#0d1117] text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1117] text-red-500">
        User not found. Please log in.
      </div>
    );
  }

  // MOBILE VIEW (Simplified for chat focus)
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-[#0d1117] text-gray-300">
        <Navbar />
        <header className="flex items-center p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold uppercase text-white">
            {selected} Chat
          </h1>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
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
    <div className="h-screen flex flex-col bg-[#0d1117] text-gray-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-col p-4 bg-[#161b22] border-r border-gray-800 hidden md:flex">
          <h2 className="text-xl font-bold text-white mb-6 px-2">Forums</h2>
          <ul className="space-y-2">
            {forums.map((forum) => {
              const isSelected = forum === selected;
              return (
                <li key={forum}>
                  <button
                    onClick={() => setSelected(forum)}
                    className={`w-full flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-left
                      ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:bg-[#21262d] hover:text-white"
                      }`}
                  >
                    {forumIcons[forum]}
                    <span className="capitalize">{forum}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header for the chat area */}
          <header className="px-6 py-4 border-b border-gray-800">
            <h1 className="text-xl font-bold uppercase text-white">
              {selected} Chat
            </h1>
          </header>

          {/* ChatWindow now takes up the remaining space */}
          <div className="flex-1 overflow-hidden">
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
