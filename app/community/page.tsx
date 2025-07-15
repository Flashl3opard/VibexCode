// app/community/page.tsx

import ChatWindow from "../components/ChatWindow";
import authservice from "../appwrite/auth";
import { redirect } from "next/navigation";
import type { Models } from "appwrite";

export default async function CommunityPage() {
  let session: Models.User<Models.Preferences> | null = null;

  try {
    session = await authservice.checkUser();
  } catch (err) {
    console.error("User not logged in:", err);
    redirect("/login"); // protect page
  }

  // Fallback in case checkUser returned null
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <ChatWindow
        conversationId="global-community"
        selfId={session.$id}
        selfName={session.name}
      />
    </main>
  );
}
