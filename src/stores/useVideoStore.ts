import { decryptVideo } from "@/libs/crypto";
import { create } from "zustand";

/**
 * 🎬 비디오 샘플 파일 경로
 */
const SAMPLE_VIDEO_PATH = "./videos/sample-video.mp4";

/**
 * -----------------------------------------------------------------------------
 * 🎬 비디오 상태 관리 인터페이스 (VideoState)
 * -----------------------------------------------------------------------------
 */
interface VideoState {
  /** ---------------------------------------------------------------------------
   * 📌 [State] 상태
   * --------------------------------------------------------------------------- */
  /** 비디오 재생 여부 (true: 재생 중, false: 일시정지) */
  isVideoPlaying: boolean;

  /** 비디오 재생 완료 여부 (true: 재생 완료됨, false: 재생 중/시작 전) */
  isVideoEnded: boolean;

  /** 현재 설정된 비디오 URL 경로 (null인 경우 플레이어 비활성화) */
  videoSrc: string | null;

  /** ---------------------------------------------------------------------------
   * ⚡ [Actions] 상태 변경 액션
   * --------------------------------------------------------------------------- */
  actions: {
    /** 비디오 재생/일시정지 상태를 지정합니다. */
    setVideoPlaying: (isPlaying: boolean) => void;

    /** 비디오 재생 완료 여부를 지정합니다. */
    setVideoEnded: (isEnded: boolean) => void;

    /** 비디오 영상 소스 URL 경로를 교체합니다. */
    setVideoSrc: (src: string | null) => void;

    /** 샘플 모드 여부에 따라 영상 소스를 스토어 내부에서 자동으로 설정합니다. */
    setVideoBySampleMode: (isSample: boolean) => void;
  };
}

/**
 * -----------------------------------------------------------------------------
 * 🏪 비디오 전역 스토어 (useVideoStore)
 * -----------------------------------------------------------------------------
 */
export const useVideoStore = create<VideoState>((set) => ({
  // ─── 초기 상태 (Initial State) ──────────────────────────────────────────────
  isVideoPlaying: false,
  isVideoEnded: false,
  videoSrc: SAMPLE_VIDEO_PATH,

  // ─── 액션 구현부 (Actions Impl) ──────────────────────────────────────────────
  actions: {
    setVideoPlaying: (isVideoPlaying) => set({ isVideoPlaying }),
    setVideoEnded: (isVideoEnded) => set({ isVideoEnded }),
    setVideoSrc: (videoSrc) => set({ videoSrc }),

    setVideoBySampleMode: (isSample) =>
      set({
        videoSrc: isSample ? SAMPLE_VIDEO_PATH : decryptVideo(),
      }),
  },
}));

/* =============================================================================
 * 🎯 커스텀 구독 훅 (Custom Selector Hooks)
 * ============================================================================= */

/** 🎬 비디오 재생 여부(`isVideoPlaying`)만 구독합니다. */
export const useIsVideoPlaying = () =>
  useVideoStore((state) => state.isVideoPlaying);

/** 🏁 비디오 재생 완료 여부(`isVideoEnded`)만 구독합니다. */
export const useIsVideoEnded = () =>
  useVideoStore((state) => state.isVideoEnded);

/** 📹 비디오 소스 URL(`videoSrc`)만 구독합니다. */
export const useVideoSrc = () => useVideoStore((state) => state.videoSrc);

/** ⚡ 비디오 스토어의 변경 액션 객체(`actions`)만 가져옵니다. */
export const useVideoActions = () => useVideoStore((state) => state.actions);
