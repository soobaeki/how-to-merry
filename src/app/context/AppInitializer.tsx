"use client";

import { useDataStore } from "@/stores/useDataStore";
import { useEffect } from "react";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoading = useDataStore((state) => state.isLoading);
  const isError = useDataStore((state) => state.isError);
  const fetchAndDecryptMemories = useDataStore(
    (state) => state.actions.fetchAndDecryptMemories,
  );

  useEffect(() => {
    // 🎯 추후 BGM이나 Video 등의 전역 초기화 로직이 추가되면 여기서 함께 실행
    fetchAndDecryptMemories();
  }, [fetchAndDecryptMemories]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        데이터를 불러오는 데 실패했습니다. 비밀키(.env.local)를 확인해 주세요.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-lg font-medium text-pink-500">
          소중한 데이터를 불러오는 중... ❤️
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
