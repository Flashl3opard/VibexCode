import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <div className="flex items-center text-2xl font-bold cursor-pointer2">
          <span className="text-pink-600">VibeX</span>
          <span className="text-white">Code</span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
