import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// .env.local 환경 변수 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// memories 암호화 때 사용한 동일한 비밀키 사용
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";

if (!SECRET_KEY) {
  console.error("❌ SECRET_KEY가 .env.local에 설정되지 않았습니다.");
  process.exit(1);
}

const inputVideoPath = path.join(process.cwd(), "public/videos/proposal.mp4");
const outputDir = path.join(process.cwd(), "src/data");
const outputPath = path.join(outputDir, "video-encrypted.ts");

if (!fs.existsSync(inputVideoPath)) {
  console.error(
    "❌ public/videos/proposal.mp4 파일이 없습니다. 경로를 확인해주세요!",
  );
  process.exit(1);
}

console.log("⏳ 영상을 Base64로 읽는 중...");
const videoBuffer = fs.readFileSync(inputVideoPath);
const base64Video = videoBuffer.toString("base64");
const videoDataUrl = `data:video/mp4;base64,${base64Video}`;

console.log(
  "🔒 동영상 암호화 진행 중... (파일 크기에 따라 몇 초 소요될 수 있습니다)",
);
const encrypted = CryptoJS.AES.encrypt(videoDataUrl, SECRET_KEY).toString();

const fileContent = `// ⚠️ 자동 생성된 암호화 영상 파일입니다. 직접 수정하지 마세요.
export const ENCRYPTED_PROPOSAL_VIDEO = "${encrypted}";
`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, fileContent, "utf-8");
console.log("✅ src/data/video-encrypted.ts 동영상 암호화 파일 생성 완료!");
