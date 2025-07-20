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
  }, [router]); // ✅ included router here

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="dark:bg-[#020612]">
        <Navbar />
        <main className="p-4 max-w-4xl mx-auto">
          <ChatWindow
            conversationId="global-community"
            selfId={session!.$id}
            selfName={session!.name}
          />
        </main>
      </div>
    </>
  );
}
