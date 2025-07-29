"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";

// Types for clan
interface Clan {
  name: string;
  key: string;
  members?: string[];
}

const CommunityConnect: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [myClan, setMyClan] = useState<Clan | null>(null);
  const [joinKey, setJoinKey] = useState<string>("");
  const [newClanName, setNewClanName] = useState<string>("");

  const handleJoinClan = () => {
    // TODO: validate joinKey with backend
    alert(`Attempting to join clan with key: ${joinKey}`);
  };

  const handleCreateClan = () => {
    // TODO: send newClanName to backend
    alert(`Creating clan: ${newClanName}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Community Connect</h2>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-200 dark:bg-gray-700 p-1 mb-4">
          {["My Clan", "Join Clan", "Create Clan"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }: { selected: boolean }) =>
                cn(
                  "w-full py-2.5 text-sm font-medium leading-5 text-center rounded-lg",
                  selected
                    ? "bg-white dark:bg-gray-900 text-blue-600 shadow"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-2">
          {/* My Clan Tab */}
          <Tab.Panel>
            {myClan ? (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{myClan.name}</h3>
                <p>Members: {myClan.members?.length || 0}</p>
                <p>Join Key: {myClan.key}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                  Enter Clan
                </button>
              </div>
            ) : (
              <p className="text-gray-500">You&apos;re not in a clan yet.</p>
            )}
          </Tab.Panel>

          {/* Join Clan Tab */}
          <Tab.Panel>
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Enter Join Key:
              </label>
              <input
                value={joinKey}
                onChange={(e) => setJoinKey(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900"
                placeholder="e.g., code-ninjas-42"
              />
              <button
                onClick={handleJoinClan}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Join Clan
              </button>
            </div>
          </Tab.Panel>

          {/* Create Clan Tab */}
          <Tab.Panel>
            <div className="space-y-4">
              <label className="block text-sm font-medium">Clan Name:</label>
              <input
                value={newClanName}
                onChange={(e) => setNewClanName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900"
                placeholder="e.g., Debug Masters"
              />
              <button
                onClick={handleCreateClan}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md"
              >
                Create Clan
              </button>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </motion.div>
  );
};

export default CommunityConnect;
