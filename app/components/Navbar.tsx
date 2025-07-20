"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { login, logout as logoutAction } from "../store/authSlice";
import authservice from "../appwrite/auth";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";

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
  const [showNotif, setShowNotif] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const authState = useSelector((state: RootState) => state.auth);
  const isLoggedIn = authState.status;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await authservice.checkUser();
        if (userData) {
          dispatch(login({ status: true, userData }));
        } else {
          dispatch(login({ status: false, userData: null }));
        }
      } catch (error) {
        console.error("Error checking user:", error);
        dispatch(login({ status: false, userData: null }));
      }
    };

    if (!isLoggedIn) {
      checkUser();
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const stored = localStorage.getItem("poll-viewed");
    setHasUnread(stored !== "true");
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === "/comm") {
        localStorage.setItem("poll-viewed", "true");
        setHasUnread(false);
      }
    };
    handleRouteChange();
  }, []);

  const handleVibeClick = () => {
    setMenuOpen(false);
    router.push("/playground");
  };

  const handleMobileNavClick = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      dispatch(logoutAction());
      const auth = getAuth(app);
      await signOut(auth);
      await authservice.logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  const navItems = ["Practice", "Explore", "Dashboard", "Community"];

  return (
    <nav className="w-full py-4 px-6 md:px-8 relative z-30 bg-transparent dark:bg-[#020612] transition-all">
      <div className="flex items-center justify-between">
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

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
          </motion.div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${
                  item === "Practice"
                    ? "playground"
                    : item === "Dashboard"
                    ? "Dashboard"
                    : item === "Explore"
                    ? "Explore"
                    : item.toLowerCase()
                }`}
                className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3">
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

          {/* Notification */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotif(!showNotif);
                localStorage.setItem("poll-viewed", "true");
                setHasUnread(false);
              }}
              className="relative text-gray-800 dark:text-white"
            >
              {hasUnread && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  1
                </span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 shadow-xl rounded-lg p-4 text-sm z-50"
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    📢 New Poll: &quot;Topic for first test&quot;
                  </p>

                  <button
                    className="mt-2 text-blue-600 hover:underline dark:text-blue-400"
                    onClick={() => router.push("/comm")}
                  >
                    View Poll
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Overlay */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-full left-0 w-full md:hidden bg-white dark:bg-zinc-900 rounded-b-xl p-6 shadow-xl z-30 space-y-4"
          >
            {navItems.map((item, i) => (
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
                      item === "Practice"
                        ? "/playground"
                        : item === "Dashboard"
                        ? "/Dashboard"
                        : item === "Explore"
                        ? "/Explore"
                        : `/${item.toLowerCase()}`
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
