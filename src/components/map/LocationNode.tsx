"use client";

import { cn } from "@/libs/utils";
import { Memory } from "@/types/memory";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  memory: Memory;
  isCompleted?: boolean;
}

export default function LocationNode({ memory, isCompleted }: Props) {
  const Content = (
    <>
      <div
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300",
          isCompleted
            ? "border-emerald-400 bg-emerald-50" // 🎯 완료된 상태 테두리/배경
            : memory.unlocked
              ? "border-pink300 bg-white"
              : "border-gray300 bg-gray200",
        )}
      >
        {/* 🎯 1. 완장(뱃지) UI: isCompleted가 true일 때 우측 상단에 표시 */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute -right-1 -top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white"
          >
            <Check size={16} className="stroke-3" />
          </motion.div>
        )}

        {memory.unlocked ? (
          <>
            <motion.div
              className="absolute h-full w-full rounded-full bg-pink300/20"
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={30} className="text-pink400" />
            </motion.div>
          </>
        ) : (
          <Lock size={24} className="text-gray500" />
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs font-semibold text-pink500">{memory.chapter}</p>
        <p className="text-sm font-medium text-gray700">{memory.title}</p>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.7,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      whileHover={
        memory.unlocked
          ? {
              scale: 1.08,
              y: -8,
            }
          : {}
      }
      whileTap={memory.unlocked ? { scale: 0.95 } : {}} // 터치 시 살짝 작아지는 피드백
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      // style 대신 클래스로 중앙 정렬을 처리합니다.
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      {memory.unlocked ? (
        <Link
          // 해제된 노드: 해당 챕터로 바로 이동
          href={`/chapter/${memory.id}`}
          className="group block cursor-pointer"
        >
          {Content}
        </Link>
      ) : (
        <button
          // 잠긴 노드: 아예 누를 수 없음 (pointer-events-none & disabled)
          type="button"
          disabled
          tabIndex={-1}
          className="group block cursor-not-allowed pointer-events-none select-none"
        >
          {Content}
        </button>
      )}
    </motion.div>
  );
}
