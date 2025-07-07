import React from "react";
import SoundBoard from "../components/SoundBoard";
import Lead from "../components/Lead";

const page = () => {
  return (
    <main className="min-h-screen  dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
        {/* SoundBoard Section */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full">
            <SoundBoard />
          </div>
        </div>

        {/* Lead Section */}
        <div className="lg:w-1/3 w-full">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full">
            <Lead />
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
