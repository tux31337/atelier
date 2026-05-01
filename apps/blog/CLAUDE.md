# apps/blog

Atelier 워크스페이스의 첫 번째 앱. Next.js 16 App Router + React 19로 SSG 기반 블로그를 만든다.

## Owns

- 글 목록·상세·홈 페이지의 라우팅과 렌더 (`app/`)
- MDX 콘텐츠 파싱·정렬·읽기 시간 계산 (`lib/posts.ts`)
- MDX → React 매핑 한 곳에 집중 (`components/mdx/index.tsx`)
- 토큰과 Tailwind v4 CSS-first 설정 (`app/globals.css` 의 `@theme inline`)

## Common changes

- **새 글 추가**: `content/blog/{slug}.mdx` 파일 하나만 만든다. frontmatter 필드는 `types/post.ts` 의 `PostFrontmatter` 와 정확히 일치해야 한다.
- **MDX 렌더 스타일 수정**: `components/mdx/index.tsx` 에서 해당 태그 매핑만 손댄다. 글마다 따로 손대지 않는다.
- **토큰·색 변경**: `app/globals.css` 한 파일. 다른 곳에 색을 박지 않는다.

```bash
pnpm -F @atelier/blog dev
pnpm -F @atelier/blog build
pnpm -F @atelier/blog typecheck
```

## Why: 비자명한 규칙

- **Note:** Server Component 가 기본. `"use client"` 는 상호작용·브라우저 API·로컬 상태가 실제로 필요할 때만 붙인다.
- **`generateStaticParams` 로 빌드 시 모든 slug 를 생성** → 콘텐츠 추가는 곧 코드 변경. CMS 가 아니다.
- **frontmatter 는 `PostFrontmatter` 로 단순 캐스팅**. 런타임 검증 없음. 새 글의 필드 누락은 빌드가 잡지 못하니 추가 시 직접 확인.
- **다크 테마가 root layout 에 고정** (`app/layout.tsx` 의 `<html className="dark">`). 토글이 필요해지면 별도 변경으로 분리한다.
- **`packages/*` 는 아직 없다**. 두 번째 앱이 등장하기 전까지 공통화하지 말고 이 앱 안에 둔다 — `docs/ADR.md` 의 "두 번째 사용처" 원칙.

## Dependencies / See also

- 루트 가드레일: [`../../CLAUDE.md`](../../CLAUDE.md), [`../../AGENTS.md`](../../AGENTS.md), [`../../docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md), [`../../docs/ADR.md`](../../docs/ADR.md)
- 워크스페이스 메타: [`../../pnpm-workspace.yaml`](../../pnpm-workspace.yaml), 루트 `package.json`
- 외부 라이브러리: `next-mdx-remote`, `gray-matter`, `shadcn/ui`, `next/font/google`
