"use client";

import { Word } from "@/types/word";
import { useEffect, useState } from "react";
import useSound from "use-sound";

import AnswerTip from "./AnswerTip";
import CompletionModal from "./CompletionModal";
import GamePauseModal from "./GamePauseModal";
import Input from "./Input";
import SoundPlayer, { mockSpeak } from "./SoundPlayer";

interface GameProps {
  words: Word[];
}

export default function Game({ words }: GameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnswerTipVisible, setIsAnswerTipVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [playCorrect] = useSound("/sounds/right.mp3");
  const [playWrong] = useSound("/sounds/error.mp3");

  // Initialize first word
  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[0]);
    }
  }, [words]);

  // 自动播放单词发音
  useEffect(() => {
    if (currentWord?.english) {
      const isNewWord = words.some((w) => w.english === currentWord.english);
      // 只有是新单词时才播放
      if (isNewWord) {
        setTimeout(() => {
          mockSpeak(currentWord.english);
        }, 100);
      }
    }
  }, [currentWord?.english, words]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" && e.altKey) {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.key === "m" && e.ctrlKey) {
        e.preventDefault();
        setIsAnswerTipVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCorrect = () => {
    playCorrect();
    setTimeout(() => {
      const nextIndex = wordIndex + 1;
      if (nextIndex >= words.length) {
        setIsCompleted(true);
      } else {
        setCurrentWord(words[nextIndex]);
        setWordIndex(nextIndex);
      }
      setIsAnswerTipVisible(false);
      setWrongCount(0);
    }, 300);
  };

  const handleRestart = () => {
    setWordIndex(0);
    setCurrentWord(words[0]);
    setIsCompleted(false);
    setWrongCount(0);
    setIsAnswerTipVisible(false);
  };

  const handleWrong = () => {
    playWrong();
    setWrongCount((prev) => {
      if (prev >= 2) {
        // 连续错误三次显示提示
        setIsAnswerTipVisible(true);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleShowAnswer = () => {
    setIsAnswerTipVisible(true);
  };

  if (!currentWord) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center text-2xl text-gray-600">{currentWord.chinese}</div>

      <div className="relative">
        {isAnswerTipVisible && (
          <AnswerTip
            word={currentWord}
            onClose={() => setIsAnswerTipVisible(false)}
          />
        )}
        <Input
          word={currentWord}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleShowAnswer}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          显示答案 (Ctrl+M)
        </button>
        <button
          onClick={() => setIsPaused(true)}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          暂停 (Alt+P)
        </button>
      </div>

      {isPaused && <GamePauseModal onClose={() => setIsPaused(false)} />}
      {isCompleted && (
        <CompletionModal
          onRestart={handleRestart}
          onClose={() => setIsCompleted(false)}
        />
      )}
    </div>
  );
}
