import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to VibeXcode with email or social login (Google, GitHub, Facebook).",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
