import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스를 병합하고 충돌을 방지합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * SVG 경로상의 특정 진행률(0~1)에 해당하는 좌표를 반환합니다.
 * @param pathElement - 대상 SVG Path 요소
 * @param progress - 경로 전체 길이 대비 비율 (0.0: 시작점, 1.0: 끝점)
 * @returns { x, y } 좌표 객체
 */
export const getPointOnPath = (
  pathElement: SVGPathElement | null,
  progress: number,
) => {
  // Path 요소가 로드되지 않았거나 초기 상태일 경우 방어 코드
  if (!pathElement) return { x: 0, y: 0 };

  const length = pathElement.getTotalLength();

  // 경로가 아직 렌더링되지 않았을 경우(길이 0) 예외 처리
  if (length <= 0) return { x: 0, y: 0 };

  return pathElement.getPointAtLength(length * progress);
};
