# 배민스토어 스타일 이커머스 프로젝트

Next.js와 TypeScript를 사용한 이커머스 웹 애플리케이션입니다.

## 기술 스택

- **프론트엔드**: Next.js, TypeScript, Tailwind CSS, React Query
- **상태 관리**: Zustand
- **API 통신**: Axios
- **폼 관리**: React Hook Form, Zod
- **UI 컴포넌트**: Shadcn UI
- **인증**: NextAuth.js
- **스타일링**: Tailwind CSS, CSS Modules

## 프로젝트 구조

```
src/
├── app/                    # App Router 기반 페이지
│   ├── (auth)/             # 인증 관련 라우트 그룹
│   │   ├── login/          # 로그인 페이지
│   │   ├── register/       # 회원가입 페이지
│   │   └── reset-password/ # 비밀번호 재설정 페이지
│   ├── (main)/             # 메인 라우트 그룹
│   │   ├── page.tsx        # 홈페이지
│   │   ├── category/       # 카테고리 페이지
│   │   ├── product/        # 상품 상세 페이지
│   │   ├── search/         # 검색 결과 페이지
│   │   └── cart/           # 장바구니 페이지
│   ├── (user)/             # 사용자 관련 라우트 그룹
│   │   ├── profile/        # 프로필 페이지
│   │   ├── orders/         # 주문 내역 페이지
│   │   └── addresses/      # 주소 관리 페이지
│   ├── (checkout)/         # 결제 관련 라우트 그룹
│   │   ├── payment/        # 결제 페이지
│   │   └── complete/       # 결제 완료 페이지
│   └── layout.tsx          # 루트 레이아웃
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                 # UI 기본 컴포넌트
│   ├── auth/               # 인증 관련 컴포넌트
│   ├── cart/               # 장바구니 관련 컴포넌트
│   ├── product/            # 상품 관련 컴포넌트
│   ├── order/              # 주문 관련 컴포넌트
│   ├── user/               # 사용자 관련 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   └── common/             # 공통 컴포넌트
├── hooks/                  # 커스텀 훅
│   ├── useAuth.ts          # 인증 관련 훅
│   ├── useCart.ts          # 장바구니 관련 훅
│   ├── useProduct.ts       # 상품 관련 훅
│   └── useOrder.ts         # 주문 관련 훅
├── lib/                    # 유틸리티 함수 및 설정
│   ├── api.ts              # API 클라이언트
│   ├── utils.ts            # 유틸리티 함수
│   ├── constants.ts        # 상수 정의
│   └── validators.ts       # 유효성 검사 함수
├── store/                  # 상태 관리
│   ├── authStore.ts        # 인증 상태 관리
│   ├── cartStore.ts        # 장바구니 상태 관리
│   └── uiStore.ts          # UI 상태 관리
└── types/                  # 타입 정의
    ├── user.ts             # 사용자 관련 타입
    ├── product.ts          # 상품 관련 타입
    ├── order.ts            # 주문 관련 타입
    └── api.ts              # API 응답 타입
```

## 주요 기능

- 회원 가입 및 로그인 (소셜 로그인 포함)
- 상품 카테고리 및 검색
- 상품 상세 정보 조회
- 장바구니 기능
- 주문 및 결제 처리
- 주문 내역 조회
- 사용자 프로필 및 주소 관리

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_API_URL=백엔드_API_URL
NEXTAUTH_SECRET=인증_시크릿_키
NEXTAUTH_URL=프론트엔드_URL
KAKAO_CLIENT_ID=카카오_클라이언트_ID
KAKAO_CLIENT_SECRET=카카오_클라이언트_시크릿
NAVER_CLIENT_ID=네이버_클라이언트_ID
NAVER_CLIENT_SECRET=네이버_클라이언트_시크릿
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
