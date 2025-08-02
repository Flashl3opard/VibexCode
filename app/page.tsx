"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import authservice from "./appwrite/auth";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

// Helper for random between min and max
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random properties for 5 rings on mobile
const genMobileRingProps = () =>
  Array(5)
    .fill(0)
    .map(() => {
      const positions = [
        { style: { top: rand(10, 60), left: rand(10, 70) } },
        { style: { bottom: rand(10, 60), right: rand(10, 70) } },
        { style: { top: rand(10, 70), right: rand(10, 60) } },
        { style: { bottom: rand(10, 70), left: rand(10, 60) } },
        { style: { bottom: rand(30, 80), right: rand(10, 50) } },
      ];
      const pos = positions[rand(0, positions.length - 1)].style;
      const animTime = rand(2800, 4200);
      const animX = rand(8, 32) * (Math.random() > 0.5 ? 1 : -1);
      const animY = rand(8, 32) * (Math.random() > 0.5 ? 1 : -1);
      return {
        style: {
          position: "absolute",
          ...pos,
          opacity: Math.random() > 0.5 ? 0.4 : 0.3,
          animation: `floatRingMobile ${animTime}ms ease-in-out infinite alternate`,
          "--ring-anim-x": `${animX}px`,
          "--ring-anim-y": `${animY}px`,
        } as unknown as React.CSSProperties,
      };
    });

// Generate random properties for desktop rings (fixed positions + animation)
const genDesktopRingProps = () => {
  const positions = [
    { top: 96, left: 80 }, // top-24 left-20 (24*4=96, 20*4=80 px)
    { bottom: 16, right: 40 }, // bottom-4 right-10
    { top: 40, right: 64 }, // top-10 right-16
    { bottom: 64, left: 40 }, // bottom-16 left-10
    { bottom: 112, right: 112 }, // bottom-28 right-28
  ];

  return positions.map((pos) => {
    const animTime = rand(2800, 4200);
    const animX = rand(8, 32) * (Math.random() > 0.5 ? 1 : -1);
    const animY = rand(8, 32) * (Math.random() > 0.5 ? 1 : -1);
    return {
      style: {
        position: "absolute",
        ...pos,
        opacity: 0.4,
        animation: `floatRingDesktop ${animTime}ms ease-in-out infinite alternate`,
        "--ring-anim-x": `${animX}px`,
        "--ring-anim-y": `${animY}px`,
      } as unknown as React.CSSProperties,
    };
  });
};

// Define the CSS animation keyframes
const mobileRingsCSS = `
@keyframes floatRingMobile {
  0%   { transform: translate(0, 0);}
  100% {
    transform: translate(var(--ring-anim-x,12px), var(--ring-anim-y,12px));
  }
}
`;

const desktopRingsCSS = `
@keyframes floatRingDesktop {
  0%   { transform: translate(0, 0);}
  100% {
    transform: translate(var(--ring-anim-x,12px), var(--ring-anim-y,12px));
  }
}
`;

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const value = useSelector((state: RootState) => state.auth.status);

  // For random ring positions on each mount
  const [mobileRingProps, setMobileRingProps] = useState(() =>
    genMobileRingProps()
  );
  const [desktopRingProps, setDesktopRingProps] = useState(() =>
    genDesktopRingProps()
  );

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    const checkUser = async () => {
      try {
        const result = await authservice.checkUser();
        if (result) setLoggedIn(true);
      } catch (error) {
        console.error("Error checking user authentication:", error);
        setLoggedIn(false);
      }
    };
    checkUser();
  }, [value]);

  // On remounts, update rings
  useEffect(() => {
    setMobileRingProps(genMobileRingProps());
    setDesktopRingProps(genDesktopRingProps());
  }, []);

  return (
    <>
      {/* Add animation CSS to the head */}
      <style>{mobileRingsCSS + desktopRingsCSS}</style>
      <div className="h-screen md:overflow-hidden overflow-auto">
        <Navbar />
        <main className="min-h-screen w-full text-black dark:text-white dark:bg-[#020612] px-4 sm:px-8 md:px-24 pb-8 transition-colors duration-300 relative overflow-hidden">
          {/* Top left headphones -- large only */}
          <div
            className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-float-in-top hidden sm:block md:w-[320px] w-[200px]"
            data-aos="fade-down"
          >
            <Image
              src="/assets/headphones1.png"
              alt="Hanging Headphones"
              width={320}
              height={320}
              className="rotate-180 object-contain translate-y-0 translate-x-50 animate-levitate"
              style={{
                filter: "drop-shadow(-10px -10px 30px rgba(168, 85, 247, 0.6))",
              }}
              priority
            />
          </div>

          {/* Bottom right laptop -- large only */}
          <div
            className="fixed bottom-0 right-4 sm:right-20 z-40 pointer-events-none animate-enter-up hidden sm:block md:w-[300px] w-[180px]"
            data-aos="fade-up"
          >
            <div className="animate-levitate">
              <Image
                src="/assets/lap2.png"
                alt="Laptop"
                width={300}
                height={300}
                className="rotate-[-20deg] object-contain"
                style={{
                  filter:
                    "drop-shadow(-10px -10px 30px rgba(168, 85, 247, 0.6))",
                }}
                priority
              />
            </div>
          </div>

          {/* Main content: flex container with responsive stacking */}
          <div className="flex flex-col-reverse md:flex-row items-center md:justify-between justify-center gap-8 md:gap-10 min-h-[calc(100vh-4rem)] pt-12 md:pt-24 relative z-20 max-w-7xl mx-auto">
            {loggedIn ? (
              <motion.div
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-purple-600">A</span>{" "}
                  <span className="text-gray-900 dark:text-white">New Way</span>{" "}
                  <span className="text-purple-600">To</span>{" "}
                  <span className="text-purple-500">Learn</span>
                </h1>
                <p className="mt-4 sm:mt-6 text-gray-700 dark:text-gray-300 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
                  VibexCode is the best platform to help you enhance your
                  skills, expand your knowledge and prepare for technical
                  interviews.
                </p>
                <Link href="playground?id=6884bb87f1b587e466becd87" passHref>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow hover:opacity-90 transition-all w-full sm:w-auto max-w-xs mx-auto md:mx-0"
                  >
                    Begin Coding
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-purple-600">A</span>{" "}
                  <span className="text-gray-900 dark:text-white">New Way</span>{" "}
                  <span className="text-purple-600">To</span>{" "}
                  <span className="text-purple-500">Learn</span>
                </h1>
                <p className="mt-4 sm:mt-6 text-gray-700 dark:text-gray-300 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
                  VibexCode is the best platform to help you enhance your
                  skills, expand your knowledge and prepare for technical
                  interviews.
                </p>
                <Link href="/signup" passHref>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow hover:opacity-90 transition-all w-full sm:w-auto max-w-xs mx-auto md:mx-0"
                  >
                    Create Account
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Right Decorative Circles: animate randomly on mobile only */}
            <div className="flex-1 relative flex flex-col justify-end items-end h-full w-full max-w-md md:max-w-none sm:hidden">
              {mobileRingProps.map((ring, i) => (
                <div
                  key={i}
                  className={[
                    "absolute z-0",
                    i === 0
                      ? "w-20 h-20 border-8 border-purple-300 dark:border-purple-700 rounded-full"
                      : i === 1
                      ? "w-12 h-12 border-8 border-purple-300 dark:border-purple-700 rounded-full"
                      : i === 2
                      ? "w-10 h-10 border-4 border-purple-400 dark:border-purple-600 rounded-full"
                      : i === 3
                      ? "w-16 h-16 border-4 border-pink-400 dark:border-pink-600 rounded-full"
                      : "w-8 h-8 border-4 border-blue-400 dark:border-blue-600 rounded-full",
                  ].join(" ")}
                  style={ring.style}
                />
              ))}
            </div>

            {/* Desktop/Tablet: animated rings */}
            <motion.div
              className="flex-1 relative flex-col justify-end items-end h-full w-full max-w-md md:max-w-none hidden sm:flex"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {desktopRingProps.map((ring, i) => (
                <div
                  key={i}
                  className={[
                    "rounded-full z-0",
                    i === 0
                      ? "w-20 h-20 border-8 border-purple-300 dark:border-purple-700 opacity-50"
                      : i === 1
                      ? "w-20 h-20 border-8 border-purple-300 dark:border-purple-700 opacity-50"
                      : i === 2
                      ? "w-16 h-16 border-4 border-purple-400 dark:border-purple-600 opacity-40"
                      : i === 3
                      ? "w-24 h-24 border-4 border-pink-400 dark:border-pink-600 opacity-40"
                      : "w-12 h-12 border-4 border-blue-400 dark:border-blue-600 opacity-40",
                  ].join(" ")}
                  style={ring.style}
                />
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
