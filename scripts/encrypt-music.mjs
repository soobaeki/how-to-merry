import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// .env.local 환경 변수 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// video/memories 암호화 때 사용한 동일한 비밀키 사용
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";

if (!SECRET_KEY) {
  console.error("❌ SECRET_KEY가 .env.local에 설정되지 않았습니다.");
  process.exit(1);
}

const inputMusicPath = path.join(process.cwd(), "public/music/bgm.mp3");
const outputDir = path.join(process.cwd(), "src/data");
const outputPath = path.join(outputDir, "music-encrypted.ts");

if (!fs.existsSync(inputMusicPath)) {
  console.error(
    "❌ public/music/bgm.mp3 파일이 없습니다. 경로를 확인해주세요!",
  );
  process.exit(1);
}

console.log("⏳ 음악을 Base64로 읽는 중...");
const musicBuffer = fs.readFileSync(inputMusicPath);
const base64Music = musicBuffer.toString("base64");
const musicDataUrl = `data:audio/mp3;base64,${base64Music}`;

console.log("🔒 음악 암호화 진행 중...");
const encrypted = CryptoJS.AES.encrypt(musicDataUrl, SECRET_KEY).toString();

const fileContent = `// ⚠️ 자동 생성된 암호화 음악 파일입니다. 직접 수정하지 마세요.
export const ENCRYPTED_PROPOSAL_MUSIC = "${encrypted}";
`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, fileContent, "utf-8");
console.log("✅ src/data/music-encrypted.ts 음악 암호화 파일 생성 완료!");
