# Atelier 한국어 안내서

Atelier는 여러 프론트엔드 프로젝트를 같은 구조로 관리하기 위한 pnpm 모노레포입니다. 첫 번째 앱은 블로그이며, 이후 추가되는 앱도 같은 작업 공간과 배포 흐름을 따르는 것을 목표로 합니다.

> 영어 문서: [README.md](./README.md). 작업 규칙은 [AGENTS.md](./AGENTS.md)와 [CLAUDE.md](./CLAUDE.md)에 있습니다.

## 기술 스택

- Next.js 16 App Router + React 19
- TypeScript strict mode
- Tailwind CSS v4, CSS-first 방식
- pnpm workspaces
- Vitest 기반 단위 테스트

## 현재 구조

```txt
apps/
  blog/                 # 첫 번째 제품 앱, 블로그

docs/                   # 제품, 아키텍처, UI 문서
scripts/                # 유틸리티 스크립트

pnpm-workspace.yaml     # apps/*, packages/* 워크스페이스 선언
package.json            # 루트 실행 스크립트
```

초기 루트 Next.js 앱은 이미 `apps/blog`로 이동했습니다. 현재 루트는 앱을 직접 호스팅하는 곳이 아니라 워크스페이스를 조율하는 위치입니다.

## 목표 구조

```txt
apps/
  blog/

packages/
  ui/
  tailwind-config/
  tsconfig/
  eslint-config/
  content/
```

각 폴더의 역할은 다음과 같습니다.

- `apps/blog`: 첫 번째 제품 앱인 블로그입니다.
- `apps/*`: 앞으로 추가될 프론트엔드 앱이 들어갑니다.
- `packages/ui`: 여러 앱에서 재사용할 수 있는 React UI 컴포넌트와 레이아웃 원시 요소를 둡니다.
- `packages/tailwind-config`: 반복되는 Tailwind 토큰이나 프리셋이 생기면 분리합니다.
- `packages/tsconfig`: 공통 TypeScript 설정을 둡니다.
- `packages/eslint-config`: 공통 ESLint flat config를 둡니다.
- `packages/content`: 블로그 콘텐츠 처리 로직이 앱 밖에서도 필요해질 때 분리합니다.

현재 생성된 공유 패키지는 `packages/tsconfig`뿐입니다. 나머지는 실제 반복이 보이는 순서대로 작게 추가하는 것이 원칙입니다.

## 루트 명령어

루트에서 다음 명령어를 사용할 수 있도록 유지합니다.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

Windows에서 PowerShell 실행 정책 때문에 `pnpm`이 막히면 `pnpm.cmd`를 사용하거나 로컬 실행 정책과 Corepack 설정을 정리해야 합니다.

## 현재 비어 있는 부분

- 공통 패키지 중 `packages/tsconfig`만 있습니다. `packages/ui`, `packages/eslint-config`는 아직 없습니다.
- Dockerfile, Docker Compose, Nginx reverse proxy 설정이 아직 없습니다.
- blue-green 배포 스크립트가 아직 없습니다.
- GitHub Actions 같은 CI/CD 설정이 아직 없습니다.

## 작업 원칙

- 패키지 매니저는 pnpm을 사용합니다.
- 앱은 공유 패키지를 import할 수 있지만, 공유 패키지는 앱에 의존하지 않습니다.
- Next.js 라우팅, 메타데이터, 폰트, 캐싱, 서버 액션, 설정, 배포 방식을 바꾸기 전에는 설치된 Next.js 문서를 먼저 확인합니다.
- Tailwind CSS v4의 CSS-first 방식을 유지합니다.
- 앱 하나에서만 쓰는 코드는 앱 안에 둡니다. 실제 반복이 생겼을 때만 공유 패키지로 분리합니다.

## 다음 작업 추천

1. `packages/eslint-config` 골격을 만듭니다.
2. `packages/ui`는 실제 공유 컴포넌트가 생길 때 최소 범위로 만듭니다.
3. `apps/blog`를 Docker 이미지로 빌드할 수 있게 만듭니다.
4. Docker Compose로 블로그 컨테이너를 로컬에서 띄웁니다.
5. Nginx reverse proxy 설정을 추가합니다.
6. A/B 슬롯 기반 blue-green 배포 스크립트를 만듭니다.
