"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { account, databases, ID } from "@/lib/appwrite";
import { AppwriteException } from "appwrite";
import { Loader2, AlertTriangle, LogOut } from "lucide-react"; // For better icons

// Clan interface matching your Appwrite collection
interface Clan {
  $id: string;
  name: string;
  tag: string;
  memberCount: number;
}

// Environment variables
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
const CLANS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_CLANS_COLLECTION_ID as string;
const PROFILES_COLLECTION_ID = process.env
  .NEXT_PUBLIC_PROFILES_COLLECTION_ID as string;

const CommunityConnect: React.FC = () => {
  const [myClan, setMyClan] = useState<Clan | null>(null);
  const [joinKey, setJoinKey] = useState<string>("");
  const [newClanName, setNewClanName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null); // Store user ID

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For form submissions
  const [error, setError] = useState<string | null>(null);

  // Fetch initial user and clan data
  useEffect(() => {
    const fetchUserClanData = async () => {
      try {
        const currentUser = await account.get();
        setUserId(currentUser.$id); // Store the user ID

        const profile = await databases.getDocument(
          DATABASE_ID,
          PROFILES_COLLECTION_ID,
          currentUser.$id
        );

        if (profile.clanId) {
          const clanData = await databases.getDocument(
            DATABASE_ID,
            CLANS_COLLECTION_ID,
            profile.clanId as string
          );
          setMyClan(clanData as unknown as Clan);
        }
      } catch (err) {
        // This catch block is for genuine errors, not for users who aren't in a clan.
        if (err instanceof AppwriteException && err.code !== 404) {
          console.error("Failed to fetch user clan data:", err);
          setError(
            "Could not load your community information. Please try refreshing."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserClanData();
  }, []);

  // --- API HANDLERS ---

  const handleJoinClan = async () => {
    if (!joinKey.trim() || !userId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        userId,
        { clanId: joinKey.trim() }
      );
      const clanData = await databases.getDocument(
        DATABASE_ID,
        CLANS_COLLECTION_ID,
        joinKey.trim()
      );
      setMyClan(clanData as unknown as Clan);
      setJoinKey("");
    } catch (err) {
      setError(
        err instanceof AppwriteException ? err.message : "Failed to join clan."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClan = async () => {
    if (!newClanName.trim() || !userId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const tag = newClanName.trim().substring(0, 4).toUpperCase();
      const newClan = await databases.createDocument(
        DATABASE_ID,
        CLANS_COLLECTION_ID,
        ID.unique(),
        { name: newClanName.trim(), tag, memberCount: 1 }
      );
      await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        userId,
        { clanId: newClan.$id }
      );
      setMyClan(newClan as unknown as Clan);
      setNewClanName("");
    } catch (err) {
      setError(
        err instanceof AppwriteException
          ? err.message
          : "Failed to create clan."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveClan = async () => {
    if (!userId) return;
    if (!window.confirm("Are you sure you want to leave this clan?")) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        userId,
        { clanId: null }
      );
      setMyClan(null); // Update UI immediately
    } catch (err) {
      setError(
        err instanceof AppwriteException ? err.message : "Failed to leave clan."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER STATES ---

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex items-center justify-center h-64 border">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Loading Community...</p>
        </div>
      </div>
    );
  }

  if (error && !isSubmitting) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700 text-center">
        <AlertTriangle size={48} className="mx-auto mb-2 text-red-400" />
        <h3 className="text-lg font-semibold text-white">An Error Occurred</h3>
        <p className="text-slate-300 text-sm my-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 h-full"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Community Connect
      </h2>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-200 dark:bg-gray-700 p-1 mb-4">
          {["My Clan", "Join Clan", "Create Clan"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) => cn(/* ...cn styles... */)}
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-2">
          {/* My Clan Panel */}
          <Tab.Panel>
            {myClan ? (
              <div className="space-y-4 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {myClan.name} [{myClan.tag}]
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Members: {myClan.memberCount}
                </p>
                <p className="text-sm text-gray-500">
                  Clan ID:{" "}
                  <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">
                    {myClan.$id}
                  </code>
                </p>
                <button
                  onClick={handleLeaveClan}
                  disabled={isSubmitting}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mx-auto disabled:bg-gray-400"
                >
                  <LogOut size={16} />{" "}
                  {isSubmitting ? "Leaving..." : "Leave Clan"}
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                You're not in a clan yet. Join or create one!
              </p>
            )}
          </Tab.Panel>

          {/* Join Clan Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              <label
                htmlFor="join-key"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enter Clan ID to Join:
              </label>
              <input
                id="join-key"
                value={joinKey}
                onChange={(e) => setJoinKey(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g., 65d8c..."
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleJoinClan}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? "Joining..." : "Join Clan"}
              </button>
            </div>
          </Tab.Panel>

          {/* Create Clan Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              <label
                htmlFor="clan-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Clan Name:
              </label>
              <input
                id="clan-name"
                value={newClanName}
                onChange={(e) => setNewClanName(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g., The Code Crusaders"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCreateClan}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? "Creating..." : "Create Clan"}
              </button>
            </div>
          </Tab.Panel>
        </Tab.Panels>

        {error && isSubmitting && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </Tab.Group>
    </motion.div>
  );
};

export default CommunityConnect;
