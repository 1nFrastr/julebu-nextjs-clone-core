"use client";

import { Word } from "@/types/word";
import { useEffect, useState } from "react";

interface WordListProps {
  words: Word[];
  currentIndex: number;
  onWordClick?: (index: number) => void;
}

export default function WordList({ words, currentIndex, onWordClick }: WordListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 更新主内容区域的边距
  useEffect(() => {
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (mainContent) {
      mainContent.style.marginLeft = isCollapsed ? '48px' : '320px';
    }
  }, [isCollapsed]);

  return (
    <div className={`fixed left-0 top-0 z-50 h-full bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? "w-12" : "w-80"
    }`}>
      {/* 收起/展开按钮 */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-2 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
        title={isCollapsed ? "展开词库列表" : "收起词库列表"}
      >
        {isCollapsed ? "→" : "←"}
      </button>

      {/* 侧边栏内容 */}
      <div className={`h-full overflow-hidden ${isCollapsed ? "w-0" : "w-full"}`}>
        <div className="flex h-full flex-col border-r-2 border-red-500 p-4">
          <div className="mb-4 pr-8">
            <h3 className="text-lg font-bold text-red-600">词库列表</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {words.map((word, index) => (
                <div
                  key={`${word.english}-${index}`}
                  className={`flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm transition-colors ${
                    index === currentIndex
                      ? "bg-red-100 text-red-700"
                      : index < currentIndex
                      ? "bg-green-50 text-green-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => onWordClick?.(index)}
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-medium truncate">{word.english}</span>
                    <span className="text-gray-500 flex-shrink-0">-</span>
                    <span className="text-gray-700 truncate">{word.chinese}</span>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2">
                    {index < currentIndex && (
                      <span className="text-xs text-green-500">✓</span>
                    )}
                    {index === currentIndex && (
                      <span className="text-xs text-red-500">●</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 border-t pt-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>总计: {words.length}</span>
              <span>已完成: {currentIndex}</span>
            </div>
            <div className="mt-1">
              <div className="h-1 w-full rounded bg-gray-200">
                <div
                  className="h-1 rounded bg-red-500 transition-all duration-300"
                  style={{
                    width: `${words.length > 0 ? (currentIndex / words.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 收起状态下的小指示器 */}
      {isCollapsed && (
        <div className="mt-16 flex flex-col items-center space-y-2 px-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap mt-4">
            {currentIndex + 1}/{words.length}
          </div>
        </div>
      )}
    </div>
  );
}
