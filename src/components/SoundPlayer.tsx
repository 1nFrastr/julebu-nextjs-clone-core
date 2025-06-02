"use client";

import { useCallback } from "react";

// 模拟TTS服务,实际项目中应该使用真实的TTS服务
export const mockSpeak = (text: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }
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
