"use client";

import Game from "@/components/Game";
import { sampleWords } from "@/data/words";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold">英语单词打字游戏</h1>
        <p className="mb-4 text-center text-sm text-gray-500">请输入英文单词或按下空格键显示答案</p>
        <Game words={sampleWords} />
      </div>
    </main>
  );
}
