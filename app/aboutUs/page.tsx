"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Image from "next/image";

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  contributions?: number;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}
interface ContributorStats {
  total: number;
  weeks: { a: number; d: number; c: number }[];
  author: {
    login: string;
  };
}

export default function AboutUs() {
  const [contributors, setContributors] = useState<GitHubUser[]>([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchContributors = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/Flashl3opard/VibexCode/contributors"
        );
        const contributorsData = await res.json();

        const statsRes = await fetch(
          "https://api.github.com/repos/Flashl3opard/VibexCode/stats/contributors"
        );
        const statsData = await statsRes.json();

        const contributorsWithStats = await Promise.all(
          contributorsData.map(async (contributor: GitHubUser) => {
            if (Array.isArray(statsData)) {
              const userStats = statsData.find(
                (stat: ContributorStats) =>
                  stat.author.login === contributor.login
              );

              if (userStats) {
                const totalAdditions = userStats.weeks.reduce(
                  (sum: number, week: { a: number; d: number; c: number }) =>
                    sum + week.a,
                  0
                );
                const totalDeletions = userStats.weeks.reduce(
                  (sum: number, week: { a: number; d: number; c: number }) =>
                    sum + week.d,
                  0
                );

                return {
                  ...contributor,
                  stats: {
                    additions: totalAdditions,
                    deletions: totalDeletions,
                    total: totalAdditions + totalDeletions,
                  },
                };
              }
            } else {
              console.warn(
                "Unexpected statsData format for:",
                contributor.login,
                statsData
              );
            }

            return contributor;
          })
        );

        setContributors(contributorsWithStats);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="min-h-screen overflow-auto">
      <Navbar />

      <main className="min-h-screen w-full text-black dark:text-white dark:bg-[#020612] px-8 md:px-24 pb-12 relative overflow-visible pt-8">
        {/* Heading */}
        <motion.div
          className="text-center mt-8 z-20 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-purple-600">Meet</span>{" "}
            <span className="text-gray-900 dark:text-white">Our</span>{" "}
            <span className="text-pink-500">Contributors</span>
          </h1>
          <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            VibeXCode is built by an awesome community of developers.
          </p>
        </motion.div>

        {/* Contributor Cards */}
        <div className="flex flex-wrap justify-center gap-16 mt-16 z-10 relative">
          {contributors.map((user) => (
            <motion.div
              key={user.login}
              className="bg-white dark:bg-[#0e0e2e] rounded-xl p-6 w-64 text-center transition-transform hover:scale-105 duration-300 shadow-[0_4px_20px_rgba(128,0,255,0.2)] dark:shadow-[0_4px_20px_rgba(221,160,221,0.2)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              data-aos="fade-up"
            >
              <Image
                src={user.avatar_url}
                alt={user.login}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500 shadow-lg"
              />
              <h3 className="text-xl font-semibold">
                {user.name || user.login}
              </h3>
              <p className="text-gray-500">@{user.login}</p>

              {/* Contribution stats */}
              {user.stats && (
                <div className="mt-3 text-sm space-y-1">
                  <div className="flex justify-center gap-4">
                    <span className="text-green-500 font-medium">
                      +{user.stats.additions.toLocaleString()}
                    </span>
                    <span className="text-red-500 font-medium">
                      -{user.stats.deletions.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {user.stats.total.toLocaleString()} total lines
                  </p>
                </div>
              )}

              {user.contributions && (
                <p className="text-purple-400 text-sm mt-2">
                  {user.contributions} commits
                </p>
              )}

              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mt-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
                title="View GitHub Profile"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
