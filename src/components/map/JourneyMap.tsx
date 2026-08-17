"use client";

import { RotateCcwIcon, Video, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useJourneyState } from "@/hooks/useJourneyState";
import { calculateNodePositions, calculatePathD } from "@/libs/utils";
import { useIsMusicPlaying, useMusicActions } from "@/stores/useMusicStore";

import JourneyFooter from "./JourneyFooter";
import JourneyHeader from "./JourneyHeader";
import LocationNode from "./LocationNode";

/**
 * -----------------------------------------------------------------------------
 * 🗺️ 여정 지도 메인 컴포넌트 (JourneyMap)
 * -----------------------------------------------------------------------------
 */
export default function JourneyMap() {
  const router = useRouter();

  // ─── Custom Hooks & Store Selectors ─────────────────────────────────────────
  // 여정 상태 제어 커스텀 훅
  const { memories, completedIds, isAllCompleted, resetJourney } =
    useJourneyState();

  // Zustand BGM 음악 스토어 구독
  const isMusicPlaying = useIsMusicPlaying();
  const { toggleMusicPlay, setMusicPlaying } = useMusicActions();

  // ─── Layout Calculations ───────────────────────────────────────────────────
  // SVG 곡선 경로 및 높이 계산 (libs/utils.ts 활용)
  const { pathD, containerHeight } = useMemo(
    () => calculatePathD(memories.length),
    [memories.length],
  );

  // 노드 위치 계산 (libs/utils.ts 활용)
  const nodePositions = useMemo(
    () => calculateNodePositions(memories),
    [memories],
  );

  // 🎯 모든 챕터를 완료하면 /proposal 페이지로 자동 이동
  useEffect(() => {
    if (isAllCompleted) {
      const timer = setTimeout(() => {
        router.push("/proposal");
      }, 1000); // 완료 축하 연출 후 1초 뒤 이동
      return () => clearTimeout(timer);
    }
  }, [isAllCompleted, router]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  /** 🎬 프러포즈 영상 페이지로 이동 (이동 전 BGM 일시정지) */
  const handleGoToProposal = () => {
    setMusicPlaying(false); // 🎯 수정: setIsPlaying -> setMusicPlaying
    router.push("/proposal");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* ─── Background Decoration ─────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 h-24 w-24 rounded-full bg-pink100 blur-3xl" />
        <div className="absolute top-60 right-10 h-32 w-32 rounded-full bg-orange100 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-28 w-28 rounded-full bg-yellow100 blur-3xl" />
      </div>

      {/* ─── Floating Action Buttons ────────────────────────────────────────── */}
      {/* 1. 초기화 버튼 */}
      <button
        type="button"
        onClick={resetJourney}
        aria-label="초기화"
        className="absolute top-4 left-4 z-30 rounded-full p-2 text-gray-400 transition-colors hover:bg-pink-50 hover:text-pink-500"
        title="초기화"
      >
        <RotateCcwIcon className="h-5 w-5 cursor-pointer transition-transform duration-200 hover:-rotate-110" />
      </button>

      {/* 2. 프러포즈 영상 보기 버튼 */}
      <button
        type="button"
        onClick={handleGoToProposal}
        aria-label="프러포즈 영상 보기"
        className="absolute top-4 left-11 z-30 rounded-full p-2 text-gray-400 transition-colors hover:bg-pink-50 hover:text-pink-500"
        title="프러포즈 영상 보기"
      >
        <Video className="h-5 w-5 cursor-pointer fill-current transition-transform duration-200 hover:scale-110" />
      </button>

      {/* 3. 소리 끄기 / 켜기 토글 버튼 */}
      <button
        type="button"
        onClick={toggleMusicPlay} // 🎯 수정: togglePlay -> toggleMusicPlay
        aria-label={isMusicPlaying ? "음악 일시정지" : "음악 재생"} // 🎯 수정: isPlaying -> isMusicPlaying
        className="fixed top-4 right-4 z-50 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-pink-50 hover:text-pink-500"
        title={isMusicPlaying ? "음악 일시정지" : "음악 재생"} // 🎯 수정: isPlaying -> isMusicPlaying
      >
        {isMusicPlaying ? ( // 🎯 수정: isPlaying -> isMusicPlaying
          <Volume2 className="h-6 w-6 fill-current transition-transform duration-200 hover:scale-110" />
        ) : (
          <VolumeX className="ml-0.5 h-6 w-6 fill-current transition-transform duration-200 hover:scale-110" />
        )}
      </button>

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <JourneyHeader />

      {/* ─── Path & Nodes Section ───────────────────────────────────────────── */}
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
                ? "animate-pulse stroke-pink-500 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]"
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

      {/* ─── Footer Progress Bar ───────────────────────────────────────────── */}
      <JourneyFooter memories={memories} />
    </div>
  );
}
