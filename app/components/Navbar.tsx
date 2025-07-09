"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const menuItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05 },
  }),
};

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleVibeClick = () => {
    setMenuOpen(false); // close menu on mobile
    router.push("/playground");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const handleMobileNavClick = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <nav className="w-full py-4 px-6 md:px-8 relative z-30 bg-transparent dark:bg-[#020612] transition-all">
      <div className="flex items-center justify-between">
        {/* Left Section: Logo + Menu Toggle */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden text-3xl text-purple-600 dark:text-teal-300 focus:outline-none cursor-pointer"
          >
            <motion.span
              initial={false}
              animate={{ rotate: menuOpen ? 45 : 0 }}
              className="block"
            >
              {menuOpen ? "✕" : "☰"}
            </motion.span>
          </motion.button>

          {/* Logo with entrance animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
          </motion.div>
        </div>

        {/* Middle Nav Links (Desktop Only) */}
        <div className="hidden md:flex items-center gap-6">
          {["Practice", "Explore", "Dashboard"].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${item === "Practice" ? "playground" : item}`}
                className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Auth Buttons (Desktop) */}
          <div className="hidden min-[500px]:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/Profile"
                  className="text-purple-600 dark:text-teal-300 font-medium hover:underline cursor-pointer"
                >
                  Profile
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="text-red-500 hover:underline font-medium cursor-pointer"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-purple-600 dark:text-teal-300 font-medium hover:underline cursor-pointer"
                >
                  Log In
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all text-sm cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVibeClick}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              Start Vibing
            </motion.button>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* BACKDROP OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-full left-0 w-full md:hidden bg-white dark:bg-zinc-900 rounded-b-xl p-6 shadow-xl z-30 space-y-4"
          >
            {["Practice", "Explore", "Dashboard"].map((item, i) => (
              <motion.li
                key={item}
                custom={i}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <button
                  onClick={() =>
                    handleMobileNavClick(
                      `/${item === "Practice" ? "playground" : item}`
                    )
                  }
                  className="text-left w-full text-gray-800 dark:text-white text-base font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                >
                  {item}
                </button>
              </motion.li>
            ))}

            <motion.li
              custom={3}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="pt-2 border-t border-zinc-300 dark:border-zinc-700"
            >
              <div className="flex flex-col gap-4 mt-3">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleMobileNavClick("/Profile")}
                      className="text-purple-600 dark:text-teal-300 font-medium hover:underline"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleMobileNavClick("/login")}
                      className="text-purple-600 dark:text-teal-300 font-medium hover:underline"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => handleMobileNavClick("/signup")}
                      className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all text-sm"
                    >
                      Sign Up
                    </button>
                  </>
                )}
                <button
                  onClick={handleVibeClick}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition-all duration-300"
                >
                  Start Vibing
                </button>
              </div>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
