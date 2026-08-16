import { Memory } from "@/types/memory";

export const sampleMemories: Memory[] = [
  {
    id: 1,
    chapter: "Chapter 01",
    title: "두근거렸던 비밀 퀴즈",
    location: "어느 설레는 장소",
    date: "20XX.XX.XX",
    story:
      "이곳은 샘플 페이지입니다. 정답을 맞추면 둘만의 소중한 첫 만남과 비밀스러운 추억 이야기가 열립니다.",
    unlocked: true,
    quiz: {
      question: "이 샘플 페이지를 열어보기 위한 정답 선택지는 무엇일까요?",
      options: [
        "첫 번째 선택지",
        "두 번째 선택지",
        "진짜 추억 열어보기 💖",
        "네 번째 선택지",
      ],
      answer: 2,
      hint: [
        "비밀번호를 입력하시면 진짜 이야기가 시작돼요 💕",
        "힌트: 분홍색 하트가 있는 세 번째 선택지를 골라보세요 ✨",
      ],
    },
  },
  {
    id: 2,
    chapter: "Chapter 02",
    title: "함께 떠났던 첫 여행",
    location: "푸른 바닷가",
    date: "20XX.XX.XX",
    story:
      "시원한 바람과 파도 소리가 가득했던 날. 비밀 질문을 통과하시면 그날 우리가 나누었던 진짜 대화와 사진들을 확인하실 수 있습니다.",
    unlocked: false,
    quiz: {
      question: "샘플 퀴즈: 우리가 바닷가에서 가장 먼저 먹었던 디저트는?",
      options: [
        "바닐라 아이스크림",
        "시원한 수박",
        "달콤한 조각 케이크",
        "따뜻한 아메리카노",
      ],
      answer: 0,
      hint: [
        "오답입니다! 상단 비밀번호 모달을 통해 진짜 스토리를 열람해보세요 🍦",
        "힌트: 첫 번째 선택지를 클릭하면 샘플 퀴즈가 풀립니다!",
      ],
    },
  },
  {
    id: 3,
    chapter: "Chapter 03",
    title: "약속의 순간",
    location: "소중한 우리만의 공간",
    date: "20XX.XX.XX",
    story:
      "서로의 손을 잡고 평생을 약속하는 순간. 올바른 비밀번호를 입력하시면 감동적인 프러포즈 영상이 재생됩니다.",
    unlocked: false,
    quiz: {
      question: "샘플 퀴즈: 앞으로 우리가 함께 만들어갈 날들은 어떨까요?",
      options: ["매일매일 행복한 날들 💍"],
      answer: 0,
      hint: [
        "정답입니다! 상단 열람하기 버튼을 눌러 둘만의 진짜 추억을 확인해주세요 💕",
      ],
    },
  },
];
