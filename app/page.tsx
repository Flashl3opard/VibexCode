import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="h-screen w-full text-black dark:text-white dark:bg-[#020612] px-8 md:px-24 pb-0 transition-colors duration-300 relative overflow-hidden">
        {/* Hanging Headphones */}
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-float-in-top">
          <Image
            src="/assets/headphones1.png"
            alt="Hanging Headphones"
            width={320}
            height={320}
            className="rotate-180 object-contain translate-y-0 translate-x-40 animate-levitate"
            style={{
              filter: "drop-shadow(-10px -10px 30px rgba(168, 85, 247, 0.6))",
            }}
            priority
          />
        </div>

        {/* Floating Laptop */}
        <div className="fixed bottom-0 right-20 z-40 pointer-events-none animate-enter-up">
          <div className="animate-levitate">
            <Image
              src="/assets/lap2.png"
              alt="Laptop"
              width={300}
              height={300}
              className="rotate-[-20deg] object-contain filter"
              style={{
                filter: "drop-shadow(-10px -10px 30px rgba(168, 85, 247, 0.6))",
              }}
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 h-full pt-24 relative z-20">
          {/* Left Text Section */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-purple-600">A</span>{" "}
              <span className="text-gray-900 dark:text-white">New Way</span>{" "}
              <span className="text-purple-600">To</span>{" "}
              <span className="text-purple-500">Learn</span>
            </h1>
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg max-w-lg mx-auto md:mx-0">
              LeetCode is the best platform to help you enhance your skills,
              expand your knowledge and prepare for technical interviews.
            </p>
            <Link href="/signup">
              <button className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:opacity-90 transition-all">
                Create Account
              </button>
            </Link>
          </div>

          {/* Decorative Circles */}
          <div className="flex-1 relative flex flex-col justify-end items-end h-full">
            <div className="absolute w-28 h-28 rounded-full border-8 border-purple-300 dark:border-purple-700 top-24 left-20 md:left-36 opacity-50 z-0"></div>
            <div className="absolute w-20 h-20 rounded-full border-8 border-purple-300 dark:border-purple-700 bottom-4 right-10 opacity-50 z-0"></div>
            <div className="absolute w-16 h-16 rounded-full border-4 border-purple-400 dark:border-purple-600 top-10 right-16 opacity-40 z-0"></div>
            <div className="absolute w-24 h-24 rounded-full border-4 border-pink-400 dark:border-pink-600 bottom-16 left-10 opacity-40 z-0"></div>
            <div className="absolute w-12 h-12 rounded-full border-4 border-blue-400 dark:border-blue-600 bottom-32 right-28 opacity-40 z-0"></div>
          </div>
        </div>
      </main>
    </>
  );
}
