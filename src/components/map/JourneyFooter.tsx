"use client";

import { Memory } from "@/types/memory";

interface IProps {
  memories: Memory[];
}

export default function JourneyFooter({ memories }: IProps) {
  const completedCount = memories.filter((m) => m.isCompleted).length;
  const totalCount = memories.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <footer className="fixed bottom-8 left-1/2 z-20 w-80 -translate-x-1/2 rounded-full bg-white/80 p-4 shadow-xl backdrop-blur">
      <div className="mb-2 flex justify-between text-sm font-medium text-gray-700">
        <span className="flex items-center gap-1.5">
          <span>{isCompleted ? "💖" : "🗝️"}</span>
          <span>
            {isCompleted ? "우리의 기억 수집 완료!" : "함께한 기억 수집 중"}
          </span>
        </span>
        <span className="font-bold text-pink-500">
          {completedCount} / {totalCount}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-pink-100">
        <div
          className="h-full rounded-full bg-pink-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </footer>
  );
}
