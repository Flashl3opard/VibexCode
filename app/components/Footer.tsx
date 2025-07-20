import React from "react";
import Logo from "./Logo";
import { FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 px-6 py-12 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {/* Logo & Tagline */}
        <div className="space-y-3 text-center md:text-left">
          <Logo />
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            A place to dream, one line at a time.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/aboutUs"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/FAQs"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                FAQs
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Connect With Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaGithub className="text-lg" />
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
              >
                GitHub
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram className="text-lg" />
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-pink-600 dark:hover:text-pink-400"
              >
                Instagram
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaXTwitter className="text-lg" />
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-blue-500 dark:hover:text-blue-300"
              >
                X (Twitter)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-5 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} VibeXCode. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
