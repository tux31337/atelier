# apps/blog

`apps/blog`는 Atelier 블로그 애플리케이션을 소유한다. Next.js 16 App Router, React 19, Tailwind CSS v4, MDX 콘텐츠 파일, Vitest 기반 콘텐츠 유틸 테스트를 사용한다.

이 문서는 앱 전용 보조 문서다. 저장소 전체 규칙은 `../../AGENTS.md`와 `../../CLAUDE.md`를 따른다.

## 소유 영역

- `app/`: 라우트와 렌더링.
- `components/layout`: 블로그 전용 레이아웃 컴포넌트.
- `components/mdx`: MDX 컴포넌트 매핑.
- `components/ui`: 실제 공유 패키지가 생기기 전까지의 블로그 UI 컴포넌트.
- `content/blog`: MDX 콘텐츠.
- `lib/posts.ts`: 콘텐츠 파싱, 정렬, 읽기 시간 계산.
- `types/post.ts`: 글 타입과 frontmatter schema.
- `app/globals.css`: Tailwind v4 토큰과 앱 전역 스타일.

## 자주 하는 변경

- **글 추가**: `content/blog/{slug}.mdx`를 만들고 frontmatter를 `types/post.ts`와 맞춘다.
- **MDX 렌더링 변경**: `components/mdx/index.tsx`를 수정한다. 글마다 렌더러를 따로 만들지 않는다.
- **콘텐츠 파싱 변경**: `lib/posts.ts`를 수정하고 `lib/posts.test.ts`를 갱신한다.
- **토큰이나 앱 전역 스타일 변경**: `app/globals.css`를 수정한다. Tailwind config 파일을 추가하지 않는다.
- **클라이언트 동작 추가**: 상호작용, 브라우저 API, 로컬 상태가 필요할 때만 `"use client"`를 붙인다.

## 검증

저장소 루트에서 다음 명령을 우선 사용한다.

```bash
pnpm -F @atelier/blog typecheck
pnpm -F @atelier/blog test
pnpm -F @atelier/blog lint
pnpm -F @atelier/blog build
```

루트 별칭도 동작하도록 유지한다.

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

Windows에서 PowerShell 또는 Corepack 권한 때문에 `pnpm`이 막힐 수 있다. 그 경우 `pnpm.cmd`를 사용하거나 막힌 이유를 문서화한다.

## 메모

- Server Component가 기본이다.
- 정적 MDX slug 페이지가 필요하면 `generateStaticParams`를 사용한다.
- frontmatter 검증은 zod schema를 통해 명확히 실패해야 한다.
- 현재 root layout은 `<html>`에 dark mode를 고정한다. theme toggle은 별도 기능으로 다룬다.
- 실제 두 번째 사용처가 생기기 전에는 `packages/*` 추상화를 만들지 않는다.
