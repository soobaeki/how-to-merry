"use client";

import { getRandomElement } from "@/libs/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface QuizProps {
  question: string;
  options: string[];
  answerIndex: number;
  hints: string[];
  story: string; // 맞췄을 때 나오는 추억 멘트나 설명
  onCorrect: () => void; // 정답 맞추고 다음으로 넘어가거나 완료할 때
}

export default function QuizCard({
  question,
  options,
  answerIndex,
  hints = [],
  story,
  onCorrect,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [randomHint, setRandomHint] = useState<string>("");

  const handleSelect = (index: number) => {
    if (selected !== null) return; // 이미 골랐으면 중복 클릭 방지

    setSelected(index);
    const correct = index === answerIndex;
    setIsCorrect(correct);

    // 🎯 틀렸을 경우 hints 배열에서 무작위로 1개 선택
    if (!correct) {
      if (hints && hints.length > 0) {
        const randomIndex = (getRandomElement(hints) ?? 1) as number;
        setRandomHint(hints[randomIndex]);
      } else {
        setRandomHint("앗, 이건 아니었는데 ㅋㅋ"); // hints가 비어있을 때 기본 문구
      }
    }
  };

  // 🎯 다시 고르기 핸들러
  const handleReset = () => {
    setSelected(null);
    setIsCorrect(null);
    setRandomHint("");
  };

  return (
    <div className="text-center w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
      {/* 질문 */}
      <h2 className="text-xl font-bold text-gray-800 whitespace-pre-line">
        {question}
      </h2>
      <p className="mt-1 text-sm text-gray-500">알맞은 추억을 골라봐!</p>

      {/* 3~4지선다 보기 버튼들 */}
      <div className="mt-6 flex flex-col gap-3">
        {options.map((option, index) => {
          let btnStyle =
            "border-gray-200 bg-gray-50 text-gray-700 hover:bg-pink-50 hover:border-pink-300 cursor-pointer";

          if (selected !== null) {
            if (index === answerIndex) {
              btnStyle =
                "border-green-400 bg-green-50 text-green-700 font-semibold";
            } else if (index === selected) {
              btnStyle = "border-red-300 bg-red-50 text-red-500";
            } else {
              btnStyle = "border-gray-200 bg-gray-50 opacity-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={selected !== null}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* 정답 맞췄을 때 나타나는 감동의 추억 피드백 영역 */}
      {isCorrect !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-pink-50 p-4 text-center"
        >
          {isCorrect ? (
            <>
              <p className="font-bold text-pink-600">정답이야! 💖</p>
              <p className="mt-1 text-sm text-gray-600">{story}</p>
              <button
                onClick={onCorrect}
                className="mt-4 w-full rounded-full bg-pink-400 py-3 text-white font-semibold shadow-md hover:bg-pink-500 transition cursor-pointer"
              >
                다음 추억으로 넘어가기 ✨
              </button>
            </>
          ) : (
            <>
              <p className="font-bold text-red-400">{randomHint}</p>
              <p className="mt-1 text-sm text-gray-600">다시 생각해 봐!</p>
              <button
                onClick={handleReset}
                className="mt-4 w-full rounded-full bg-gray-300 py-3 text-gray-700 font-semibold hover:bg-gray-400 transition cursor-pointer"
              >
                다시 고르기
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
