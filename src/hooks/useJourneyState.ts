import { memories as initialMemories } from "@/data/memories";
import { Memory } from "@/types/memory";
import { useCallback, useState, useSyncExternalStore } from "react";

const STORAGE_KEYS = {
  UNLOCKED: "unlockedChapterIds",
  COMPLETED: "completedChapterIds",
} as const;

// 외부 스토어(localStorage) 변경 감지용 빈 구독 함수
const subscribe = () => () => {};

// Client 렌더링 여부 확인 (SSR 하이드레이션 방지)
function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true, // 브라우저 렌더링 시 true
    () => false, // 서버(SSR) 렌더링 시 false
  );
}

// localStorage 읽기 헬퍼 함수
function getStorageData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function useJourneyState() {
  const isClient = useIsClient();

  // Unlocked IDs State (초기값을 Lazy Function으로 가져옴)
  const [unlockedIds, setUnlockedIds] = useState<number[]>(() =>
    getStorageData(STORAGE_KEYS.UNLOCKED, [1]),
  );

  // Completed IDs State
  const [completedIds, setCompletedIds] = useState<number[]>(() =>
    getStorageData(STORAGE_KEYS.COMPLETED, []),
  );

  // SSR(서버)일 때는 기본 상태, 클라이언트일 때만 localStorage 반영값 계산
  // 1. 서버(SSR)에서는 isClient가 false이므로 [1]과 []를 반환합니다.
  // ➔ 서버는 일단 안전한 기본값으로 HTML을 만듭니다.
  // 2. 브라우저에 마운트되는 순간 isClient가 true로 전환됩니다.
  // ➔ 그제야 localStorage에서 읽어온 진짜 unlockedIds와 completedIds를 사용해 화면을 업데이트합니다.
  const currentUnlockedIds = isClient ? unlockedIds : [1];
  const currentCompletedIds = isClient ? completedIds : [];

  const memories: Memory[] = initialMemories.map((memory) => ({
    ...memory,
    unlocked: currentUnlockedIds.includes(memory.id),
  }));

  // 진행 상황 초기화
  const resetJourney = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEYS.UNLOCKED);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED);

    setUnlockedIds([1]);
    setCompletedIds([]);
  }, []);

  const isAllCompleted =
    memories.length > 0 &&
    memories.every((m) => currentCompletedIds.includes(m.id));

  return {
    memories,
    completedIds: currentCompletedIds,
    isAllCompleted,
    resetJourney,
  };
}
