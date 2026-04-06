# ✈️ 여행 계획 앱

Next.js 16 + Supabase + PWA로 만든 여행 계획 관리 앱입니다.

## 🚀 기술 스택

- **Framework**: Next.js 16 (App Router, TypeScript)
- **DB**: Supabase (PostgreSQL) — 무료 티어
- **State**: Zustand
- **Form**: React Hook Form + Zod
- **PWA**: @ducanh2912/next-pwa
- **배포**: Vercel

---

## 📋 설정 순서

### 1단계 — Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 회원가입 → **New Project** 생성
2. **SQL Editor** → `supabase-schema.sql` 전체 붙여넣고 실행
3. **Project Settings → API** 에서 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2단계 — 로컬 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local에 Supabase 값 입력
npm run dev
```

### 3단계 — Vercel 배포

**방법 A: GitHub 연동 (권장)**
1. GitHub에 push
2. [vercel.com](https://vercel.com) → Import Repository
3. Environment Variables에 Supabase 키 입력
4. Deploy!

**방법 B: CLI**
```bash
npm i -g vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

---

## 📱 PWA 설치

배포 후 모바일/PC에서:
- **iOS**: 공유 버튼 → "홈 화면에 추가"
- **Android**: 주소창 설치 아이콘
- **PC Chrome**: 주소창 오른쪽 설치 아이콘

---

## 📁 구조

```
├── app/
│   ├── page.tsx                    # 여행 목록
│   ├── travel-plans/[id]/page.tsx  # 여행 상세 + 장소
│   └── api/travel-plans/...        # API Routes
├── components/
│   ├── ui/           (공통 UI)
│   ├── travel-plan/  (여행 계획)
│   └── travel-place/ (장소)
├── lib/
│   ├── supabase/client.ts
│   ├── stores/travel.ts
│   └── validations/travel.ts
├── supabase-schema.sql   ← Supabase에 실행
└── .env.local.example    ← 환경 변수 예시
```
