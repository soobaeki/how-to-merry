import { Memory } from "@/types/memory";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스를 병합하고 충돌을 방지합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================
// 🗺️ Journey Map 레이아웃 & 경로 계산 유틸리티
// ==========================================

/** 노드 배치 기준 상수 (380px 너비 기준) */
export const NODE_LAYOUT = {
  SPACING_Y: 190, // 노드와 노드 사이의 수직 간격(px)
  START_Y: 60, // 첫 번째 노드가 시작할 Y 좌표(px)
  CENTER_X: 190, // 지도 기준 중앙 X 좌표(px) (전체 너비 380px의 절반)
  OFFSET_X: 60, // 좌우로 지그재그 휘어지는 최대 폭(px)
} as const;

/**
 * 총 노드 수에 따라 SVG 3차 베지어 곡선(d 속성)과 컨테이너 높이를 계산합니다.
 */
export function calculatePathD(totalNodes: number) {
  if (totalNodes === 0) return { pathD: "", containerHeight: 300 };

  const { SPACING_Y, START_Y, CENTER_X, OFFSET_X } = NODE_LAYOUT;
  let d = `M ${CENTER_X} ${START_Y}`;

  for (let i = 1; i < totalNodes; i++) {
    const prevY = START_Y + (i - 1) * SPACING_Y;
    const currentY = START_Y + i * SPACING_Y;

    // 홀수번째는 오른쪽(+1), 짝수번째는 왼쪽(-1)으로 제어점을 꺾어 S자 곡선 생성
    const direction = i % 2 === 1 ? 1 : -1;
    const controlX = CENTER_X + OFFSET_X * direction;
    const targetX = CENTER_X + (OFFSET_X / 2) * direction;

    const cp1Y = prevY + SPACING_Y * 0.5;
    const cp2Y = currentY - SPACING_Y * 0.5;

    d += ` C ${controlX} ${cp1Y}, ${targetX} ${cp2Y}, ${CENTER_X} ${currentY}`;
  }

  // Footer Progress Bar와의 하단 여백 확보 (+220px)
  const containerHeight = START_Y + (totalNodes - 1) * SPACING_Y + 220;

  return { pathD: d, containerHeight };
}

/**
 * 각 메모리 노드가 배치될 exact (x, y) 좌표 객체를 생성합니다.
 */
export function calculateNodePositions(memories: Memory[]) {
  const { SPACING_Y, START_Y, CENTER_X, OFFSET_X } = NODE_LAYOUT;

  return memories.reduce<Record<string, { x: number; y: number }>>(
    (acc, memory, index) => {
      const currentY = START_Y + index * SPACING_Y;
      let currentX = CENTER_X;

      if (index > 0) {
        const sign = index % 2 !== 0 ? 1 : -1;
        currentX = CENTER_X + (OFFSET_X / 2) * sign;
      }

      acc[memory.id] = { x: currentX, y: currentY };
      return acc;
    },
    {},
  );
}

/**
 * 시작일부터 오늘까지 지나온 일수(D+Day)를 계산합니다.
 * @param startDateStr "YYYY-MM-DD" 형태의 날짜 문자열
 * @returns 지나온 일수 (시작일 = 1일)
 */
export function calculateTogetherDays(startDateStr: string): number {
  const start = new Date(startDateStr);
  const today = new Date();

  // 자정(00:00:00) 기준 날짜 차이 계산
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  // 밀리초 -> 일(Day) 변환 (+1: 첫 만남일 포함)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * 배열에서 무작위 요소 1개를 추출합니다.
 */
export function getRandomElement<T>(array: T[]): T | undefined {
  if (!array || array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
