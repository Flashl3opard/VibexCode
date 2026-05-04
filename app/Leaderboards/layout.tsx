import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboards",
  description:
    "See who's solving the most questions and holding the longest streaks on VibeXcode.",
};

export default function LeaderboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
