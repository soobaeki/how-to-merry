import { useMemories } from "@/stores/useDataStore";
import { Memory } from "@/types/memory";
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * =============================================================================
 * 1. 🐻 Zustand Store (글로벌 상태 및 LocalStorage 자동 동기화 관리)
 * =============================================================================
 */
interface JourneyStore {
  unlockedIds: number[];
  completedIds: number[];
  completeChapter: (chapterId: number) => void;
  resetJourney: () => void;
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set) => ({
      // 🎯 [기본값] 앱 처음 진입 시 Chapter 1 (id: 1)만 해금된 상태로 시작
      unlockedIds: [1],
      completedIds: [],

      // 🎯 [챕터 완료 처리] 현재 챕터 완료 등록 및 다음 챕터(chapterId + 1) 자동 해금
      completeChapter: (chapterId: number) =>
        set((state) => ({
          unlockedIds: Array.from(
            new Set([...state.unlockedIds, chapterId, chapterId + 1]),
          ),
          completedIds: state.completedIds.includes(chapterId)
            ? state.completedIds
            : [...state.completedIds, chapterId],
        })),

      // 🎯 [전체 초기화] Zustand 메모리 및 LocalStorage 데이터를 시작 상태([1])로 리셋
      resetJourney: () =>
        set({
          unlockedIds: [1],
          completedIds: [],
        }),
    }),
    {
      name: "journey-storage", // LocalStorage에 저장되는 Key 이름
    },
  ),
);

/**
 * =============================================================================
 * 🛠️ Client (브라우저) 마운트 여부 안전 판별 헬퍼 (useEffect 무사용)
 * =============================================================================
 */
const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // 브라우저 환경 (Client)
    () => false, // 서버 환경 (SSR)
  );
}

/**
 * =============================================================================
 * 2. 🗺️ Custom Hook: useJourneyState
 * -----------------------------------------------------------------------------
 * UI 컴포넌트(JourneyMap 등)에서 사용할 데이터를 가공하여 제공합니다.
 * =============================================================================
 */
export function useJourney() {
  // useEffect + setState 대신 useSyncExternalStore로 SSR/Client 분기
  const isClient = useIsClient();

  // Zustand 스토어 구독
  const { unlockedIds, completedIds, completeChapter, resetJourney } =
    useJourneyStore();

  // 원본 추억 데이터 불러오기 (Context/Store 등)
  const initialMemories = useMemories();

  // ➔ 서버(SSR) 렌더링 시: 안전한 기본값 ([1], []) 사용
  // ➔ 브라우저(Client) 마운트 후: LocalStorage에서 복원된 진짜 Zustand 상태 적용
  const currentUnlockedIds = isClient ? unlockedIds : [1];
  const currentCompletedIds = isClient ? completedIds : [];

  // 🎯 원본 memories 배열 각 항목에 dynamic하게 unlocked 및 isCompleted 상태 주입
  const memories: Memory[] = initialMemories.map((memory) => ({
    ...memory,
    unlocked: currentUnlockedIds.includes(memory.id),
    isCompleted: currentCompletedIds.includes(memory.id),
  }));

  // 🎯 모든 챕터를 완료했는지 여부 계산
  const isAllCompleted =
    memories.length > 0 &&
    memories.every((m) => currentCompletedIds.includes(m.id));

  return {
    memories,
    completedIds: currentCompletedIds,
    completeChapter,
    isAllCompleted,
    resetJourney,
  };
}
