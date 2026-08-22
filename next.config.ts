import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";
const repositoryName = "how-to-merry"; // ⚠️ 본인의 GitHub 레포지토리 이름으로 정확히 변경해 주세요!
const basePath = isProd ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export", // 🎯 정적 HTML 내보내기 설정
  basePath: basePath, // 프로덕션 빌드 시 경로 맞춤
  assetPrefix: basePath,
  images: {
    unoptimized: true, // GitHub Pages는 Next.js 기본 이미지 최적화 서버를 지원하지 않으므로 설정 필요
  },
  env: {
    // 🎯 클라이언트 어디서든 쓸 수 있게 환경변수로 주입
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
