import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="min-h-screen w-full text-black dark:text-white dark:bg-black flex flex-col justify-center px-8 md:px-24 py-10 transition-colors duration-300">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 h-full">
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
            <button className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:opacity-90 transition-all">
              Create Account
            </button>
          </div>

          {/* Right Image Section */}
          <div className="flex-1 relative flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src="/assets/guyy.png"
              alt="Guy studying"
              layout="fill"
              objectFit="contain"
              className="z-10"
              priority
            />
            {/* Decorative Circles */}
            <div className="absolute w-28 h-28 rounded-full border-8 border-purple-300 dark:border-purple-700 top-24 left-20 md:left-36 opacity-50 z-0"></div>
            <div className="absolute w-20 h-20 rounded-full border-8 border-purple-300 dark:border-purple-700 bottom-4 right-10 opacity-50 z-0"></div>
          </div>
        </div>
      </main>
    </>
  );
}
