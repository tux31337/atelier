# apps/truvis

`apps/truvis`는 Atelier 워크스페이스의 두 번째 콘텐츠 사이트 자리다. 현재는 빈 랜딩 한 화면만 있는 자리표시 앱이며, 존재 이유는 `packages/ui`와 `packages/tailwind-config`처럼 둘 이상의 앱에서 실제로 공유되는 패키지를 검증하는 두 번째 사용처가 되는 것이다.

이 문서는 앱 전용 보조 문서다. 저장소 전체 규칙은 `../../AGENTS.md`와 `../../CLAUDE.md`를 따른다.

## 소유 영역

- `app/`: 라우트와 렌더링.
- `app/globals.css`: Tailwind v4와 `packages/tailwind-config` 공유 토큰 import.

## 현재 범위

- 랜딩 한 화면(`app/page.tsx`)과 root layout만 있다.
- 콘텐츠 처리, MDX, shadcn 같은 의존성은 들이지 않는다. 공통 UI는 `packages/ui`를 통해 받는다.
- dev 포트는 3001이다. blog(3000)와 동시에 띄울 수 있다.

## 검증

```bash
pnpm -F @atelier/truvis lint
pnpm -F @atelier/truvis typecheck
pnpm -F @atelier/truvis build
pnpm -F @atelier/truvis dev
```

루트 별칭(`pnpm lint`, `pnpm typecheck`, `pnpm build`)도 동작하도록 유지한다.

## 메모

- Server Component가 기본이다. `"use client"`는 정말 필요할 때만 붙인다.
- Truvis는 공유 패키지의 두 번째 사용처다. 새 공통화는 blog와 truvis 양쪽에서 실제 반복이 보일 때만 진행한다.
