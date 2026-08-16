import { ENCRYPTED_PROPOSAL_MUSIC } from "@/data/music-encrypted";
import { ENCRYPTED_PROPOSAL_VIDEO } from "@/data/video-encrypted";
import CryptoJS from "crypto-js";

/**
 * 🔑 비밀키를 안전하게 가져오는 유틸리티 (환경변수 누락 시 런타임 에러)
 */
function getSecretKey(): string {
  const key = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (!key) {
    throw new Error(
      "❌ NEXT_PUBLIC_SECRET_KEY 환경 변수가 설정되지 않았습니다!",
    );
  }
  return key;
}

/**
 * 🔐 Web Crypto API용 AES-GCM 256비트 키 생성
 */
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

/**
 * 🔒 텍스트/JSON 데이터 암호화 (Web Crypto API)
 */
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

  let binary = "";
  for (let i = 0; i < combined.byteLength; i++) {
    binary += String.fromCharCode(combined[i]);
  }

  return btoa(binary);
}

/**
 * 🔓 암호화된 텍스트/JSON 데이터 복호화 (Web Crypto API)
 */
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

/**
 * 🎬 동영상 데이터 복호화 (CryptoJS)
 */
export function decryptVideo(customKey?: string): string | null {
  try {
    const key = customKey || getSecretKey();
    const bytes = CryptoJS.AES.decrypt(ENCRYPTED_PROPOSAL_VIDEO, key);
    const decryptedUrl = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedUrl || null;
  } catch (error) {
    console.error("❌ 영상 복호화 실패:", error);
    return null;
  }
}

/**
 * 🎵 배경음악(BGM) 데이터 복호화 (CryptoJS)
 */
export function decryptMusic(customKey?: string): string | null {
  try {
    const key = customKey || getSecretKey();
    const bytes = CryptoJS.AES.decrypt(ENCRYPTED_PROPOSAL_MUSIC, key);
    const decryptedUrl = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedUrl || null;
  } catch (error) {
    console.error("❌ 음악 복호화 실패:", error);
    return null;
  }
}
