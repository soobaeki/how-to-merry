import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 1. 최상단에서 환경 변수 먼저 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  console.log("🔒 원본 데이터 암호화 시작...");

  // 1. memories.ts 파일 존재 여부 확인
  const memoriesPath = path.join(process.cwd(), "src", "data", "memories.ts");

  if (!fs.existsSync(memoriesPath)) {
    console.log(
      "⚠️ src/data/memories.ts 파일이 없습니다. (CI/CD 배포 환경) 암호화를 건너뜁니다.",
    );
    return; // 에러를 내지 않고 정상 종료
  }

  if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
    console.error(
      "❌ .env.local에 NEXT_PUBLIC_SECRET_KEY가 설정되지 않았습니다.",
    );
    process.exit(1);
  }

  // 2. 동적 import로 호이스팅 문제 완벽 방지 (프로젝트 파일 구조에 맞게 경로 확인)
  const { memories } = await import("../src/data/memories");
  const { encryptData } = await import("../src/libs/crypto");

  // 3. 데이터 JSON 변환 및 암호화 실행
  const jsonString = JSON.stringify(memories);
  const encryptedBase64 = await encryptData(jsonString);

  // 4. 출력 파일 내용 작성
  const fileContent = `// ⚠️ 자동 생성된 파일입니다. 직접 수정하지 마세요.
  export const TOTAL_CHAPTER_COUNT = ${memories.length};
export const ENCRYPTED_PROPOSAL_DATA = "${encryptedBase64}";
`;

  // 5. 저장 경로 지정 (src/data 에 저장 시 "src", "data" 로 변경)
  const outputPath = path.join(
    process.cwd(),
    "src",
    "data",
    "data-encrypted.ts",
  );

  // 저장될 폴더가 없으면 자동 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, fileContent, "utf-8");

  console.log("✅ data-encrypted.ts 생성 완료!");
}

run().catch((err) => {
  console.error("❌ 암호화 오류:", err);
  process.exit(1);
});
