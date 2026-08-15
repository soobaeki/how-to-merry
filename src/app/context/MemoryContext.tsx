// src/context/MemoryContext.tsx
"use client";

import { ENCRYPTED_MEMORIES_DATA } from "@/data/memories-encrypted";
import { decryptData } from "@/libs/crypto";
import { Memory } from "@/types/memory";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const MemoryContext = createContext<Memory[] | null>(null);

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Memory[] | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // 앱 진입 시 딱 1회만 복호화 수행
    decryptData<Memory[]>(ENCRYPTED_MEMORIES_DATA)
      .then((decrypted) => {
        setData(decrypted);
      })
      .catch((err) => {
        console.error("❌ 복호화 실패:", err);
        setIsError(true);
      });
  }, []);

  // 에러 발생 시
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        추억을 불러오는 데 실패했습니다. 비밀키(.env.local)를 확인해 주세요.
      </div>
    );
  }

  // 복호화 완료 전 로딩 스피너 (스포일러 완벽 방지)
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-pink-500 animate-pulse">
          소중한 추억을 불러오는 중... ❤️
        </p>
      </div>
    );
  }

  return (
    <MemoryContext.Provider value={data}>{children}</MemoryContext.Provider>
  );
}

// 개별 컴포넌트/페이지에서 사용할 커스텀 훅
export const useMemories = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error(
      "useMemories는 MemoryProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return context;
};
