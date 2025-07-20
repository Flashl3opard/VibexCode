"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";

const faqs = [
  {
    question: "What is VibeXCode?",
    answer:
      "VibeXCode is a modern platform where developers can collaborate, share, and create projects together with ease.",
  },
  {
    question: "Is VibeXCode free to use?",
    answer:
      "Yes! VibeXCode offers free access to its basic features. Advanced tools might require a premium plan in the future.",
  },
  {
    question: "How do I report a bug or issue?",
    answer:
      "You can report bugs using the 'Contact Us' page or by opening an issue on our GitHub repository.",
  },
  {
    question: "Can I contribute to VibeXCode?",
    answer:
      "Absolutely! VibeXCode is open to contributions. Check out our GitHub to view open issues and guidelines.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen dark:bg-[#020612] text-gray-800 dark:text-gray-100 px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12">FAQs</h1>
          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-all duration-500 ease-in-out border-gray-300 dark:border-gray-700 ${
                    isOpen
                      ? "shadow-lg dark:shadow-[0_0_20px_#60a5fa]"
                      : "shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-8 py-6 text-lg font-semibold flex justify-between items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {faq.question}
                    <span className="text-2xl">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "max-h-[500px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95"
                    } overflow-hidden px-8 py-4 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 text-base`}
                  >
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
