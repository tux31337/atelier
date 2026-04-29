# Atelier 한국어 안내서

Atelier는 블로그를 시작점으로 여러 프론트엔드 프로젝트를 함께 관리하기 위한 작업 공간입니다. 처음에는 블로그를 안정적으로 만들고, 이후 필요한 웹 프로젝트들을 같은 구조 안에서 확장하는 방향을 목표로 합니다.

## 방향

이 저장소는 pnpm 기반 모노레포로 운영할 예정입니다. 각 프로젝트는 `apps` 아래에 두고, 여러 프로젝트에서 함께 쓰는 설정과 UI 요소는 `packages` 아래에 나누어 관리합니다.

우선순위는 다음과 같습니다.

- 블로그 앱을 먼저 만든다.
- Tailwind CSS를 공통 스타일 기반으로 사용한다.
- 반복되는 UI, 설정, TypeScript 설정은 공유 패키지로 분리한다.
- 새 프로젝트가 추가되어도 같은 구조와 명령어 흐름을 유지한다.

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

- `apps/blog`: 첫 번째 제품인 블로그 앱입니다.
- `apps/*`: 앞으로 추가될 프론트엔드 앱들이 들어갑니다.
- `packages/ui`: 여러 앱에서 재사용할 수 있는 UI 컴포넌트와 레이아웃 요소를 둡니다.
- `packages/tailwind-config`: 공통 Tailwind 설정과 디자인 토큰을 관리합니다.
- `packages/tsconfig`: 공통 TypeScript 설정을 관리합니다.
- `packages/eslint-config`: 공통 ESLint 설정을 관리합니다.
- `packages/content`: 블로그 콘텐츠 처리나 콘텐츠 관련 유틸리티가 필요할 때 사용합니다.

## 현재 상태

현재 저장소는 기본 Next.js 앱 형태에서 출발한 상태입니다. 루트에 `app`, `public`, `next.config.ts`, `postcss.config.mjs` 같은 파일이 있으며, 이는 모노레포 구조로 옮겨가기 전의 시작점으로 봅니다.

다음 단계에서는 블로그 코드를 `apps/blog`로 옮기고, 루트는 전체 작업 공간을 관리하는 역할로 정리하는 것이 좋습니다.

## 기본 원칙

- 패키지 매니저는 pnpm을 사용합니다.
- 스타일링은 Tailwind CSS를 우선 사용합니다.
- 앱 고유의 코드는 각 앱 안에 둡니다.
- 여러 앱에서 반복해서 쓰이는 코드만 `packages`로 옮깁니다.
- 처음부터 과하게 추상화하지 않고, 실제 반복이 생겼을 때 공유 구조로 분리합니다.

## 자주 쓸 명령어

아래 명령어들은 모노레포 하네스가 정리되면서 루트에서 실행할 수 있게 유지하는 것을 목표로 합니다.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

테스트가 추가되면 다음 명령어도 함께 유지합니다.

```bash
pnpm test
```

## 다음 작업

1. 현재 설치 상태를 `pnpm i`로 먼저 정상화합니다.
2. 루트에 있는 기존 Next.js 앱을 `apps/blog`로 이동합니다.
3. pnpm workspace 설정을 `apps/*`, `packages/*` 기준으로 정리합니다.
4. Tailwind CSS, TypeScript, ESLint 설정을 필요한 만큼만 공유 패키지로 분리합니다.
5. 블로그의 기본 레이아웃, 글 목록, 글 상세 구조를 먼저 안정화합니다.
