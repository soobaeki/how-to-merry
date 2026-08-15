"use client";

import { useJourneyState } from "@/hooks/useJourneyState";
import { decryptProposalVideo } from "@/libs/crypto";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react"; // lucide-react 아이콘 사용
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "";

export default function ProposalPage() {
  const router = useRouter();
  const { resetJourney } = useJourneyState();
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // secretKey를 사용해 암호화된 영상을 Base64 Data URL로 복호화
  const videoSrc = useMemo(() => {
    if (!secretKey) return null;
    return decryptProposalVideo(secretKey);
  }, []);

  // 영상이 끝났을 때 실행될 핸들러
  const handleVideoEnd = () => {
    setIsVideoEnded(true);
  };

  // 영상 다시 보기
  const handleReplay = () => {
    setIsVideoEnded(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* 영상 재생 취소 */}
      <button
        type="button"
        onClick={() => {
          router.push("/journey");
          resetJourney();
        }}
        className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 cursor-pointer"
        aria-label="지도로 돌아가기"
      >
        <X size={20} />
      </button>

      {/* 동영상 플레이어 */}
      {!isVideoEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative h-full w-full max-w-4xl px-4"
        >
          {videoSrc ? (
            <video
              src={videoSrc} /* 복호화된 Data URL 적용 */
              autoPlay
              playsInline
              controls
              onEnded={handleVideoEnd}
              className="h-full w-full rounded-2xl object-cover shadow-2xl"
            />
          ) : (
            /* 비밀키가 없거나 복호화 중일 때 스켈레톤/로딩 표시 */
            <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md">
              <p className="animate-pulse text-sm text-pink-200">
                영상을 준비하는 중입니다...
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* 동영상 종료 후 */}
      <AnimatePresence>
        {isVideoEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center px-4 text-center"
          >
            {/* 하트 아이콘 또는 장식 */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mb-6 text-5xl"
            >
              ❤️
            </motion.div>

            {/* 영문 타이틀 */}
            <h1 className="font-serif text-4xl font-bold tracking-wide text-pink-300 md:text-6xl">
              Will you marry me?
            </h1>

            {/* (다시 보기 & 지도로 이동) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              {/* 영상 다시 보기 버튼 */}
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={16} />
                영상 다시 보기
              </button>

              {/* 추억 지도로 돌아가기 버튼 */}
              {/* <Link
                href="/journey"
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600 active:scale-95"
              >
                <MapPin size={16} />
                돌아가기
              </Link> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
