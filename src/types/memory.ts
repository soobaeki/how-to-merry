export interface Memory {
  id: number;
  chapter: string;
  title: string;
  location: string;
  date: string;
  story: string;
  unlocked: boolean;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
    hint?: string[];
  };
}
