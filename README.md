# 💍 Our Special Story - Proposal Web Service

> 사랑하는 연인을 위해 제작한 개인 맞춤형 디지털 프러포즈 웹사이트입니다.  
> 함께한 추억을 차곡차곡 담아 둘만의 특별한 순간을 기록하고 전달합니다.

---

<br>

## ✨ 주요 기능 (Key Features)

- 📖 **Interactive Chapter**: 둘만의 소중한 추억과 에피소드를 챕터별로 확인하는 여정 지도
- 🎵 **Global BGM & Seamless Media**: 배경음악(BGM)과 프러포즈 비디오 간의 매끄러운 오디오 전환 및 브라우저 자동재생 정책(Autoplay Policy) 예외 처리
- 🔒 **End-to-End Data Security**: 소중한 개인 데이터(질문지, 영상)를 AES 기술로 암호화하여 원본 노출 방지
- 🎬 **Encrypted Video Player**: 암호화된 비디오 데이터를 안전하게 스트리밍/재생하는 커스텀 플레이어
- 📱 **Fully Responsive**: 모바일, 태블릿, PC 등 모든 기기에 최적화된 반응형 디자인

---

<br>

## 🛠 기술 스택 (Tech Stack)

| 구분                   | 기술 스택                                                                 | 세부 사항                                                                                                                            |
| :--------------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Core**               | Next.js 16<br>React 19<br>TypeScript 5                                    | App Router, Static Export (`output: 'export'`) 적용<br>React Compiler 적용을 통한 자동 렌더링 최적화<br>Strict Type Safety 보장      |
| **State Management**   | Zustand 5                                                                 | **전역 상태 관리 (BGM / Video 재생 상태 및 여정 진행도 관리)**<br>비동기 미디어 재생 예외 처리 및 브라우저 Autoplay Policy 대응      |
| **Styling & UI**       | Tailwind CSS v4<br>Framer Motion<br>Lucide React<br>clsx / tailwind-merge | `@tailwindcss/postcss` 기반 인터랙티브 UI<br>감성적인 모션 애니메이션 구현<br>경량화 아이콘 시스템 구성<br>조건부 클래스명 병합 처리 |
| **Security & Tooling** | Crypto-js<br>tsx<br>dotenv                                                | AES-256 클라이언트 측 데이터 복호화<br>TypeScript 기반 데이터 암호화 스크립트 직접 실행<br>로컬 환경 변수 세팅 및 관리               |
| **Deployment**         | GitHub Pages                                                              | GitHub Actions 기반 CI/CD 자동 배포 파이프라인 구축                                                                                  |

---

<br>

## 🔒 보안 및 배포 구조 (Security & Deployment)

1. **데이터 암호화**: 로컬 환경에서 텍스트 데이터(`data-encrypted.ts`), 영상(`video-encrypted.ts`), 음악(`music-encrypted.ts`)을 AES-256 알고리즘으로 암호화하여 배포에 활용합니다.
2. **클라이언트 복호화**: 런타임 시 환경 변수(`NEXT_PUBLIC_SECRET_KEY`)를 통해 정당한 사용자에게만 복호화된 스토리를 제공합니다.
3. **자동 배포 Pipeline**: GitHub Actions를 이용하여 main 브랜치 push 시 정적 사이트로 자동 빌드 및 배포됩니다.

---

<br>

## 💻 개발자 가이드 (Scripts & Workflow)

### 1. 환경 변수 설정

로컬 개발 환경(`localhost`)에서 복호화를 테스트하려면 프로젝트 최상단 루트에 `.env.local` 파일을 생성하고 비밀키를 설정합니다.

```env
NEXT_PUBLIC_SECRET_KEY=your_secret_key_here
```

### 2. 데이터 암호화 스크립트 (Data Encryption)

데이터, 영상, 음악을 암호화하여 (`***-encrypted.ts`)을 새롭게 갱신할 때 사용합니다.

```bash

# 1. 텍스트 데이터 암호화

npm run encrypt

# 2. 비디오 데이터 암호화

npm run encrypt:video

# 2. 비디오 데이터 암호화

npm run encrypt:music

# 4. 전체 데이터(텍스트 + 비디오) 일괄 암호화

npm run encrypt:all
```

### 3. 로컬 실행 및 테스트

```bash

# 개발 서버 실행

npm run dev

# 빌드 및 정적 내보내기 테스트

npm run build
```
