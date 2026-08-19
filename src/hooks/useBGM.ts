import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useRef } from "react";

/**
 * =============================================================================
 * 🎵 Custom Hook: useBGM
 * -----------------------------------------------------------------------------
 * 글로벌 음악 상태(useMusicStore)와 싱글톤 Audio 객체를 동기화합니다.
 * 브라우저의 비동기 play() / pause() 경합 상태(AbortError) 및
 * 자동 재생 제한(Autoplay Policy) 예외를 안전하게 핸들링합니다.
 *
 * @param src BGM 오디오 파일 경로 (기본값: "/music/bgm.mp3")
 * =============================================================================
 */
export function useBGM(src: string = "/music/bgm.mp3") {
  // Zustand 스토어에서 현재 음악 재생 여부 구독
  const isMusicPlaying = useMusicStore((state) => state.isMusicPlaying);

  // 브라우저 단일 Audio 인스턴스 참조를 위한 Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * ---------------------------------------------------------------------------
   * 1. [Audio 객체 생성 및 메모리 해제]
   * 브라우저 마운트 시 single Audio 인스턴스를 생성하고 루프 설정을 부여합니다.
   * ---------------------------------------------------------------------------
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 싱글톤 Audio 인스턴스 초기화
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;

    // 클린업: 훅 언마운트 시 오디오 정지 및 객체 해제
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [src]);

  /**
   * ---------------------------------------------------------------------------
   * 2. [오디오 재생 / 일시정지 제어 및 예외 처리]
   * isPlaying 상태 변경을 감지하여 안전하게 재생 상태를 전환합니다.
   * ---------------------------------------------------------------------------
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicPlaying) {
      // play()는 Promise를 반환하는 비동기 함수입니다.
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error: Error) => {
          // 💡 play() 처리 중 빠르게 pause()가 호출되어 발생하는 AbortError 또는
          //    사용자 인터랙션 전 자동재생이 차단되는 NotAllowedError 무시
          if (error.name === "AbortError" || error.name === "NotAllowedError") {
            return;
          }
          console.error("BGM 재생 도중 예상치 못한 오류 발생:", error);
        });
      }
    } else {
      audio.pause();
    }
  }, [isMusicPlaying]);
}
