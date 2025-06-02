"use client";

import { Word } from "@/types/word";
import { useEffect, useState } from "react";
import useSound from "use-sound";

import Answer from "./Answer";
import GamePauseModal from "./GamePauseModal";
import Input from "./Input";

interface GameProps {
  words: Word[];
}

export default function Game({ words }: GameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playCorrect] = useSound("/sounds/right.mp3");
  const [playWrong] = useSound("/sounds/error.mp3");

  // Initialize first word
  useEffect(() => {
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
    }
  }, [words]);

  // Handle pause shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" && e.altKey) {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCorrect = () => {
    playCorrect();
    setTimeout(() => {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
      setIsAnswerVisible(false);
    }, 500);
  };

  const handleWrong = () => {
    playWrong();
  };

  const handleShowAnswer = () => {
    setIsAnswerVisible(true);
  };

  const handleNextWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setIsAnswerVisible(false);
  };

  if (!currentWord) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center text-2xl text-gray-600">{currentWord.chinese}</div>

      {isAnswerVisible ? (
        <Answer
          word={currentWord}
          onNextWord={handleNextWord}
          onPlayAgain={() => setIsAnswerVisible(false)}
        />
      ) : (
        <Input
          word={currentWord}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleShowAnswer}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          显示答案
        </button>
        <button
          onClick={() => setIsPaused(true)}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          暂停 (Alt+P)
        </button>
      </div>

      {isPaused && <GamePauseModal onClose={() => setIsPaused(false)} />}
    </div>
  );
}
