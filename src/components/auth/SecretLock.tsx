"use client";

import { useState } from "react";

import { sampleMemories } from "@/data/sample/sample-memories";
import { useDataActions, useDataStore } from "@/stores/useDataStore";
import { useMusicActions } from "@/stores/useMusicStore";
import { useVideoActions } from "@/stores/useVideoStore";

/**
 * -----------------------------------------------------------------------------
 * 🔒 SecretLock 컴포넌트 Props
 * -----------------------------------------------------------------------------
 */
interface SecretLockProps {
  /** 인증 성공 또는 샘플 선택 시 모달을 닫아주는 콜백 함수 */
  onUnlock: () => void;
  /** 검증할 비밀번호 정답 문자열 */
  correctPassword: string;
}

/**
 * -----------------------------------------------------------------------------
 * 🔒 비밀번호 입력 및 샘플 모드 전환 모달 (SecretLock)
 * -----------------------------------------------------------------------------
 */
export default function SecretLock({
  onUnlock,
  correctPassword,
}: SecretLockProps) {
  // ─── Local State ────────────────────────────────────────────────────────────
  const [inputAnswer, setInputAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ─── Custom Store Actions & Selectors ──────────────────────────────────────
  const decryptedMemories = useDataStore((state) => state.memories);
  const { setMemories, setIsSample } = useDataActions();
  const { setMusicBySampleMode, setMusicPlaying } = useMusicActions();
  const { setVideoBySampleMode } = useVideoActions();

  // ─── Handlers ───────────────────────────────────────────────────────────────
  /** 🔓 비밀번호 검증 실행 (실데이터 모드 인증 성공) */
  const handleVerify = () => {
    if (inputAnswer.trim() === correctPassword) {
      // 1) 추억 데이터 설정
      setIsSample(false);
      setMemories(decryptedMemories);

      // 2) BGM 설정 및 재생
      setMusicBySampleMode(false);
      setVideoBySampleMode(false);
      setMusicPlaying(true); // 🎯 명확한 액션 이름 적용

      // 3) 비디오 소스 설정 (복호화된 실제 영상)
      setVideoBySampleMode(false);

      // 4) 모달 닫기
      onUnlock();
    } else {
      setErrorMsg("비밀번호가 틀렸어요! 다시 입력해보세요 💖");
    }
  };

  /** 👁️ 샘플 데이터 보기 실행 (샘플 모드 전환) */
  const handleViewSample = () => {
    // 1) 샘플 추억 데이터 설정
    setIsSample(true);
    setMemories(sampleMemories);

    // 2) 샘플 BGM 설정 및 재생
    setMusicBySampleMode(true);
    setVideoBySampleMode(true);
    setMusicPlaying(true); // 🎯 명확한 액션 이름 적용

    // 3) 비디오 소스 설정 (샘플 영상)
    setVideoBySampleMode(true);

    // 4) 모달 닫기
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h2 className="mb-2 text-2xl font-bold">🔒 둘만의 소중한 공간</h2>
        <p className="mb-6 text-gray-600">
          Q. 우리가 처음 편지를 주고받은 날은 언제일까요?
        </p>

        <input
          type="text"
          placeholder="예: 19980104"
          value={inputAnswer}
          onChange={(e) => {
            setInputAnswer(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter") {
              e.preventDefault();
              handleVerify();
            }
          }}
          className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-center text-lg outline-none focus:ring-2 focus:ring-rose-400"
        />

        {errorMsg && <p className="mb-4 text-sm text-rose-500">{errorMsg}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleVerify}
            className="flex-1 cursor-pointer rounded-lg bg-rose-500 py-3 font-semibold text-white transition hover:bg-rose-600"
          >
            열람하기
          </button>
          <button
            type="button"
            onClick={handleViewSample}
            className="cursor-pointer rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-200"
          >
            샘플 보기
          </button>
        </div>
      </div>
    </div>
  );
}
