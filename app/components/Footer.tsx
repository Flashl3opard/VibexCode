import React from "react";
import Logo from "./Logo";

const Footer: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white px-4 py-8 h-1/2">
      <div className="max-w mx-auto flex flex-col md:flex-row justify-around items-center">
        <div className="text-center md:text-left">
          <Logo />
          <p className="text-xs italic">A place to dream one line at a time</p>
        </div>
        <div className="flex-col text-sm">
          <h2 className="text-sm text-gray-400 italic py-2 px-auto font-bold">
            Company
          </h2>
          <ul>
            <li>
              <a href="about">About us</a>
            </li>
            <li>
              <a href="projects">Projects</a>
            </li>
            <li>
              <a href="contact">Contact us</a>
            </li>
          </ul>
        </div>
        <div className="flex-col text-sm">
          <h2 className="text-sm font-bold text-gray-400 italic py-2 px-auto">
            Socials
          </h2>
          <ul>
            <li>
              <a href="github">Github</a>
            </li>
            <li>
              <a href="insta">Instagram</a>
            </li>
            <li>
              <a href="twit">X</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
