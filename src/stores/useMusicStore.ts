import { decryptMusic } from "@/libs/crypto";
import { create } from "zustand";

/**
 * -----------------------------------------------------------------------------
 * 🎵 BGM 음악 상태 관리 인터페이스 (MusicState)
 * -----------------------------------------------------------------------------
 */
interface MusicState {
  /** ---------------------------------------------------------------------------
   * 📌 [State] 상태
   * --------------------------------------------------------------------------- */
  /** 음악 재생 여부 (true: 재생 중, false: 일시정지) */
  isMusicPlaying: boolean;

  /** 음소거 여부 (true: 음소거, false: 음소거 해제) */
  isMuted: boolean;

  /** 현재 설정된 음악 URL 경로 (null인 경우 플레이어 비활성화) */
  musicUrl: string | null;

  /** ---------------------------------------------------------------------------
   * ⚡ [Actions] 상태 변경 액션
   * --------------------------------------------------------------------------- */
  actions: {
    /** 음악 재생/일시정지 상태를 지정합니다. */
    setMusicPlaying: (isPlaying: boolean) => void;

    /** 음소거 여부를 지정합니다. */
    setIsMuted: (isMuted: boolean) => void;

    /** 음원 파일 경로를 직접 변경합니다. */
    setMusicUrl: (musicUrl: string | null) => void;

    /** 샘플 모드 여부에 따라 음악 소스를 스토어 내부에서 자동으로 설정합니다. */
    setMusicBySampleMode: (isSample: boolean) => void;

    /** 음악 재생/일시정지 상태를 토글합니다. */
    toggleMusicPlay: () => void;
  };
}

/**
 * -----------------------------------------------------------------------------
 * 🏪 BGM 전역 스토어 (useMusicStore)
 * -----------------------------------------------------------------------------
 */
export const useMusicStore = create<MusicState>((set) => ({
  // ─── 초기 상태 (Initial State) ──────────────────────────────────────────────
  isMusicPlaying: false,
  isMuted: false,
  musicUrl: "/music/sample-bgm.mp3",

  // ─── 액션 구현부 (Actions Impl) ──────────────────────────────────────────────
  actions: {
    setMusicPlaying: (isMusicPlaying) => set({ isMusicPlaying }),
    setIsMuted: (isMuted) => set({ isMuted }),
    setMusicUrl: (musicUrl) => set({ musicUrl }),

    setMusicBySampleMode: (isSample) =>
      set({
        musicUrl: isSample ? "/music/sample-bgm.mp3" : decryptMusic(),
      }),

    toggleMusicPlay: () =>
      set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
  },
}));

/* =============================================================================
 * 🎯 커스텀 구독 훅 (Custom Selector Hooks)
 * ============================================================================= */

/** 🎵 음악 재생 여부(`isMusicPlaying`)만 구독합니다. */
export const useIsMusicPlaying = () =>
  useMusicStore((state) => state.isMusicPlaying);

/** 🎧 현재 설정된 음악 URL(`musicUrl`)만 구독합니다. */
export const useMusicUrl = () => useMusicStore((state) => state.musicUrl);

/** ⚡ 스토어의 변경 액션 객체(`actions`)만 가져옵니다. */
export const useMusicActions = () => useMusicStore((state) => state.actions);
