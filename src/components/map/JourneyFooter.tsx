"use client";

import { Memory } from "@/types/memory";

interface IProps {
  memories: Memory[];
}

export default function JourneyFooter({ memories }: IProps) {
  const unlockedCount = memories.filter((m) => m.unlocked).length;
  const totalCount = memories.length;
  const progressPercent =
    totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <footer className="fixed bottom-8 left-1/2 z-20 w-80 -translate-x-1/2 rounded-full bg-white/80 p-4 shadow-xl backdrop-blur">
      <div className="mb-2 flex justify-between text-sm font-medium text-gray-700">
        <span>Journey Progress</span>
        <span>
          {unlockedCount} / {totalCount}
        </span>
      </div>

      <div className="h-3 rounded-full bg-gray200 overflow-hidden">
        <div
          className="h-3 rounded-full bg-pink400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </footer>
  );
}

{
  /* <footer className="fixed bottom-8 left-1/2 z-20 w-80 -translate-x-1/2 rounded-full bg-white/80 p-4 shadow-xl backdrop-blur">
  <div className="mb-2 flex justify-between text-sm">
    <span>Journey Progress</span>
    <span>
      {memories.filter((m) => m.unlocked).length} / {memories.length}
    </span>
  </div>

  <div className="h-3 rounded-full bg-gray200">
    <div
      className="h-3 rounded-full bg-pink400"
      style={{
        width: `${(memories.filter((m) => m.unlocked).length / memories.length) * 100}%`,
      }}
    />
  </div>
</footer>; */
}
