"use client";

import QuizCard from "@/components/quest/QuizCard";
import { memories } from "@/data/memories";
import { cn } from "@/libs/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function Chapter() {
  const params = useParams();
  const router = useRouter();

  const chapterId = Number(params.id);
  const memory = memories.find((m) => m.id === chapterId);

  // 🎯 정답 성공 시 실행될 처리 함수
  const handleCorrect = () => {
    if (typeof window !== "undefined") {
      // 1. 기존 unlocked 목록 불러오기 (기본값: [1])
      const savedUnlocked = localStorage.getItem("unlockedChapterIds");
      const unlockedIds: number[] = savedUnlocked
        ? JSON.parse(savedUnlocked)
        : [1];

      // 2. 현재 챕터 + 다음 챕터(chapterId + 1)를 목록에 추가 (중복 제거)
      const updatedIds = Array.from(
        new Set([...unlockedIds, chapterId, chapterId + 1]),
      );

      // 3. localStorage에 최신화된 목록 저장
      localStorage.setItem("unlockedChapterIds", JSON.stringify(updatedIds));
    }

    // 4. 저장 완료 후 지도로 돌아가기
    router.push("/journey");
  };

  if (!memory || !memory.quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream text-gray700">
        <p>아직 준비되지 않은 챕터이거나 퀴즈가 없는 추억이야!</p>

        <Link
          href="/journey"
          className={cn(
            "inline-flex",
            "mt-6",
            "px-8",
            "py-3",
            "rounded-full",
            "bg-pink400",
            "text-white",
            "font-semibold",
            "shadow-lg",
            "transition",
            "hover:scale-105",
            "hover:bg-pink500",
          )}
        >
          지도로 돌아가기 ✨
        </Link>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream p-4">
      <div className="mb-6 text-center">
        <span className="rounded-full bg-pink100 px-4 py-1 text-xs font-bold text-pink500">
          {memory.chapter} : {memory.title}
        </span>
        <p className="mt-2 text-sm text-gray500">
          {memory.date} @ {memory.location}
        </p>
      </div>

      <QuizCard
        question={memory.quiz.question}
        options={memory.quiz.options}
        answerIndex={memory.quiz.answer}
        explanation={memory.story}
        onCorrect={handleCorrect}
      />
    </main>
  );
}
