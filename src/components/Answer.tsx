'use client';

import { useEffect } from 'react';
import { Word } from '@/types/word';
import SoundPlayer from './SoundPlayer';

interface AnswerProps {
  word: Word;
  onNextWord: () => void;
  onPlayAgain: () => void;
}

export default function Answer({ word, onNextWord, onPlayAgain }: AnswerProps) {
  const words = word.english.split(" ");

  // 当显示答案时自动播放发音
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }, [word.english]);

  return (
    <div className="text-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-1 text-5xl">
        {words.map((w, index) => (
          <span
            key={index}
            className="cursor-pointer p-1 hover:text-fuchsia-500"
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(w);
              utterance.lang = 'en-US';
              speechSynthesis.speak(utterance);
            }}
          >
            {w}
          </span>
        ))}
        <SoundPlayer text={word.english} />
      </div>
      <div className="my-6 text-xl text-gray-500">
        {word.soundmark}
      </div>
      <div className="my-6 text-xl text-gray-500">
        {word.chinese}
      </div>
      <div className="space-y-3">
        <div>
          <button
            className="rounded-md bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
            onClick={onPlayAgain}
          >
            再来一次
          </button>
          <button
            className="ml-6 rounded-md bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
            onClick={onNextWord}
          >
            下一题
          </button>
        </div>
      </div>
    </div>
  );
}
