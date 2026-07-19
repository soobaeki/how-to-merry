"use client";

import { cn } from "@/libs/utils";
import { Memory } from "@/types/memory";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  memory: Memory;
  onClick?: () => void; // 퀴즈 모달 호출을 위해 추가
}

export default function LocationNode({ memory, onClick }: Props) {
  // 열린 노드라면 Link로, 잠긴 노드라면 button(onClick)으로 렌더링합니다.
  const Content = (
    <>
      <div
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300",
          memory.unlocked
            ? "border-pink-300 bg-white"
            : "border-gray-300 bg-gray-200",
        )}
      >
        {memory.unlocked ? (
          <>
            <motion.div
              className="absolute h-full w-full rounded-full bg-pink-300/20"
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={30} className="text-pink-400" />
            </motion.div>
          </>
        ) : (
          <Lock size={24} className="text-gray-500" />
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs font-semibold text-pink-500">{memory.chapter}</p>
        <p className="text-sm font-medium text-gray-700">{memory.title}</p>
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
          href={`/chapter/${memory.id}`}
          className="group block cursor-pointer"
        >
          {Content}
        </Link>
      ) : (
        <button onClick={onClick} className="group block cursor-pointer">
          {Content}
        </button>
      )}
    </motion.div>
  );
}
