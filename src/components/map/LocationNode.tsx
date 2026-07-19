"use client";

import { Memory } from "@/types/memory";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  memory: Memory;
}

export default function LocationNode({ memory }: Props) {
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
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      style={{
        position: "absolute",
        left: memory.x,
        top: memory.y,
      }}
    >
      <Link
        href={memory.unlocked ? `/chapter/${memory.id}` : "#"}
        className="group block"
      >
        <div
          className={`
          relative
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          border-4
          shadow-xl
          transition-all
          duration-300

          ${
            memory.unlocked
              ? "border-pink-300 bg-white"
              : "border-gray-300 bg-gray-200"
          }
        `}
        >
          {memory.unlocked && (
            <>
              <motion.div
                className="absolute h-full w-full rounded-full bg-pink-300/20"
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.4, 0.1, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Sparkles size={34} className="text-pink-400" />
              </motion.div>
            </>
          )}

          {!memory.unlocked && <Lock size={30} className="text-gray-500" />}
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs font-semibold text-pink-500">
            {memory.chapter}
          </p>

          <p className="text-sm font-medium text-gray-700">{memory.title}</p>
        </div>
      </Link>
    </motion.div>
  );
}
