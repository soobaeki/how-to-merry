# 💍 Our Special Story - Proposal Web Service

> 사랑하는 연인을 위해 제작한 개인 맞춤형 디지털 프러포즈 웹사이트입니다.  
> 함께한 추억을 차곡차곡 담아 둘만의 특별한 순간을 기록하고 전달합니다.

---

## ✨ 주요 기능 (Key Features)

- 📖 **Interactive Chapter**: 둘만의 소중한 추억과 에피소드를 챕터별로 확인
- 🔒 **End-to-End Data Security**: 소중한 개인 데이터(편지, 사진, 영상)를 AES 기술로 암호화하여 원본 노출 방지
- 🎬 **Media Streaming**: 추억이 담긴 비디오 및 사진을 매끄럽게 감상할 수 있는 미디어 플레이어
- 📱 **Fully Responsive**: 모바일, 태블릿, PC 등 모든 기기에 최적화된 반응형 디자인

---

## 🛠 기술 스택 (Tech Stack)

| 구분           | 기술                              |
| :------------- | :-------------------------------- |
| **Framework**  | Next.js (App Router, SSG)         |
| **Language**   | TypeScript                        |
| **Styling**    | Tailwind CSS                      |
| **Security**   | Crypto-js                         |
| **Deployment** | GitHub Pages (via GitHub Actions) |

---

## 🔒 보안 및 배포 구조 (Security & Deployment)

1. **데이터 암호화**: 로컬 환경에서 원본 데이터를 암호화(`encrypted-memories.ts`)하여 배포에 활용합니다.
2. **클라이언트 복호화**: 런타임 시 환경 변수(`NEXT_PUBLIC_SECRET_KEY`)를 통해 정당한 사용자에게만 복호화된 스토리를 제공합니다.
3. **자동 배포 Pipeline**: GitHub Actions를 이용하여 main 브랜치 push 시 정적 사이트로 자동 빌드 및 배포됩니다.
