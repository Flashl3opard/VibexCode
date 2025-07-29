// /components/SuccessModal.tsx
import React from "react";

interface SuccessModalProps {
  onClose: () => void;
  line?: string;
  gifUrl?: string;
}

const defaultMotivation = [
  "Fantastic job! 🚀 You did it!",
  "Woohoo! Challenge completed! 🎉",
  "Keep going, coder! You’re making magic! ✨",
  "Impressive work! On to the next one! 🏆",
];

const defaultGifs = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // yay
  "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif", // dancing happy
  "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif", // clapping
  "https://media.giphy.com/media/LHZyixOnHwDDy/giphy.gif", // party
];

const SuccessModal: React.FC<SuccessModalProps> = ({
  onClose,
  line,
  gifUrl,
}) => {
  // Randomly pick if not provided
  const randomMotivation =
    line ||
    defaultMotivation[Math.floor(Math.random() * defaultMotivation.length)];
  const randomGif =
    gifUrl || defaultGifs[Math.floor(Math.random() * defaultGifs.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 flex flex-col items-center relative max-w-[90vw] w-[380px]">
        <button
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 dark:hover:text-white"
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={randomGif}
          alt="Celebration"
          className="mb-4 rounded-lg w-48 h-48 object-cover shadow-lg"
          style={{ animation: "pop 0.8s" }}
        />
        <h2 className="text-2xl font-bold text-center mb-3 text-green-700 dark:text-green-300 animate-bounce">
          {randomMotivation}
        </h2>
        <p className="text-gray-700 dark:text-gray-200 text-center">
          Keep up the great work!
        </p>
        <style>{`
          @keyframes pop {
            0% { transform: scale(0.4); opacity: 0.2; }
            70% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SuccessModal;
