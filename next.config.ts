import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export", // 🎯 정적 HTML 내보내기 설정
  images: {
    unoptimized: true, // GitHub Pages는 Next.js 기본 이미지 최적화 서버를 지원하지 않으므로 설정 필요
  },
};

export default nextConfig;
