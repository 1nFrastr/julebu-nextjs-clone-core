"use client";

import { useEffect, useState } from "react";

interface GamePauseModalProps {
  onClose: () => void;
}

export default function GamePauseModal({ onClose }: GamePauseModalProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const messages = [
      "别忘了回来继续练习哦，我在等着你呢！",
      "休息一下没关系，但别让我等太久！",
      "快点回来吧，你的英语能力正在蓄势待发！",
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">🛑游戏暂停</h2>
        <p className="mb-8 text-base text-gray-600">{message}</p>
        <div className="flex w-full justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            继续游戏
          </button>
        </div>
      </div>
    </div>
  );
}
