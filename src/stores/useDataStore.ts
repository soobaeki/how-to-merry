import { ENCRYPTED_PROPOSAL_DATA } from "@/data/data-encrypted";
import { decryptData } from "@/libs/crypto";
import { Memory } from "@/types/memory";
import { create } from "zustand";

/**
 * -----------------------------------------------------------------------------
 * 🖼️ 추억 데이터 상태 관리 인터페이스 (MemoryState)
 * -----------------------------------------------------------------------------
 */
interface MemoryState {
  /** ---------------------------------------------------------------------------
   * 📌 [State] 상태
   * --------------------------------------------------------------------------- */
  /** 화면에 표시할 추억 데이터 목록 (샘플 또는 초기 복호화 데이터) */
  memories: Memory[];

  /** 앱 진입 시 암호화 데이터 복호화 진행 상태 (true: 로딩 중, false: 완료) */
  isLoading: boolean;

  /** 데이터 로딩 또는 복호화 실패 여부 (true: 실패, false: 정상) */
  isError: boolean;

  /** 현재 샘플 데이터 감상 모드인지 여부 (true: 샘플 모드, false: 실데이터 모드) */
  isSample: boolean;

  /** ---------------------------------------------------------------------------
   * ⚡ [Actions] 상태 변경 액션
   * --------------------------------------------------------------------------- */
  actions: {
    /** 앱 시작 시 환경변수/비밀키를 이용해 암호화된 추억 데이터를 복호화합니다. */
    fetchAndDecryptMemories: () => Promise<void>;

    /** 잠금 해제(비밀번호 인증) 성공 시 데이터 목록을 교체합니다. (샘플 데이터 ↔ 실데이터) */
    setMemories: (newMemories: Memory[]) => void;

    /** 샘플 감상 모드 상태 플래그를 변경합니다. */
    setIsSample: (isSample: boolean) => void;
  };
}

/**
 * -----------------------------------------------------------------------------
 * 🏪 추억 데이터 전역 스토어 (useDataStore)
 * -----------------------------------------------------------------------------
 */
export const useDataStore = create<MemoryState>((set) => ({
  // ─── 초기 상태 (Initial State) ──────────────────────────────────────────────
  memories: [],
  isLoading: true,
  isError: false,
  isSample: false,

  // ─── 액션 구현부 (Actions Impl) ──────────────────────────────────────────────
  actions: {
    // 🔓 초기 앱 진입 시 데이터 복호화 실행
    fetchAndDecryptMemories: async () => {
      try {
        set({ isLoading: true, isError: false });
        const decrypted = await decryptData<Memory[]>(ENCRYPTED_PROPOSAL_DATA);
        set({ memories: decrypted, isLoading: false });
      } catch (err) {
        console.error("❌ 추억 데이터 복호화 실패:", err);
        set({ isError: true, isLoading: false });
      }
    },

    // 🎯 추억 데이터 목록 교체 (샘플 ↔ 실데이터)
    setMemories: (newMemories) => set({ memories: newMemories }),

    // 👁️ 샘플 데이터 감상 모드 플래그 업데이트
    setIsSample: (isSample) => set({ isSample }),
  },
}));

/* =============================================================================
 * 🎯 커스텀 구독 훅 (Custom Selector Hooks)
 * 컴포넌트에서 필요한 상태만 선택적으로 구독하여 불필요한 리렌더링을 방지합니다.
 * ============================================================================= */

/** 🖼️ 추억 목록 배열(`memories`)만 구독합니다. */
export const useMemories = () => useDataStore((state) => state.memories);

/** ⏳ 데이터 로딩 상태(`isLoading`)만 구독합니다. */
export const useIsDataLoading = () => useDataStore((state) => state.isLoading);

/** ⚠️ 복호화 에러 상태(`isError`)만 구독합니다. */
export const useIsDataError = () => useDataStore((state) => state.isError);

/** 👁️ 샘플 모드 여부(`isSample`)만 구독합니다. */
export const useIsSample = () => useDataStore((state) => state.isSample);

/** ⚡ 스토어의 변경 액션 객체(`actions`)만 가져옵니다. */
export const useDataActions = () => useDataStore((state) => state.actions);
