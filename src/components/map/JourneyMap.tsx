"use client";

import { memories as initialMemories } from "@/data/memories";
import { Memory } from "@/types/memory";
import { motion } from "framer-motion";
import { RotateCcwIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import LocationNode from "./LocationNode";

export default function JourneyMap() {
  const pathRef = useRef<SVGPathElement>(null);

  // 🎯 useState 초기화 함수(Lazy Initialization) 활용
  const [memories, setMemories] = useState<Memory[]>(() => {
    // SSR/빌드 타임 에러 방지
    if (typeof window === "undefined") return initialMemories;

    const savedUnlocked = localStorage.getItem("unlockedChapterIds");
    const unlockedIds: number[] = savedUnlocked
      ? JSON.parse(savedUnlocked)
      : [1]; // 기본 1번 챕터 해제

    return initialMemories.map((memory) => ({
      ...memory,
      unlocked: unlockedIds.includes(memory.id),
    }));
  });

  // 🎯 memories 개수에 따라 SVG d 경로와 컨테이너 높이를 동적으로 계산
  const { pathD, containerHeight } = useMemo(() => {
    const totalNodes = memories.length;
    if (totalNodes === 0) return { pathD: "", containerHeight: 300 };

    const NODE_SPACING_Y = 190; // 노드 사이의 Y축 간격 (조절 가능)
    const START_Y = 60; // 첫 노드 시작 Y 좌표
    const CENTER_X = 190; // 중앙 기준 X 좌표
    const OFFSET_X = 60; // 좌우로 휘어지는 폭 (190 ± 60 => 130 ~ 250)

    let d = `M ${CENTER_X} ${START_Y}`;

    for (let i = 1; i < totalNodes; i++) {
      const prevY = START_Y + (i - 1) * NODE_SPACING_Y;
      const currentY = START_Y + i * NODE_SPACING_Y;

      // 홀수/짝수 번호에 따라 좌/우 방향 변경
      const direction = i % 2 === 1 ? 1 : -1;
      const controlX = CENTER_X + OFFSET_X * direction;
      const targetX = CENTER_X + (OFFSET_X / 2) * direction;

      // Cubic Bezier (C) 곡선 추가
      const cp1Y = prevY + NODE_SPACING_Y * 0.5;
      const cp2Y = currentY - NODE_SPACING_Y * 0.5;

      d += ` C ${controlX} ${cp1Y}, ${targetX} ${cp2Y}, ${CENTER_X} ${currentY}`;
    }

    // 전체 높이는 마지막 노드 Y좌표 + 아래 여백(150px)
    const height = START_Y + (totalNodes - 1) * NODE_SPACING_Y + 150;

    return { pathD: d, containerHeight: height };
  }, [memories.length]);

  // 🎯 memories 배열을 순회하며 각 노드의 (x, y) 좌표를 계산
  const nodePositions = useMemo(() => {
    const NODE_SPACING_Y = 190;
    const START_Y = 60;
    const CENTER_X = 190;
    const OFFSET_X = 60;

    return memories.reduce(
      (acc, memory, index) => {
        const currentY = START_Y + index * NODE_SPACING_Y;

        // 웨이브 패턴에 따른 X 좌표 계산 (인덱스 홀/짝에 따라 좌우 반전)
        let currentX = CENTER_X;
        if (index > 0) {
          const sign = index % 2 !== 0 ? 1 : -1;
          currentX = CENTER_X + (OFFSET_X / 2) * sign; // 또는 경로의 웨이브 X 공식에 맞춤
        }

        acc[memory.id] = { x: currentX, y: currentY };
        return acc;
      },
      {} as Record<string, { x: number; y: number }>,
    );
  }, [memories]);

  // 🧹 초기화 핸들러
  const handleReset = () => {
    // LocalStorage에서 해당 키 삭제
    localStorage.removeItem("unlockedChapterIds");

    // memories 초기화
    setMemories([]);

    // 새로고침
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-20 h-24 w-24 rounded-full bg-pink100 blur-3xl" />

        <div className="absolute right-10 top-60 h-32 w-32 rounded-full bg-orange100 blur-3xl" />

        <div className="absolute bottom-10 left-1/2 h-28 w-28 rounded-full bg-yellow100 blur-3xl" />
      </div>

      {/* 🎯 절대 위치(Absolute)로 왼쪽 상단에 배치한 초기화 버튼 */}
      <button
        onClick={handleReset}
        aria-label="초기화"
        className="absolute top-4 left-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group z-20"
        title="초기화"
      >
        <RotateCcwIcon className="w-5 h-5 transition-transform group-hover:-rotate-90 duration-200" />
      </button>

      {/* Header */}
      <header className="relative z-10 pt-12 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray800"
        >
          OUR JOURNEY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-gray600"
        >
          우리의 추억을 다시 여행해 보자
        </motion.p>
      </header>

      {/* Section */}
      <section
        className="relative mx-auto max-w-md"
        style={{ width: "380px", height: `${containerHeight}px` }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 380 ${containerHeight}"
          preserveAspectRatio="none"
        >
          {/* Path */}
          <path
            ref={pathRef} // ref 연결!
            // d="M190 60 C 240 170 120 250 210 350 S 120 600 210 860"
            d={pathD}
            fill="none"
            stroke="#F9A8D4"
            strokeWidth="6"
            strokeDasharray="10 10"
          />
        </svg>

        {/* Nodes */}
        {memories.map((memory) => {
          const pos = nodePositions[memory.id] || { x: 0, y: 0 };

          return (
            <div
              key={memory.id}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
              }}
            >
              <LocationNode
                memory={memory}
                onClick={() => console.log("퀴즈 오픈:", memory.id)}
              />
            </div>
          );
        })}
      </section>

      {/* Progress */}
      <footer className="fixed bottom-8 left-1/2 z-20 w-80 -translate-x-1/2 rounded-full bg-white/80 p-4 shadow-xl backdrop-blur">
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
      </footer>
    </div>
  );
}

// // 노드별 좌표를 저장하여 렌더링 시 배치에 사용
// const [nodePositions, setNodePositions] = useState<
//   Record<string, { x: number; y: number }>
// >({});
// // SVG 렌더링 직후 경로 좌표를 계산하여 노드 위치 확정
// useLayoutEffect(() => {
//   if (!pathRef.current) return;

//   // 경로 상의 비율(progress)을 실제 픽셀 좌표로 변환
//   const positions = memories.reduce(
//     (acc, memory) => {
//       acc[memory.id] = getPointOnPath(pathRef.current, memory.progress);
//       return acc;
//     },
//     {} as Record<string, { x: number; y: number }>,
//   );

//   setNodePositions(positions);
// }, [memories]); // memories 상태가 확정된 후 좌표 계산
