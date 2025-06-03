"use client";

import Game from "@/components/Game";
import { sampleWords } from "@/data/words";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-3xl">
        <h1 className="bg-linear-to-r mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-bold text-transparent">
          AI超级单词表
        </h1>
        <p className="mb-4 text-center text-sm text-gray-500">请输入英文单词或按下空格键显示答案</p>
        <Game words={sampleWords} />
      </div>
    </main>
  );
}
