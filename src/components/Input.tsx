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

  // 自动聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    // 每次单词变更时重新聚焦
    inputRef.current?.focus();
  }, [word]);

  // 输入值变化时更新各部分状态
  useEffect(() => {
    if (!wordParts.length) return; // 确保wordParts已初始化

    const inputs = inputValue.split(" ");
    const newParts = [...wordParts];

    // 更新每个部分的用户输入
    newParts.forEach((part, index) => {
      // 如果没有输入，确保userInput为空字符串而不是undefined
      part.userInput = inputs[index] || "";
    });

    // Update active part based on cursor position
    const cursorPosition = inputRef.current?.selectionStart || 0;
    newParts.forEach((part) => {
      part.isActive = cursorPosition >= part.start && cursorPosition <= part.end;
    });

    setWordParts(newParts);
  }, [inputValue, wordParts.length]);

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
      // 延迟后重置错误状态
      setTimeout(() => {
        setInputValue(""); // 清空输入框
        const resetParts = [...wordParts];
        resetParts.forEach((part) => {
          part.incorrect = false;
        });
        setWordParts(resetParts);
      }, 580);
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
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="flex min-h-[120px] items-center justify-center">
        <div className="pointer-events-none flex flex-wrap justify-center gap-4 text-5xl">
          {wordParts.map((part) => (
            <div
              key={part.id}
              className={`relative flex min-h-[60px] min-w-[4ch] items-center border-b-4 px-2 transition-all ${
                part.isActive && !part.incorrect
                  ? "border-fuchsia-500 text-fuchsia-500"
                  : part.incorrect
                    ? "border-red-500 text-red-500"
                    : "border-gray-300 text-gray-500"
              }`}
            >
              <span className="block min-w-[1ch]">{part.userInput || "\u00A0"}</span>
            </div>
          ))}
        </div>
      </div>
      <input
        ref={inputRef}
        className="absolute inset-0 z-10 block h-full w-full cursor-text bg-transparent text-center text-5xl text-transparent caret-fuchsia-500 outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
}
