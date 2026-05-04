import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join VibeXcode — create your account with email or social login to start solving challenges and chatting with the community.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
