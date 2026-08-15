"use client";

import QuizCard from "@/components/quest/QuizCard";
import { memories } from "@/data/memories";
import { useJourneyState } from "@/hooks/useJourneyState";
import { cn } from "@/libs/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

/**
 * GitHub Pages 같은 정적 서버는 서버 측 연산(SSR)을 할 수 없기 때문에,
 * /chapter/[id]와 같은 동적 라우트(Dynamic Route) 페이지가 있다면
 * 빌드 시점에 어떤 [id] 페이지들(예: 1, 2, 3, 4, 5)을 미리 HTML로 만들어 둘지 명시해 주어야 합니다.
 */
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

export default function Chapter() {
  const params = useParams();
  const router = useRouter();
  const { completeChapter } = useJourneyState();

  const chapterId = Number(params.id);
  const memory = memories.find((m) => m.id === chapterId);

  // 🎯 정답 성공 시 실행될 처리 함수
  const handleCorrect = () => {
    completeChapter(chapterId);
    // 저장 완료 후 지도로 돌아가기
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
        hints={memory.quiz.hint ?? []}
        story={memory.story}
        onCorrect={handleCorrect}
      />
    </main>
  );
}
