import { ENCRYPTED_PROPOSAL_VIDEO } from "@/data/proposal-video";
import CryptoJS from "crypto-js";

// AES-GCM 256 비트 암호화/복호화 유틸리티
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";

if (!ENCRYPTION_KEY) {
  throw new Error("❌ NEXT_PUBLIC_SECRET_KEY 환경 변수가 설정되지 않았습니다!");
}

// 🔑 키를 동적으로 가져오는 유틸리티 (호이스팅 에러 방지)
function getSecretKey(): string {
  const key = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (!key) {
    throw new Error(
      "❌ NEXT_PUBLIC_SECRET_KEY 환경 변수가 설정되지 않았습니다!",
    );
  }
  return key;
}

async function getKey() {
  const secret = getSecretKey();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret.padEnd(32, "0").slice(0, 32)),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("2026-03-07-secret-key"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// 텍스트 암호화
export async function encryptData(text: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // 👈 스택 오버플로우 방지를 위한 안전한 Base64 변환
  let binary = "";
  for (let i = 0; i < combined.byteLength; i++) {
    binary += String.fromCharCode(combined[i]);
  }

  return btoa(binary);
}

// 암호문 복호화 (앱 실행 시 사용)
export async function decryptData<T>(encryptedBase64: string): Promise<T> {
  const binary = atob(encryptedBase64);
  const combined = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    combined[i] = binary.charCodeAt(i);
  }

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const key = await getKey();

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  const jsonString = new TextDecoder().decode(decrypted);
  return JSON.parse(jsonString) as T;
}

// 동영상 복호화
export function decryptProposalVideo(secretKey: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ENCRYPTED_PROPOSAL_VIDEO, secretKey);
    const decryptedUrl = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedUrl || null;
  } catch (error) {
    console.error("영상 복호화 실패:", error);
    return null;
  }
}
