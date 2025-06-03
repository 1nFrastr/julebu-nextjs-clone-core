"use client";

import { Word } from "@/types/word";
import { useEffect, useState } from "react";
import useSound from "use-sound";

import AnswerTip from "./AnswerTip";
import CompletionModal from "./CompletionModal";
import DictionarySelector from "./DictionarySelector";
import GamePauseModal from "./GamePauseModal";
import Input from "./Input";
import { mockSpeak } from "./SoundPlayer";

interface GameProps {
  words: Word[];
}

export default function Game({ words: initialWords }: GameProps) {
  const [selectedWords, setSelectedWords] = useState<Word[]>(initialWords);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnswerTipVisible, setIsAnswerTipVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [playCorrect] = useSound("/sounds/right.mp3");
  const [playWrong] = useSound("/sounds/error.mp3");

  // Initialize first word when game starts
  useEffect(() => {
    if (isStarted && selectedWords.length > 0) {
      setCurrentWord(selectedWords[0]);
    }
  }, [selectedWords, isStarted]);

  // 自动播放单词发音
  useEffect(() => {
    if (currentWord?.english) {
      // 当 wordIndex 为 0 或单词变化时播放
      if (wordIndex === 0 || currentWord.english !== selectedWords[wordIndex - 1]?.english) {
        setTimeout(() => {
          mockSpeak(currentWord.english);
        }, 100);
      }
    }
  }, [currentWord?.english, wordIndex, selectedWords]);

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
      if (nextIndex >= selectedWords.length) {
        setIsCompleted(true);
      } else {
        setCurrentWord(selectedWords[nextIndex]);
        setWordIndex(nextIndex);
      }
      setIsAnswerTipVisible(false);
      setWrongCount(0);
    }, 300);
  };

  const handleRestart = () => {
    setWordIndex(0);
    setCurrentWord(selectedWords[0]);
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

  const handleDictionarySelect = (words: Word[]) => {
    // 重置所有状态，确保切换词库时清除之前的状态
    setWordIndex(0);
    setCurrentWord(null);
    setSelectedWords(words);
    setWrongCount(0);
    setIsAnswerTipVisible(false);
    setIsCompleted(false);

    // 最后设置 isStarted，触发游戏开始
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <div>
        <DictionarySelector onSelect={handleDictionarySelect} />
      </div>
    );
  }

  if (!currentWord) {
    return <div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          进度: {wordIndex + 1} / {selectedWords.length}
        </div>
        <button
          onClick={() => setIsStarted(false)}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-300"
        >
          切换词库
        </button>
      </div>

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
          className="rounded-lg bg-gray-300 px-4 py-2 text-xs text-gray-700 hover:bg-gray-300"
        >
          显示答案 (Ctrl+M)
        </button>
        <button
          onClick={() => setIsPaused(true)}
          className="rounded-lg bg-gray-300 px-4 py-2 text-xs text-gray-700 hover:bg-gray-300"
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
