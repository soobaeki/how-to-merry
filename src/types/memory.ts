export interface Memory {
  id: number;
  chapter: string;
  title: string;
  location: string;
  date: string;
  story: string;
  unlocked: boolean;
  progress: number; // 0.0 ~ 1.0
  quiz?: {
    question: string;
    options: string[];
    answer: number;
  };
}
