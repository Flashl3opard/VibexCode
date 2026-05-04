import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your VibeXcode dashboard — solved questions, personal todos, leaderboard standing, and community at a glance.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
