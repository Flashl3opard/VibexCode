"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Image from "next/image";
import { BsFillBarChartFill } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-gray-800 dark:bg-[#020612] dark:text-white transition-all">
        <main className="p-4 md:p-10">
          {/* Header */}
          <div
            className="flex flex-col md:flex-row justify-between items-start gap-4"
            data-aos="fade-down"
          >
            <div>
              <h2 className="text-3xl font-bold">Welcome!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Here is your Profile Dashboard
              </p>
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 rounded-full border-2 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:outline-none"
              />
              <CgProfile className="scale-150 text-gray-700 dark:text-white" />
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Recent Tests */}
              <section data-aos="fade-up">
                <h3 className="text-xl font-semibold mb-4">Recent Tests</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  {[
                    {
                      title: "C Programming",
                      score: "75%",
                      color: "bg-green-600",
                      src: "/assets/code1.jpg",
                    },
                    {
                      title: "Python Programming",
                      score: "23%",
                      color: "bg-red-600",
                      src: "/assets/code2.png",
                    },
                  ].map((test, index) => (
                    <div
                      key={index}
                      className="relative w-full md:w-64 h-40 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(128,0,255,0.4)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_6px_30px_rgba(128,0,255,0.6)]"
                      data-aos="zoom-in"
                      data-aos-delay={index * 200}
                    >
                      <Image
                        src={test.src}
                        alt={test.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                        priority
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded">
                        {test.title}
                      </div>
                      <div
                        className={`absolute bottom-2 right-2 ${test.color} text-white px-3 py-1 rounded-full text-sm`}
                      >
                        {test.score}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Upcoming Quizzes */}
              <section data-aos="fade-up">
                <h3 className="text-xl font-semibold mb-4">Upcoming Quizzes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "C Programming Quiz", date: "12th Aug, 2023" },
                    { title: "Python Challenge", date: "19th Aug, 2023" },
                    { title: "AI/ML Quiz", date: "25th Aug, 2023" },
                  ].map((quiz, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-[0_4px_20px_rgba(128,0,255,0.4)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_6px_30px_rgba(128,0,255,0.6)]"
                      data-aos="flip-up"
                      data-aos-delay={i * 200}
                    >
                      <h4 className="text-md font-medium">{quiz.title}</h4>
                      <div className="text-4xl mt-4 mb-2">📅</div>
                      <p className="mb-4 text-gray-600 dark:text-gray-400">
                        {quiz.date}
                      </p>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition">
                        Register
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                data-aos="fade-up"
              >
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-[0_4px_20px_rgba(128,0,255,0.4)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_6px_30px_rgba(128,0,255,0.6)]">
                  <div className="flex items-center text-purple-600 font-bold text-xl mb-2">
                    <FaClipboardList className="mr-2" /> 32
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tests Written
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-[0_4px_20px_rgba(128,0,255,0.4)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_6px_30px_rgba(128,0,255,0.6)]">
                  <div className="flex items-center text-purple-600 font-bold text-xl mb-2">
                    <BsFillBarChartFill className="mr-2" /> 80%
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Overall Average
                  </p>
                </div>
              </section>
            </div>

            {/* Leaderboard */}
            <div className="space-y-4" data-aos="fade-left">
              <h3 className="text-xl font-semibold">Leaderboard</h3>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 space-y-4 overflow-y-auto max-h-[600px] shadow-[0_4px_20px_rgba(128,0,255,0.4)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_6px_30px_rgba(128,0,255,0.6)]">
                {[
                  {
                    name: "Player 1",
                    color: "bg-red-500",
                    medal: "🥇",
                    text: "text-yellow-500",
                  },
                  {
                    name: "Player 2",
                    color: "bg-blue-500",
                    medal: "🥈",
                    text: "text-gray-400",
                  },
                  {
                    name: "Player 3",
                    color: "bg-yellow-500",
                    medal: "🥉",
                    text: "text-yellow-800",
                  },
                  {
                    name: "Player 4",
                    color: "bg-green-500",
                    medal: "🎖️",
                    text: "text-green-500",
                  },
                  {
                    name: "Player 5",
                    color: "bg-purple-500",
                    medal: "🎖️",
                    text: "text-purple-500",
                  },
                  {
                    name: "Player 6",
                    color: "bg-pink-500",
                    medal: "🎖️",
                    text: "text-pink-500",
                  },
                ].map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-600 pb-2 last:border-none"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full h-10 w-10 ${player.color}`}
                      />
                      <div>
                        <h4 className="font-semibold">{player.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                      </div>
                    </div>
                    <div className={`${player.text} text-xl`}>
                      {player.medal}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
