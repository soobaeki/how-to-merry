"use client";

import { memories } from "@/data/memories";
import { motion } from "framer-motion";
import LocationNode from "./LocationNode";

export default function JourneyMap() {
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

      {/* World */}

      <section
        className="
        relative
        mx-auto
        mt-20
        h-[900px]
        max-w-md
        "
      >
        {/* Path */}

        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M190 60 C 240 170 120 250 210 350 S 120 600 210 760"
            fill="none"
            stroke="#F9A8D4"
            strokeWidth="6"
            strokeDasharray="10 10"
          />
        </svg>

        {/* Nodes */}

        {memories.map((memory) => (
          <LocationNode key={memory.id} memory={memory} />
        ))}
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
