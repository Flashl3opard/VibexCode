import React from "react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">

        {/* Left Section */}
        <div className="flex flex-col items-center justify-center">
          <img
            src="assets/guy.png" // replace with actual image if needed
            alt="Student"
            className="rounded-lg w-full max-w-sm mb-4"
          />
          <div className="flex flex-row gap-10">
          <button className="bg-white px-6 py-2 rounded-full text-purple-600 font-semibold shadow-md ">
            Sign In
          </button>
          <button className="bg-white px-6 py-2 rounded-full text-purple-600 font-semibold shadow-md">
            Home
          </button>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full">
          <h1 className="text-3xl font-bold text-purple-600 mb-6">VIBE x <span className="text-gray-700">Code</span></h1>

          <input
            type="email"
            placeholder="Mail Id"
            className="w-full mb-4 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button className="w-full bg-purple-500 text-white font-bold py-3 rounded-full hover:bg-purple-600 transition">
            Register
          </button>

          <p className="text-center mt-4 text-sm">
            Have an Account? <a href="#" className="text-purple-600 font-semibold">Log In</a>
          </p>

          <div className="mt-6 text-center text-gray-500 text-sm">Or you can Signup with</div>
          <div className="flex justify-center gap-4 mt-4">
            <FaGoogle className="text-2xl text-red-500 cursor-pointer" />
            <FaGithub className="text-2xl text-gray-800 cursor-pointer" />
            <FaFacebook className="text-2xl text-blue-600 cursor-pointer" />
          </div>

          <p className="mt-6 text-[10px] text-center text-gray-400">
            This site is protected by reCAPTCHA and the Google <br />
            <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
}
