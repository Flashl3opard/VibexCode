import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Your VibeXcode profile — solved questions, statistics, current streak, and preferences.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
