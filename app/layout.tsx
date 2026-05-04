import type { Metadata } from "next";
import { Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./store/provider";
import RouteProgress from "./components/RouteProgress";
import AuthGuard from "./components/AuthGuard";

// Load Sora for main text
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Load Geist Mono for code blocks
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://vibexcode.netlify.app";
const SITE_NAME = "VibeXcode";
const SITE_TITLE = "VibeXcode — A collaborative way to vibe and code";
const SITE_DESCRIPTION =
  "VibeXcode is a developer community platform with real-time forum chat, a multi-language code playground powered by Judge0, leaderboards, and a collaborative Q&A.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · VibeXcode",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "VibeXcode",
    "coding playground",
    "collaborative coding",
    "developer community",
    "code execution",
    "Judge0",
    "real-time chat",
    "leaderboard",
    "competitive programming",
    "Next.js",
  ],
  authors: [{ name: "VibeXcode" }],
  creator: "VibeXcode",
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${geistMono.variable}`}>
      <body className="bg-gradient-to-r cursor-text2 from-[#e0c3fc] to-[#8ec5fc] dark:bg-black min-h-screen antialiased">
        <RouteProgress />
        <ReduxProvider>
          <AuthGuard>{children}</AuthGuard>
        </ReduxProvider>
      </body>
    </html>
  );
}
