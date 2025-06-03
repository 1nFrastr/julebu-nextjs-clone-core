"use client";

import { sampleWords } from "@/data/words";
import { generateWordList } from "@/services/openai";
import { Word } from "@/types/word";
import { useState } from "react";

interface DictionarySelectorProps {
  onSelect: (words: Word[]) => void;
}

export default function DictionarySelector({ onSelect }: DictionarySelectorProps) {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLocalDictionary = () => {
    onSelect(sampleWords);
  };

  const handleCustomDictionary = async () => {
    if (!topic) {
      setError("请输入主题");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await generateWordList(topic, wordCount);
      onSelect(result.words);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成词库失败");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedTopics = ["商务会议", "旅游度假", "医疗就诊", "学术写作", "面试求职", "购物消费"];

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="mb-8 text-3xl font-bold text-gray-700">选择词库</h1>

      <div className="mb-8">
        <button
          onClick={handleLocalDictionary}
          className="relative w-full overflow-hidden rounded-lg bg-gray-100 px-8 py-4 text-xl text-gray-700 transition hover:bg-gray-200"
        >
          使用本地词库
          <p className="mt-2 text-sm text-gray-500">包含基础常用词汇</p>
        </button>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-700">或者生成自定义词库</h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="请输入你想学习的情景"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {suggestedTopics.map((suggestedTopic) => (
                <button
                  key={suggestedTopic}
                  onClick={() => setTopic(suggestedTopic)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-200"
                >
                  {suggestedTopic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <label className="text-sm text-gray-600">单词数量: {wordCount}</label>
            <div className="relative w-full">
              <input
                type="range"
                min="5"
                max="50"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:transition hover:[&::-webkit-slider-thumb]:bg-blue-600"
              />
              <div className="mt-1 flex justify-between px-1 text-xs text-gray-400">
                <span>5</span>
                <span>50</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCustomDictionary}
            disabled={isLoading}
            className="relative w-full overflow-hidden rounded-lg bg-blue-500 px-8 py-3 text-xl text-white transition hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <span className="relative z-10">生成中...</span>
                <div className="absolute left-0 top-0 h-full w-1/3 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </>
            ) : (
              "生成自定义词库"
            )}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
