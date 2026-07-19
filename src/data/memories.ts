import { Memory } from "@/types/memory";

export const memories: Memory[] = [
  {
    id: 1,
    chapter: "Chapter 01",
    title: "처음 만난 날",
    location: "강남 카페",
    date: "2023.05.20",
    story: "처음에는 조금 어색했지만 우리는 4시간 동안 계속 이야기했어.",
    unlocked: true,
    x: 120,
    y: 120,
  },
  {
    id: 2,
    chapter: "Chapter 02",
    title: "처음 함께한 여행",
    location: "바닷가",
    date: "2023.08.15",
    story: "같이 걷던 그 순간이 아직도 기억나.",
    unlocked: false,
    x: 250,
    y: 260,
  },
];
