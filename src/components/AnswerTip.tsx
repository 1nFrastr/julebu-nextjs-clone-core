"use client";

import { Word } from "@/types/word";

interface AnswerTipProps {
  word: Word;
}

export default function AnswerTip({ word }: AnswerTipProps) {
  const words = word.english.split(" ");

  return (
    <div className="pointer-events-auto absolute -top-24 left-1/2 z-20 w-full -translate-x-1/2 transform">
      <div className="text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-1 text-2xl text-gray-600">
          {words.map((w, index) => (
            <span
              key={index}
              className="cursor-pointer p-1 hover:text-fuchsia-500"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(w);
                utterance.lang = "en-US";
                speechSynthesis.speak(utterance);
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
