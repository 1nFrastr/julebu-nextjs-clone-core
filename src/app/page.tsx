'use client';

import { useState, useEffect } from 'react';
import { Word } from '@/types/word';
import { sampleWords } from '@/data/words';
import Answer from '@/components/Answer';

export default function Home() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  // 初始化第一个单词
  useEffect(() => {
    const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
    setCurrentWord(randomWord);
  }, []);

  // 注册键盘快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (isAnswerVisible) {
          handleNextWord();
        } else {
          setIsAnswerVisible(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnswerVisible]);

  const handleNextWord = () => {
    const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
    setCurrentWord(randomWord);
    setIsAnswerVisible(false);
  };

  const handlePlayAgain = () => {
    setIsAnswerVisible(false);
  };

  if (!currentWord) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold">英语单词打字游戏</h1>
        <p className="mb-4 text-center text-sm text-gray-500">
          按空格键或回车键显示答案/下一题
        </p>
        
        {!isAnswerVisible ? (
          <div className="text-center">
            <div className="mb-8 text-2xl">
              {currentWord.chinese}
            </div>
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsAnswerVisible(true)}
            >
              显示答案
            </button>
          </div>
        ) : (
          <Answer 
            word={currentWord}
            onNextWord={handleNextWord}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </main>
  );
}
