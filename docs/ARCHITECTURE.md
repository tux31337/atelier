# 아키텍처

## 모노레포 구조

```
atelier/
├── apps/
│   └── blog/                    # 블로그 앱 (현재 유일한 앱)
│       ├── app/                 # Next.js App Router
│       │   ├── layout.tsx
│       │   ├── page.tsx         # 글 목록
│       │   ├── posts/[slug]/    # 글 상세
│       │   ├── tags/[tag]/      # 태그별 목록
│       │   ├── about/           # 어바웃
│       │   ├── rss.xml/         # RSS route handler
│       │   └── globals.css
│       ├── components/          # 블로그 전용 컴포넌트
│       ├── content/posts/       # MDX 글 (frontmatter + 본문)
│       ├── lib/                 # 콘텐츠 파싱·날짜 포매팅 등 유틸
│       ├── public/              # 정적 자산
│       ├── next.config.ts
│       ├── postcss.config.mjs
│       ├── eslint.config.mjs
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                    # (현재 비어 있음 — 두 번째 사용처가 보일 때 분리)
│   ├── ui/                      # 시각적 빌딩 블록 (presentational only)
│   ├── tailwind-config/         # 토큰 + Tailwind v4 preset
│   ├── tsconfig/                # 공통 tsconfig base
│   ├── eslint-config/           # 공통 ESLint flat config
│   └── content/                 # MDX 파싱·메타 추출 유틸 (필요 시)
│
├── docs/                        # 가드레일 문서
├── scripts/                     # phase 실행 하네스
├── .claude/                     # Claude Code 슬래시 커맨드 + 훅 설정
├── pnpm-workspace.yaml
├── package.json                 # 워크스페이스 루트
├── CLAUDE.md
└── AGENTS.md
```

루트 `app/`/`public/`/`*.config.*`는 더 이상 존재하지 않는다. 모두 `apps/blog/`로 이동했다.

## 컴포넌트 패턴
- **기본은 Server Component.** App Router의 디폴트를 그대로 따른다. 데이터 페치·MDX 컴파일·메타 추출은 서버에서 끝낸다.
- **`"use client"`는 상호작용·브라우저 API·로컬 상태가 실제로 필요할 때만.** 다크/라이트 토글, 헤더 햄버거 같은 곳에 한정.
- **Composition over abstraction.** props를 잔뜩 받는 만능 컴포넌트보다, 작고 명확한 컴포넌트를 children으로 합성한다.
- **표현 계층(`packages/ui`)과 데이터/콘텐츠는 분리.** 추출 시점이 오면 `packages/ui`는 라우팅·콘텐츠 형식을 모르는 채로 작성한다.

## 데이터 흐름

```
content/posts/*.mdx
  └─ (build / request 시점) lib/posts.ts: frontmatter 파싱 + 정렬
        └─ Server Component (예: app/page.tsx, app/posts/[slug]/page.tsx)
              └─ 정적 생성된 HTML + 클라이언트 hydration (필요 부분만)
```

- 글 목록·상세는 SSG 기본. `generateStaticParams`로 빌드 시 모든 slug를 생성한다.
- RSS는 build 시 또는 route handler에서 모든 글의 frontmatter를 읽어 XML로 직렬화한다.
- 다크/라이트 토글 같은 로컬 상태만 클라이언트에 둔다.

## 상태 관리
- **서버 상태**: 콘텐츠 자체. 파일 시스템에서 읽어 Server Component가 렌더한다. 외부 API는 MVP 범위에서 없음.
- **클라이언트 상태**:
  - 테마(`light` | `dark` | `system`) — `localStorage` + 매칭 클래스. 1회성 토글 컴포넌트만.
  - 그 외 인터랙션이 늘어나면 `useState`/`useReducer`로 충분. 전역 상태 라이브러리는 도입하지 않는다.

## 스타일링
- **Tailwind v4 CSS-first.** `tailwind.config.{js,ts}` 없음. 토큰은 `apps/blog/app/globals.css`의 `@theme` 블록에 정의한다.
- 두 번째 앱이 등장해 토큰을 공유해야 할 시점에 `packages/tailwind-config`로 추출한다 (Tailwind v4의 CSS preset 형태).
- 글로벌 CSS는 리셋·테마 토큰·기본 타이포까지만. 페이지·컴포넌트별 셀렉터를 글로벌에 두지 않는다.

## 라우팅
- App Router 표준. `app/[segment]/page.tsx`.
- 동적 세그먼트는 `app/posts/[slug]/page.tsx`처럼 디렉터리로 표현.
- `generateMetadata`로 페이지별 메타를 채운다 — Next 16의 메타데이터 API는 학습 시점 기억과 다를 수 있으니 `node_modules/next/dist/docs/`를 먼저 확인한다.

## 빌드·배포 (현 시점 가정)
- 빌드: `pnpm -F blog build` (Turbopack 기본)
- 배포 대상은 미정. Vercel을 가정하고 작성하지만 정적 호스트로도 배포 가능하도록 SSG 위주로 짠다.
- 환경 변수가 생기면 `apps/blog/.env.local`에 두고 `.gitignore`된 상태를 유지한다.
