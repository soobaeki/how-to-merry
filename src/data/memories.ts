import { Memory } from "@/types/memory";

export const memories: Memory[] = [
  {
    id: 1,
    chapter: "Chapter 01",
    title: "처음 만난 날",
    location: "히어로스터 카페(신도림)",
    date: "2026.03.07",
    story: "처음에는 조금 긴장했지만 우리는 3시간 동안 계속 이야기했어.",
    unlocked: true,
    quiz: {
      question: `우리가 처음 만난 날 
      먹은 음식은 무엇일까요?`,
      options: ["고기", "초밥", "파스타", "라면"],
      answer: 2,
    },
  },
  {
    id: 2,
    chapter: "Chapter 02",
    title: "처음 함께한 여행",
    location: "바닷가",
    date: "2023.08.15",
    story: "같이 걷던 그 순간이 아직도 기억나.",
    unlocked: false,
    quiz: {
      question: "우리가 바닷가에서 먹었던 음식은 무엇일까요?",
      options: ["회", "조개구이", "치킨", "라면"],
      answer: 1,
    },
  },
  {
    id: 3,
    chapter: "Chapter 03",
    title: "처음 도착한 너의 집",
    location: "바닷가",
    date: "2023.08.15",
    story: "같이 걷던 그 순간이 아직도 기억나.",
    unlocked: false,
    quiz: {
      question: "우리가 바닷가에서 먹었던 음식은 무엇일까요?",
      options: ["회", "조개구이", "치킨", "라면"],
      answer: 1,
    },
  },
  {
    id: 4,
    chapter: "Chapter 03",
    title: "처음 도착한 너의 집",
    location: "바닷가",
    date: "2023.08.15",
    story: "같이 걷던 그 순간이 아직도 기억나.",
    unlocked: false,
    quiz: {
      question: "우리가 바닷가에서 먹었던 음식은 무엇일까요?",
      options: ["회", "조개구이", "치킨", "라면"],
      answer: 1,
    },
  },
  {
    id: 5,
    chapter: "Chapter 03",
    title: "처음 도착한 너의 집",
    location: "바닷가",
    date: "2023.08.15",
    story: "같이 걷던 그 순간이 아직도 기억나.",
    unlocked: false,
    quiz: {
      question: "우리가 바닷가에서 먹었던 음식은 무엇일까요?",
      options: ["회", "조개구이", "치킨", "라면"],
      answer: 1,
    },
  },
];
