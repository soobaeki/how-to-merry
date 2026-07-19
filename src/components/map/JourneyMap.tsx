"use client";

import { memories } from "@/data/memories";
import { getPointOnPath } from "@/libs/utils";
import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import LocationNode from "./LocationNode";

export default function JourneyMap() {
  const pathRef = useRef<SVGPathElement>(null);
  // 노드별 좌표를 저장하여 렌더링 시 배치에 사용
  const [nodePositions, setNodePositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // SVG 렌더링 직후 경로 좌표를 계산하여 노드 위치 확정
  useLayoutEffect(() => {
    if (!pathRef.current) return;

    // 경로 상의 비율(progress)을 실제 픽셀 좌표로 변환
    const positions = memories.reduce(
      (acc, memory) => {
        acc[memory.id] = getPointOnPath(pathRef.current, memory.progress);
        return acc;
      },
      {} as Record<string, { x: number; y: number }>,
    );

    setNodePositions(positions);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8F2]">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-20 h-24 w-24 rounded-full bg-pink-100 blur-3xl" />

        <div className="absolute right-10 top-60 h-32 w-32 rounded-full bg-orange-100 blur-3xl" />

        <div className="absolute bottom-10 left-1/2 h-28 w-28 rounded-full bg-yellow-100 blur-3xl" />
      </div>

      {/* Header */}

      <header className="relative z-10 pt-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800"
        >
          OUR JOURNEY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-gray-500"
        >
          우리의 추억을 다시 여행해 보자
        </motion.p>
      </header>

      {/* Section */}

      <section className="relative mx-auto mt-20 h-225 max-w-md">
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          {/* Path */}
          <path
            ref={pathRef} // ref 연결!
            d="M190 60 C 240 170 120 250 210 350 S 120 600 210 760"
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
          <span>1 / {memories.length}</span>
        </div>

        <div className="h-3 rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-pink-400"
            style={{
              width: "20%",
            }}
          />
        </div>
      </footer>
    </main>
  );
}
