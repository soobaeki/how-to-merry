"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useJourney } from "@/hooks/useJourney";
import { useMusicActions } from "@/stores/useMusicStore";
import { useVideoSrc } from "@/stores/useVideoStore";

/**
 * -----------------------------------------------------------------------------
 * 💍 프러포즈 영상 및 메시지 페이지 (ProposalPage)
 * -----------------------------------------------------------------------------
 */
export default function ProposalPage() {
  const router = useRouter();

  // ─── Custom Hooks & Store Selectors ─────────────────────────────────────────
  const { resetJourney } = useJourney();
  const { setMusicPlaying } = useMusicActions(); // 🎯 수정: setIsPlaying -> setMusicPlaying
  const videoSrc = useVideoSrc();

  // ─── Local State ────────────────────────────────────────────────────────────
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // ─── Side Effects ───────────────────────────────────────────────────────────
  // 🎯 페이지 진입 시 BGM 일시정지, 페이지 이탈 시 BGM 재개
  useEffect(() => {
    setMusicPlaying(false); // 🎯 수정: setIsPlaying -> setMusicPlaying
    return () => setMusicPlaying(true); // 🎯 수정: setIsPlaying -> setMusicPlaying
  }, [setMusicPlaying]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  /** 🏁 영상 종료 시 BGM 재개 및 엔딩 메시지 전환 */
  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setMusicPlaying(true); // 🎯 수정: setIsPlaying -> setMusicPlaying
  };

  /** 🔄 영상 다시 보기 */
  const handleReplay = () => {
    setMusicPlaying(false); // 🎯 수정: setIsPlaying -> setMusicPlaying
    setIsVideoEnded(false);
  };

  /** 🗺️ 여정 지도로 돌아가기 */
  const handleBackToJourney = () => {
    resetJourney();
    router.push("/journey");
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* ─── 닫기 버튼 ───────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleBackToJourney}
        className="absolute top-6 right-6 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
        aria-label="지도로 돌아가기"
      >
        <X size={20} />
      </button>

      {/* ─── 동영상 플레이어 ─────────────────────────────────────────────────── */}
      {!isVideoEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative h-full w-full max-w-4xl px-4"
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              playsInline
              controls
              onEnded={handleVideoEnd}
              className="h-full w-full rounded-2xl object-cover shadow-2xl"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md">
              <p className="animate-pulse text-sm text-pink-200">
                영상을 준비하는 중입니다...
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── 동영상 종료 후 엔딩 메시지 ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isVideoEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center px-4 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mb-6 text-5xl"
            >
              ❤️
            </motion.div>

            <h1 className="font-serif text-4xl font-bold tracking-wide text-pink-300 md:text-6xl">
              Will you marry me?
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              >
                <RotateCcw size={16} />
                영상 다시 보기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
