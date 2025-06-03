"use client";

import { useCallback } from "react";

// 使用有道词典的在线音频服务
export const mockSpeak = (text: string) => {
  console.log("Playing sound for:", text);
  const audio = new Audio();
  // type=2 美音，type=1 英音
  audio.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
  
  return audio.play().catch(error => {
    console.error("Failed to play audio:", error);
  });
};

interface SoundPlayerProps {
  text: string;
  className?: string;
}

export default function SoundPlayer({ text, className = "" }: SoundPlayerProps) {
  const handlePlay = useCallback(() => {
    mockSpeak(text);
  }, [text]);

  return (
    <button
      onClick={handlePlay}
      className={`ml-1 inline-block h-7 w-7 cursor-pointer text-gray-500 hover:text-fuchsia-500 ${className}`}
      aria-label="播放发音"
    >
      🔊
    </button>
  );
}
