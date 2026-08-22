# 💍 Our Special Story - Proposal Web Service

[![Live Demo](https://img.shields.io/badge/Live_Demo-FF69B4?style=for-the-badge&logo=github&logoColor=white)](https://soobaeki.github.io/how-to-merry/)

> 사랑하는 연인을 위해 제작한 프러포즈 웹사이트입니다.  
> 함께한 추억을 질문으로 만들어 둘만의 특별한 순간을 기록하고 기억합니다.

---

<br>

## ✨ 주요 기능 (Key Features)

- 📖 **Chapter**: 둘만의 소중한 추억과 에피소드를 표현한 챕터별 지도
- 🎵 **BGM & Media**: 배경음악(BGM)과 프러포즈 비디오 및 브라우저 자동재생 정책(Autoplay Policy)
- 🔒 **End-to-End Data Security**: 추억 데이터, 배경음악, 프러포즈 비디오를 AES 기술로 암호화하여 원본 노출 방지
- 📱 **Responsive**: 모바일, 태블릿, PC 등 모든 기기에 최적화된 반응형 디자인

---

<br>

## 🛠 기술 스택 (Tech Stack)

| 구분                   | 기술 스택                                                                 | 세부 사항                                                                                                                       |
| :--------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------ |
| **Core**               | Next.js 16<br>React 19<br>TypeScript 5                                    | App Router, Static Export (`output: 'export'`) 적용<br>React Compiler 적용을 통한 자동 렌더링 최적화<br>Strict Type Safety 보장 |
| **State Management**   | Zustand 5                                                                 | **전역 상태 관리 (데이터, 배경음악, 프러포즈 비디오)**<br>브라우저 Autoplay Policy 대응                                         |
| **Styling & UI**       | Tailwind CSS v4<br>Framer Motion<br>Lucide React<br>clsx / tailwind-merge | `@tailwindcss/postcss` 기반 인터랙티브 UI<br>모션 애니메이션 구현<br>경량화 아이콘 구성<br>조건부 클래스명 병합 처리            |
| **Security & Tooling** | Crypto-js<br>dotenv                                                       | AES-256 클라이언트 측 데이터 복호화<br>로컬 환경 변수 세팅 및 관리                                                              |
| **Deployment**         | GitHub Pages                                                              | GitHub Actions 기반 CI/CD 자동 배포 파이프라인 구축                                                                             |

---

<br>

## 🔒 보안 및 배포 구조 (Security & Deployment)

1. **데이터 암호화**: 로컬 환경에서 텍스트 데이터(`data-encrypted.ts`), 영상(`video-encrypted.ts`), 음악(`music-encrypted.ts`)을 AES-256 알고리즘으로 암호화합니다.
2. **클라이언트 복호화**: 런타임 시 환경 변수(`NEXT_PUBLIC_SECRET_KEY`)를 통해 정당한 사용자에게만 복호화된 데이터를 제공합니다.
3. **자동 배포 Pipeline**: GitHub Actions를 이용하여 main 브랜치 push 시 정적 사이트로 자동 빌드 및 배포됩니다.

---

<br>

## 💻 개발자 가이드 (Scripts & Workflow)

### 1. 환경 변수 설정

로컬 개발 환경(`localhost`)에서 복호화를 테스트하려면 프로젝트 최상단 루트에 `.env.local` 파일을 생성하고 비밀키를 설정합니다.

```env
NEXT_PUBLIC_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CORRECT_PASSWORD=your_password_here
```

```
Github 설정 경로
설정 경로: GitHub Repository ➔ Settings ➔ Secrets and variables (좌측 메뉴) ➔ Actions ➔ Repository secrets ➔ New repository secret 클릭
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
