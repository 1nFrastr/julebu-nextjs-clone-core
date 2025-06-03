"use client";

import { sampleWords } from "@/data/words";
import { generateWordList } from "@/services/openai";
import { Word } from "@/types/word";
import { useEffect, useState } from "react";

interface DictionarySelectorProps {
  onSelect: (words: Word[]) => void;
}

export default function DictionarySelector({ onSelect }: DictionarySelectorProps) {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"custom" | "local">("custom");
  const [previewWords, setPreviewWords] = useState<Word[]>([]);
  const [generatedWords, setGeneratedWords] = useState<Word[]>([]);

  // 初始化预览单词
  useEffect(() => {
    // 打乱所有单词的顺序并选择9个用于预览
    const shuffledWords = [...sampleWords].sort(() => Math.random() - 0.5).slice(0, 9);
    setPreviewWords(shuffledWords);
  }, []);

  const handleLocalDictionary = () => {
    onSelect(sampleWords);
  };

  const handleCustomGenerate = async () => {
    if (!topic) {
      setError("请输入主题");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await generateWordList(topic, wordCount);
      setGeneratedWords(result.words);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成词库失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomDictionary = () => {
    if (generatedWords.length > 0) {
      onSelect(generatedWords);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleCustomGenerate();
    }
  };

  const suggestedTopics = ["预约酒店", "订机票", "星巴克点单", "去面试跨境电商职位", "去超市购物"];

  const renderWordGrid = (words: Word[]) => {
    const displayWords = words.slice(0, 8); // 显示8个单词
    const totalCount = activeTab === "custom" ? wordCount : sampleWords.length;
    const remainingCount = Math.max(0, totalCount - 8);

    return (
      <div className="grid grid-cols-3 gap-3">
        {displayWords.map((word, index) => (
          <div
            key={`${word.english}-${index}`}
            className="relative flex flex-col items-center space-y-1 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3"
            style={{
              animation: `breathe ${2 + (index % 3) * 0.5}s ease-in-out infinite`,
            }}
          >
            <span className="text-lg font-medium text-blue-300">{word.english}</span>
            <span className="text-sm text-gray-400">{word.chinese}</span>
            <div
              className="absolute inset-0 rounded-lg bg-blue-400/5"
              style={{
                animation: `glow ${3 + (index % 3) * 0.7}s ease-in-out infinite`,
                animationDelay: `${(index % 3) * 0.5}s`,
              }}
            />
          </div>
        ))}
        {words.length > 8 && (
          <div
            className="relative flex flex-col items-center justify-center space-y-1 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3"
            style={{
              animation: `breathe ${2 + 2 * 0.5}s ease-in-out infinite`,
            }}
          >
            <span className="text-center text-sm font-medium text-blue-300">
              +<span className="mx-1">{remainingCount}</span>
              words ...
            </span>
            <div
              className="absolute inset-0 rounded-lg bg-blue-400/5"
              style={{
                animation: `glow ${3 + 2 * 0.7}s ease-in-out infinite`,
                animationDelay: `1s`,
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={() => setActiveTab("custom")}
          className={`rounded-lg px-6 py-2 text-lg transition ${
            activeTab === "custom"
              ? "border-2 border-blue-500/50 bg-blue-500/20 text-blue-400"
              : "border-2 border-transparent text-gray-400 hover:text-blue-400"
          }`}
        >
          自定义场景
        </button>
        <button
          onClick={() => setActiveTab("local")}
          className={`rounded-lg px-6 py-2 text-lg transition ${
            activeTab === "local"
              ? "border-2 border-blue-500/50 bg-blue-500/20 text-blue-400"
              : "border-2 border-transparent text-gray-400 hover:text-blue-400"
          }`}
        >
          本地词库
        </button>
      </div>

      <div className="mb-8">
        {activeTab === "custom" ? (
          <div className="space-y-6">
            {!generatedWords.length ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    value={topic}
                    disabled={isLoading}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="请输入你想练习的场景"
                    className="w-full rounded-lg border-2 border-blue-500/30 bg-blue-500/5 px-4 py-3 text-lg text-gray-900 placeholder-gray-500 transition focus:border-blue-400 focus:outline-none dark:text-gray-100"
                  />
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {suggestedTopics.map((suggestedTopic) => (
                      <button
                        key={suggestedTopic}
                        onClick={() => setTopic(suggestedTopic)}
                        className="rounded-full border-2 border-blue-500/20 px-4 py-1.5 text-sm text-blue-400 transition hover:bg-blue-500/10"
                      >
                        {suggestedTopic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <label className="text-sm text-gray-300">生成数量: {wordCount}</label>
                  <div className="relative w-full max-w-md">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={wordCount}
                      onChange={(e) => setWordCount(parseInt(e.target.value))}
                      className="w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-blue-500/20 [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:transition hover:[&::-webkit-slider-thumb]:bg-blue-300"
                    />
                    <div className="mt-1 flex justify-between px-1 text-xs text-gray-500">
                      <span>5</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative overflow-hidden rounded-lg border-2 border-blue-500/30 bg-blue-500/5 p-6">
                <div className="relative z-10 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-blue-400">生成词库预览</h3>
                    <p className="mt-2 text-sm text-gray-400">主题：{topic}</p>
                  </div>

                  {renderWordGrid(generatedWords)}

                  <div className="flex justify-center">
                    <button
                      onClick={() => setGeneratedWords([])}
                      className="rounded-lg border-2 border-blue-500/20 px-4 py-2 text-sm text-blue-400 transition hover:bg-blue-500/10"
                    >
                      重新生成
                    </button>
                  </div>
                </div>

                <style jsx>{`
                  @keyframes breathe {
                    0%,
                    100% {
                      transform: scale(1);
                    }
                    50% {
                      transform: scale(1.05);
                    }
                  }
                  @keyframes glow {
                    0%,
                    100% {
                      opacity: 0;
                    }
                    50% {
                      opacity: 1;
                    }
                  }
                `}</style>

                <div className="absolute left-0 top-0 h-full w-1/2 animate-[pulse_4s_infinite] bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg border-2 border-blue-500/30 bg-blue-500/5 p-6">
            <div className="relative z-10 space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-medium text-blue-400">本地词库预览</h3>
                <p className="mt-2 text-sm text-gray-400">包含基础常用词汇，适合日常学习</p>
              </div>

              {renderWordGrid(previewWords)}
            </div>

            <style jsx>{`
              @keyframes breathe {
                0%,
                100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
              }
              @keyframes glow {
                0%,
                100% {
                  opacity: 0;
                }
                50% {
                  opacity: 1;
                }
              }
            `}</style>

            <div className="absolute left-0 top-0 h-full w-1/2 animate-[pulse_4s_infinite] bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
          </div>
        )}
      </div>

      {/* 底部按钮区域 */}
      <div className="text-center">
        {activeTab === "custom" && !generatedWords.length ? (
          <button
            onClick={handleCustomGenerate}
            disabled={isLoading || !topic}
            className="w-full max-w-md rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-xl text-white transition hover:from-blue-600 hover:to-blue-700 disabled:from-blue-800 disabled:to-blue-900 disabled:text-blue-100/50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span>生成词库中</span>
                <div className="flex space-x-0.5">
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            ) : (
              "生成词库"
            )}
          </button>
        ) : (
          (activeTab === "local" || (activeTab === "custom" && generatedWords.length > 0)) && (
            <button
              onClick={activeTab === "custom" ? handleCustomDictionary : handleLocalDictionary}
              className="w-full max-w-md rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-xl text-white transition hover:from-blue-600 hover:to-blue-700"
            >
              开始练习
            </button>
          )
        )}
        {error && <p className="mt-2 text-sm text-blue-400">{error}</p>}
      </div>
    </div>
  );
}
