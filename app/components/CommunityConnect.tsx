"use client";

/**
 * CommunityConnect — placeholder.
 *
 * The clan create/join/leave flow previously hit Appwrite Databases. As part
 * of consolidating the auth + storage stack, the clan storage layer is being
 * migrated; until that lands, this component renders a card that explains
 * the state of the feature instead of calling a backend that no longer
 * matches the rest of the app's data model.
 */

import { Users } from "lucide-react";

export default function CommunityConnect() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center gap-3">
      <Users className="w-10 h-10 text-blue-500" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Clans
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        Group coding squads are being rebuilt on the unified storage layer.
        For now, jump into the public forums or the playground.
      </p>
    </div>
  );
}
