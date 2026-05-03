# 아키텍처

## 방향

Atelier는 블로그를 첫 제품 앱으로 두고, 이후 앱을 같은 방식으로 추가할 수 있는 프론트엔드 모노레포입니다. 현재는 블로그 앱 `apps/blog`, 두 번째 앱 자리 `apps/truvis`, 공유 패키지 `packages/tsconfig`, `packages/eslint-config`, `packages/tailwind-config`, `packages/ui`가 있는 상태이며, 컨테이너 빌드와 Nginx reverse proxy까지 로컬 실습 수준으로 들어와 있습니다.

원칙은 작게 시작하고, 실제 반복이 보일 때만 분리하는 것입니다. `packages/tailwind-config`와 `packages/ui`는 두 앱에서 공유되는 토큰과 작은 UI 원시 요소가 생기면서 최소 범위로 채워졌습니다. 앞으로도 필요한 부분만 `packages/*`로 올립니다.

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
      Dockerfile        # 블로그 컨테이너 빌드 (Next standalone)
      next.config.ts
      package.json
    truvis/
      app/              # 두 번째 콘텐츠 사이트 자리
      next.config.ts
      package.json

  docs/
  infra/
    nginx/
      default.conf      # 로컬 reverse proxy 설정
  packages/
    eslint-config/
    tailwind-config/    # 공유 Tailwind v4 토큰
    tsconfig/
    ui/                 # 공유 Button, cn 등 표현 계층 원시 요소
  scripts/
  docker-compose.yml    # blog + nginx 두 서비스
  package.json
  pnpm-workspace.yaml
```

루트 앱 엔트리포인트는 남겨두지 않습니다. 제품 코드는 `apps/*`에 있고, 루트는 워크스페이스 스크립트와 문서, 공통 설정, 컨테이너 조율의 출발점 역할만 합니다.

## 목표 구조

```txt
apps/
  blog/
  truvis/
  future-app/

packages/
  ui/
  tsconfig/
  eslint-config/
  tailwind-config/
  content/
```

공유 패키지 경계는 다음 기준을 따릅니다.

- `packages/ui`: 표현 중심 컴포넌트와 레이아웃 원시 요소만 둡니다.
- `packages/tsconfig`: 앱과 패키지가 공유할 TypeScript base config를 둡니다.
- `packages/eslint-config`: 공통 ESLint flat config를 둡니다.
- `packages/tailwind-config`: Tailwind v4 토큰이나 프리셋이 여러 앱에서 반복될 때 둡니다.
- `packages/content`: 콘텐츠 파싱이나 콘텐츠 도메인 유틸이 블로그 밖에서도 필요해질 때 분리합니다.

앱은 패키지를 import할 수 있지만, 패키지는 앱을 import하지 않습니다.

## 앱 아키텍처

앱은 Next.js 16 App Router 기반입니다. 현재 블로그는 실제 제품 앱이고, Truvis는 공통 UI와 토큰을 검증하는 두 번째 콘텐츠 사이트 자리입니다.

- 기본은 Server Component입니다.
- `"use client"`는 상호작용, 브라우저 API, 로컬 상태가 필요한 컴포넌트에만 붙입니다.
- 블로그 콘텐츠는 현재 `apps/blog/content/blog/*.mdx`에 둡니다.
- 블로그 콘텐츠 파싱은 `apps/blog/lib/posts.ts`에서 담당합니다.
- Truvis에는 아직 콘텐츠 처리, MDX, 별도 도메인 로직을 두지 않습니다.
- 페이지별 metadata, route behavior, font, cache 관련 변경 전에는 설치된 Next.js 문서를 먼저 확인합니다.

## 스타일링

Tailwind CSS v4의 CSS-first 방식을 사용합니다.

- 공유 토큰은 `packages/tailwind-config/tokens.css`에 둡니다.
- 앱 전역 CSS는 각 앱의 `app/globals.css`에 둡니다.
- `@theme`과 CSS 변수 기반 토큰을 사용합니다.
- `tailwind.config.{js,ts}`를 새로 만들지 않습니다.
- 앱 하나에서만 쓰는 시각 토큰은 앱 안에 둡니다.
- 여러 앱에서 반복되는 토큰은 `packages/tailwind-config`로 올립니다.

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

블로그 Dockerfile과 `docker-compose.yml`, Nginx reverse proxy까지는 로컬 실습 수준으로 들어와 있고, 남은 단계는 공유 패키지를 포함한 컨테이너 빌드 검증, blue-green 배포 스크립트, CI/CD 워크플로입니다. 목표 흐름은 다음과 같습니다.

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

초기 구현 순서는 `blog Dockerfile -> docker compose -> Nginx reverse proxy -> blue-green deploy script -> CI/CD`로 잡았고, 현재 세 번째 단계까지 진행돼 있습니다. `packages/ui`와 `packages/tailwind-config`가 생겼으므로 다음 컨테이너 작업에서는 Dockerfile의 workspace 패키지 복사 범위를 함께 확인합니다.
