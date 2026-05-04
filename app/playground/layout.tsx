import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Multi-language code playground — write and execute JavaScript, Python, Java, or C++ in a sandbox powered by Judge0, with live diffing against expected output.",
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
