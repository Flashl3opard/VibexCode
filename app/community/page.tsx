// app/community/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "../components/ChatWindow";
import authservice from "../appwrite/auth";
import type { Models } from "appwrite";
import Navbar from "../components/Navbar";

export default function CommunityPage() {
  const router = useRouter();
  const [session, setSession] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authservice
      .checkUser()
      .then((user) => {
        if (!user) {
          router.push("/login");
        } else {
          setSession(user);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        router.push("/login");
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020612] transition-colors duration-300">
      <Navbar />

      <main className="p-4 max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center mt-10 text-black dark:text-white">
            Loading...
          </p>
        ) : (
          <ChatWindow
            conversationId="global-community"
            selfId={session!.$id}
            selfName={session!.name}
          />
        )}
      </main>
    </div>
  );
}
