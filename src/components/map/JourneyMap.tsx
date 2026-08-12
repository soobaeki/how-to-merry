"use client";

import { useJourneyState } from "@/hooks/useJourneyState";
import { calculateNodePositions, calculatePathD } from "@/libs/utils";
import { Play, RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import JourneyFooter from "./JourneyFooter";
import JourneyHeader from "./JourneyHeader";
import LocationNode from "./LocationNode";

export default function JourneyMap() {
  const router = useRouter();
  // 1. 상태 및 로직을 커스텀 훅으로 완전 분리
  const { memories, completedIds, isAllCompleted, resetJourney } =
    useJourneyState();

  // 2. SVG 곡선 경로 및 높이 계산 (libs/utils.ts 활용)
  const { pathD, containerHeight } = useMemo(
    () => calculatePathD(memories.length),
    [memories.length],
  );

  // 3. 노드 위치 계산 (libs/utils.ts 활용)
  const nodePositions = useMemo(
    () => calculateNodePositions(memories),
    [memories],
  );

  // 🎯 모든 챕터를 완료하면 /proposal 페이지로 자동 이동
  useEffect(() => {
    if (isAllCompleted) {
      const timer = setTimeout(() => {
        router.push("/proposal");
      }, 1000); // 사용자 UX를 위해 완료 축하 액션 후 1초 뒤 이동
      return () => clearTimeout(timer);
    }
  }, [isAllCompleted, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-20 h-24 w-24 rounded-full bg-pink100 blur-3xl" />
        <div className="absolute right-10 top-60 h-32 w-32 rounded-full bg-orange100 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-28 w-28 rounded-full bg-yellow100 blur-3xl" />
      </div>

      {/* Reset Button */}
      <button
        onClick={resetJourney}
        aria-label="초기화"
        className="absolute top-4 left-4 z-30 rounded-full p-2 text-gray-400 transition-colors hover:bg-pink-50 hover:text-pink-500"
        title="초기화"
      >
        <RotateCcwIcon className="h-5 w-5 transition-transform duration-200 hover:-rotate-110 cursor-pointer" />
      </button>

      {/* 2. Proposal Video Button */}
      <button
        onClick={() => router.push("/proposal")}
        aria-label="프러포즈 영상 보기"
        className="absolute top-4 left-11 z-30 rounded-full p-2 text-gray-400 transition-colors hover:bg-pink-50 hover:text-pink-500"
        title="프러포즈 영상 보기"
      >
        <Play className="h-5 w-5 fill-current transition-transform duration-200 hover:scale-110 cursor-pointer" />
      </button>

      {/* Header */}
      <JourneyHeader />

      {/* Path & Nodes Section */}
      <section
        className="relative mx-auto max-w-md"
        style={{ width: "380px", height: `${containerHeight}px` }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 380 ${containerHeight}`}
          preserveAspectRatio="none"
        >
          {/* Path */}
          <path
            d={pathD}
            className={
              isAllCompleted
                ? "stroke-pink-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]"
                : "stroke-gray-300"
            }
            fill="none"
            strokeWidth="6"
            strokeDasharray="10 10"
          />
        </svg>

        {/* Nodes */}
        {memories.map((memory) => {
          const pos = nodePositions[memory.id] || { x: 0, y: 0 };
          const isCompleted = completedIds.includes(memory.id);

          return (
            <div
              key={memory.id}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
              }}
              className={
                !memory.unlocked || isCompleted
                  ? "pointer-events-none"
                  : "cursor-pointer"
              }
            >
              <LocationNode memory={memory} isCompleted={isCompleted} />
            </div>
          );
        })}
      </section>

      {/* Progress */}
      {/* Footer Progress Bar */}
      <JourneyFooter memories={memories} />
    </div>
  );
}
