"use client";

import { calculateTogetherDays } from "@/libs/utils";
import { motion } from "framer-motion";

export default function JourneyHeader() {
  const days = calculateTogetherDays("2026-03-07");

  return (
    <header className="relative z-10 pt-12 pb-12 text-center">
      {/* D-Day 또는 시작일 뱃지 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold mb-3 shadow-sm min-h-6.5"
      >
        <span>💖</span>
        <span>Together {days.toLocaleString()} Days</span>
      </motion.div>

      {/* 서브 타이틀 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-sm sm:text-base text-gray-600 font-medium"
      >
        함께 걸어온 소중한 기억을 찾아 떠나볼까요?
      </motion.p>
    </header>
  );
}
