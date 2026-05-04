import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the VibeXcode community — collaborative chat rooms scoped per conversation, with persistent history.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
