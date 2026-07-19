"use client";

import { cn } from "@/libs/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fff8f2]">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
        }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-pink-400">OUR JOURNEY</h1>

        <p className="mt-6 text-gray-600">우리의 이야기를 다시 여행합니다.</p>

        <Link
          href="/journey"
          className={cn(
            "inline-flex",
            "mt-10",
            "px-10",
            "py-4",
            "rounded-full",
            "bg-pink-400",
            "text-white",
            "shadow-lg",
            "transition",
            "hover:scale-105",
          )}
        >
          START
        </Link>
      </motion.div>
    </main>
  );
}
