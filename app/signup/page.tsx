import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const page = () => {
  return (
    
    <div className="min-h-screen flex items-center justify-center ">
      {/* <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden"> */}
        
        {/* Left Section  */}
        <div className="scale-100 relative hidden md:block h-183 ">
          <img src="/assets/guy1.png" alt="Student" className="h-full object-cover" />

        </div>

        {/*  Form */}
        <div className="w-full md:w-1/4 p-10 bg-amber-50 border-0 rounded-xl m-20">
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-semibold text-purple-600">VIBE <span className="text-gray-700">x</span><span className="text-purple-700"> CODE</span></div>
            <div className="flex gap-4 text-sm text-gray-600 hidden md:flex">
              {/* <a href="#" className="hover:text-purple-500">Practice</a>
              <a href="#" className="hover:text-purple-500">Explore</a> */}
              <a href="#" className="text-purple-300 m-1">Log In</a>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-full">Sign Up</button>
            </div>
          </div>

          <form>
            <input
              type="email"
              placeholder="Mail Id"
              className="w-full border border-purple-300 rounded-md p-3 mb-4 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md p-3 mb-4 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full mb-3 font-semibold"
            >
              Log In
            </button>
          </form>

          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Forget Password?</span>
            <a href="#" className="text-purple-600 font-medium">Sign Up</a>
          </div>

          <div className="text-center text-sm text-gray-500 mb-3">Or you can signup with</div>
          <div className="flex justify-center gap-10">
            <FcGoogle className="scale-200 cursor-pointer" />
            <FaGithub className="scale-200 cursor-pointer"/>
            <FaFacebook className="scale-200 text-blue-500 cursor-pointer"/>
            

          </div>

          <p className="mt-6 text-[10px] text-center text-gray-400">
            This site is protected by reCAPTCHA and the Google 
            <a href="#" className="text-purple-500"> Privacy Policy </a> and 
            <a href="#" className="text-purple-500"> Terms of Service </a> apply.
          </p>
        </div>
      
    </div>
  
  );
};

export default page;
