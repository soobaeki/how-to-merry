"use client";

import { useJourneyState } from "@/hooks/useJourneyState";
import { calculateNodePositions, calculatePathD } from "@/libs/utils";
import { RotateCcwIcon } from "lucide-react";
import { useMemo } from "react";
import JourneyFooter from "./JourneyFooter";
import JourneyHeader from "./JourneyHeader";
import LocationNode from "./LocationNode";

export default function JourneyMap() {
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
        className="absolute top-4 left-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group z-20"
        title="초기화"
      >
        <RotateCcwIcon className="w-5 h-5 transition-transform group-hover:-rotate-90 duration-200" />
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
