"use client";

import SecretLock from "@/components/auth/SecretLock";
import Hero from "@/components/landing/Hero";
import { useState } from "react";

/**
 * -----------------------------------------------------------------------------
 * 🏠 메인 랜딩 페이지 (Home)
 * -----------------------------------------------------------------------------
 */
export default function Home() {
  // ─── Local State ────────────────────────────────────────────────────────────
  // 잠금 모달 노출 여부 (초기 진입 시 기본 노출)
  const [showModal, setShowModal] = useState(true);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  /** 🔓 비밀번호 인증 성공 또는 샘플 선택 시 모달을 닫는 콜백 */
  const handleUnlock = () => {
    setShowModal(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* 🔒 잠금 인증 모달 (SecretLock 내부에서 Zustand 스토어 데이터 일괄 업데이트) */}
      {showModal && (
        <SecretLock
          onUnlock={handleUnlock}
          correctPassword={process.env.NEXT_PUBLIC_CORRECT_PASSWORD || ""}
        />
      )}

      {/* 🌟 메인 랜딩 히어로 섹션 */}
      <Hero />
    </main>
  );
}
