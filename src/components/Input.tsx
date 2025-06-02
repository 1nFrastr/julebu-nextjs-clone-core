"use client";

import { useTypingSound } from "@/hooks/useTypingSound";
import { Word } from "@/types/word";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";

interface InputProps {
  word: Word;
  onCorrect: () => void;
  onWrong?: () => void;
}

interface WordPart {
  text: string;
  isActive: boolean;
  userInput: string;
  incorrect: boolean;
  start: number;
  end: number;
  id: number;
}

export default function Input({ word, onCorrect, onWrong }: InputProps) {
  const [inputValue, setInputValue] = useState("");
  const [wordParts, setWordParts] = useState<WordPart[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkPlayTypingSound } = useTypingSound();

  // 初始化单词分割
  useEffect(() => {
    const parts = word.english.split(" ").map((text, id) => ({
      text,
      isActive: id === 0,
      userInput: "",
      incorrect: false,
      start: 0,
      end: 0,
      id,
    }));

    // Calculate start and end positions
    let position = 0;
    parts.forEach((part) => {
      part.start = position;
      part.end = position + part.text.length;
      position += part.text.length + 1; // +1 for space
    });

    setWordParts(parts);
    setInputValue("");
  }, [word]);

  // 输入值变化时更新各部分状态
  useEffect(() => {
    const inputs = inputValue.split(" ");
    const newParts = [...wordParts];

    inputs.forEach((input, index) => {
      if (newParts[index]) {
        newParts[index].userInput = input;
      }
    });

    // Update active part based on cursor position
    const cursorPosition = inputRef.current?.selectionStart || 0;
    newParts.forEach((part) => {
      part.isActive = cursorPosition >= part.start && cursorPosition <= part.end;
    });

    setWordParts(newParts);
  }, [inputValue]);

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Play typing sound for regular input
    checkPlayTypingSound(e);

    // Prevent cursor movement
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      return;
    }

    // Submit answer
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  };

  // 检查答案
  const checkAnswer = () => {
    const userAnswer = inputValue.trim();
    const correctAnswer = word.english.trim();

    if (userAnswer === correctAnswer) {
      onCorrect();
    } else {
      markIncorrectWords();
      onWrong?.();
    }
  };

  // 标记错误的单词
  const markIncorrectWords = () => {
    const newParts = [...wordParts];
    newParts.forEach((part) => {
      part.incorrect = part.userInput !== part.text;
    });
    setWordParts(newParts);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap justify-center gap-2 text-5xl">
        {wordParts.map((part) => (
          <div
            key={part.id}
            className={`min-w-[4ch] border-b-2 transition-all ${
              part.isActive && !part.incorrect
                ? "animate-pulse border-fuchsia-500 text-fuchsia-500"
                : part.incorrect
                  ? "animate-shake border-red-500 text-red-500"
                  : "border-gray-300 text-gray-500"
            }`}
          >
            {part.userInput}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        className="absolute inset-0 opacity-0"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
}
