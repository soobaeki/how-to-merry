import { decryptMusic } from "@/libs/crypto";
import { create } from "zustand";

/**
 * 🎵 BGM 샘플 파일 경로
 */
const SAMPLE_BGM_PATH = "./music/sample-bgm.mp3";

// ─── 클라이언트 싱글톤 Audio 객체 선언 ────────────────────────────────────
const isClient = typeof window !== "undefined";
const bgmAudio = isClient ? new Audio() : null;

if (bgmAudio) {
  bgmAudio.loop = true;
}

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
export const useMusicStore = create<MusicState>((set, get) => ({
  // ─── 초기 상태 (Initial State) ──────────────────────────────────────────────
  isMusicPlaying: false,
  isMuted: false,
  musicUrl: SAMPLE_BGM_PATH,

  // ─── 액션 구현부 (Actions Impl) ──────────────────────────────────────────────
  actions: {
    // 🎧 1. musicUrl 경로를 설정하고 오디오 소스를 변경
    setMusicUrl: (musicUrl) => {
      set({ musicUrl });

      if (!bgmAudio) return;

      if (musicUrl) {
        bgmAudio.src = musicUrl;
      } else {
        bgmAudio.pause();
        bgmAudio.src = "";
        set({ isMusicPlaying: false });
      }
    },

    // 🎯 2. 샘플 모드에 따라 musicUrl 결정
    setMusicBySampleMode: (isSample) => {
      const targetUrl = isSample ? SAMPLE_BGM_PATH : decryptMusic();
      get().actions.setMusicUrl(targetUrl);
    },

    // 🎵 3. 재생 / 일시정지 제어
    setMusicPlaying: (isMusicPlaying) => {
      set({ isMusicPlaying });

      if (!bgmAudio) return;

      const currentUrl = get().musicUrl;

      // musicUrl이 없는데 재생하려고 할 때 기본값 세팅
      if (isMusicPlaying && !currentUrl) {
        get().actions.setMusicUrl(SAMPLE_BGM_PATH);
        return;
      }

      if (isMusicPlaying) {
        bgmAudio.play().catch((err) => {
          console.warn("BGM 재생 차단됨:", err);
          set({ isMusicPlaying: false });
        });
      } else {
        bgmAudio.pause();
      }
    },

    // 🔇 4. 음소거 제어
    setIsMuted: (isMuted) => {
      set({ isMuted });
      if (bgmAudio) {
        bgmAudio.muted = isMuted;
      }
    },

    // 🔄 5. 재생 상태 토글
    toggleMusicPlay: () => {
      const nextState = !get().isMusicPlaying;
      get().actions.setMusicPlaying(nextState);
    },
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
