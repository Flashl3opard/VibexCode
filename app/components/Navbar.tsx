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
import { CgProfile } from "react-icons/cg";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleVibeClick = () => {
    setMenuOpen(false);
    setShowProfileMenu(false);
    router.push("playground?id=6884bb87f1b587e466becd87");
  };

  const handleMobileNavClick = (path: string) => {
    setMenuOpen(false);
    setShowProfileMenu(false);
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

  const navItems = ["Problems", "Explore", "Dashboard", "Community"];

  return (
    <nav className="w-full py-4 px-6 md:px-8 relative z-30 bg-transparent dark:bg-[#020612] transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden text-3xl text-purple-600 dark:text-teal-300 focus:outline-none cursor-pointer2"
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

        {/* Main navigation items (desktop) */}
        <div className="hidden md:flex items-center gap-6 cursor-pointer2">
          {navItems.map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${
                  item === "Problems"
                    ? "problems"
                    : item === "Dashboard"
                    ? "Dashboard"
                    : item === "Explore"
                    ? "Explore"
                    : item === "Community" // Updated this condition
                    ? "Forums"
                    : item.toLowerCase()
                }`}
                className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer2"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 min-w-[110px] justify-end relative ">
          {/* ThemeToggle always first */}
          <ThemeToggle />

          {isLoggedIn ? (
            <>
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
                  className="relative p-2 text-gray-800 dark:text-white"
                  aria-label="Notification"
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

              {/* Profile Button and Popup */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu((v) => !v)}
                  className="p-2 rounded-full focus:outline-none text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  title="Profile"
                  aria-haspopup="menu"
                  aria-expanded={showProfileMenu}
                >
                  <CgProfile className="w-7 h-7" />
                </button>
                {/* Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.17 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 flex flex-col gap-1 z-50"
                    >
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push("/Profile");
                        }}
                        className="py-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white rounded text-left transition"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="py-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-left text-red-500 transition"
                      >
                        Logout
                      </button>
                      <button
                        onClick={handleVibeClick}
                        className="py-2 px-3 mt-1 rounded font-semibold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 text-white shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition"
                      >
                        Start Vibing
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            // LOGGED OUT: Show only Login button
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition-all text-sm"
            >
              Log In
            </motion.button>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
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
                      item === "Problems"
                        ? "/problems"
                        : item === "Dashboard"
                        ? "/Dashboard"
                        : item === "Explore"
                        ? "/Explore"
                        : item === "Community" // Updated here as well
                        ? "/Forums"
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
              <div className="flex flex-col gap-4 mt-3 cursor-pointer2">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleMobileNavClick("/Profile")}
                      className="text-purple-600 dark:text-white text-xl hover:underline scale-90"
                      title="Profile"
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
                      className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all text-sm cursor-pointer2"
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
