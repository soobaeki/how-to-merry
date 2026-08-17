export interface Memory {
  id: number;
  chapter: string;
  title: string;
  location: string;
  date: string;
  story: string;
  unlocked: boolean;
  isCompleted: boolean; // ✅ 퀴즈를 맞추어 퀘스트를 완료했는지 여부
  quiz?: {
    question: string;
    options: string[];
    answer: number;
    hint?: string[];
  };
}
