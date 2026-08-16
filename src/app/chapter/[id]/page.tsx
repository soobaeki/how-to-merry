import { TOTAL_CHAPTER_COUNT } from "@/data/data-encrypted";
import ChapterClient from "./ChapterClient";

/**
 * TOTAL_CHAPTER_COUNT 상수 기반으로 [id] 경로 자동 생성
 */
export async function generateStaticParams() {
  return Array.from({ length: TOTAL_CHAPTER_COUNT }, (_, index) => ({
    id: (index + 1).toString(),
  }));
}
export default function ChapterPage() {
  return <ChapterClient />;
}
