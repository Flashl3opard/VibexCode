import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forums",
  description:
    "Real-time topic forums on dev, competitive programming, Python, games, and general — chat with the VibeXcode community.",
};

export default function ForumsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
