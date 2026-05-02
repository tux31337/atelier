# 아키텍처

## 방향

Atelier는 블로그를 첫 제품 앱으로 두고, 이후 앱을 같은 방식으로 추가할 수 있는 프론트엔드 모노레포입니다. 현재는 `apps/blog` 하나가 있는 상태이며, 공유 패키지는 아직 만들지 않았습니다.

원칙은 작게 시작하고, 실제 반복이 보일 때만 분리하는 것입니다. 처음부터 모든 공통 패키지를 채우기보다 앱 하나가 안정적으로 동작하고 배포 가능한 구조를 만든 뒤, 필요한 부분만 `packages/*`로 올립니다.

## 현재 구조

```txt
atelier/
  apps/
    blog/
      app/              # Next.js App Router
      components/       # 블로그 앱 전용 컴포넌트
      content/          # MDX 콘텐츠
      lib/              # 콘텐츠 파싱 등 앱 유틸리티
      public/           # 정적 파일
      types/            # 앱 타입
      next.config.ts
      package.json

  docs/
  scripts/
  package.json
  pnpm-workspace.yaml
```

루트 앱 엔트리포인트는 남겨두지 않습니다. 제품 코드는 `apps/blog`에 있고, 루트는 워크스페이스 스크립트와 문서, 공통 설정의 출발점 역할만 합니다.

## 목표 구조

```txt
apps/
  blog/
  future-app/

packages/
  ui/
  tsconfig/
  eslint-config/
  tailwind-config/
  content/
```

공유 패키지 경계는 다음 기준을 따릅니다.

- `packages/ui`: presentation-focused 컴포넌트와 레이아웃 원시 요소만 둡니다.
- `packages/tsconfig`: 앱과 패키지가 공유할 TypeScript base config를 둡니다.
- `packages/eslint-config`: 공통 ESLint flat config를 둡니다.
- `packages/tailwind-config`: Tailwind v4 토큰이나 프리셋이 여러 앱에서 반복될 때 분리합니다.
- `packages/content`: 콘텐츠 파싱이나 콘텐츠 도메인 유틸이 블로그 밖에서도 필요해질 때 분리합니다.

앱은 패키지를 import할 수 있지만, 패키지는 앱을 import하지 않습니다.

## 앱 아키텍처

블로그는 Next.js 16 App Router 기반입니다.

- 기본은 Server Component입니다.
- `"use client"`는 상호작용, 브라우저 API, 로컬 상태가 필요한 컴포넌트에만 붙입니다.
- 콘텐츠는 현재 `apps/blog/content/blog/*.mdx`에 둡니다.
- 콘텐츠 파싱은 `apps/blog/lib/posts.ts`에서 담당합니다.
- 페이지별 metadata, route behavior, font, cache 관련 변경 전에는 설치된 Next.js 문서를 먼저 확인합니다.

## 스타일링

Tailwind CSS v4의 CSS-first 방식을 사용합니다.

- 앱 전역 CSS는 `apps/blog/app/globals.css`에 둡니다.
- `@theme`과 CSS 변수 기반 토큰을 사용합니다.
- `tailwind.config.{js,ts}`를 새로 만들지 않습니다.
- 앱 하나에서만 쓰는 시각 토큰은 앱 안에 둡니다.
- 여러 앱에서 반복되는 토큰이 생기면 `packages/tailwind-config`로 분리합니다.

## 빌드와 검증

루트 스크립트가 워크스페이스 전체를 조율합니다.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

현재 환경에서는 PowerShell 실행 정책이나 Corepack 권한 때문에 `pnpm` 실행이 막힐 수 있습니다. 그 경우 `pnpm.cmd` 또는 로컬 Node/Corepack 설정을 확인합니다.

## 배포 방향

아직 Docker, Nginx, CI/CD 구성은 없습니다. 목표 흐름은 다음과 같습니다.

```txt
코드 변경
  -> lint/typecheck/test/build
  -> 앱별 Docker 이미지 빌드
  -> 이미지 레지스트리에 커밋 해시 태그로 push
  -> 서버에서 반대 슬롯 컨테이너 실행
  -> health check
  -> Nginx include 파일 전환
  -> Nginx reload
  -> 이전 슬롯 중지
```

초기 구현 순서는 `blog Dockerfile -> docker compose -> Nginx reverse proxy -> blue-green deploy script -> CI/CD`가 적절합니다.
