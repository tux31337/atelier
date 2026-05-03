<!-- BEGIN:nextjs-agent-rules -->
# 이 저장소의 Next.js는 기존에 알던 Next.js와 다를 수 있다

이 버전은 API, 관례, 파일 구조에 깨지는 변경이 있을 수 있다. Next.js 코드를 작성하거나 수정하기 전에 `node_modules/next/dist/docs/` 아래의 관련 문서를 먼저 읽고, deprecated 안내를 따른다.
<!-- END:nextjs-agent-rules -->

# 저장소 작업 가이드

## 방향

Atelier는 블로그를 첫 제품 앱으로 두고, 이후 다른 프론트엔드 프로젝트를 같은 구조로 추가하기 위한 pnpm 모노레포다.

첫 제품 앱은 블로그다. 현재 두 번째 앱 자리로 `apps/truvis`가 추가되어 있으며, 이후 앱도 일회성 구조를 만들지 않고 같은 하네스, 같은 명령어 흐름, 같은 배포 연습 구조를 따른다.

## 현재 상태

루트에 있던 Next.js 앱은 `apps/blog`로 이동된 상태다. 루트 파일은 워크스페이스 조율, 문서, 공통 도구 설정을 담당한다.

명시적인 단계적 마이그레이션 작업이 아니라면 루트에 경쟁하는 앱 엔트리포인트를 다시 만들지 않는다. 블로그 제품 코드는 `apps/blog` 아래에 둔다.

현재 공유 패키지는 `packages/tsconfig`, `packages/eslint-config`, `packages/tailwind-config`, `packages/ui`가 있다. `packages/ui`는 `Button`과 `cn`처럼 이미 둘 이상의 앱에서 쓰는 작은 표현 계층부터 담는다. 다른 공유 패키지는 실제 공유 필요가 생겼을 때 가장 작은 유용한 단위부터 만든다.

## 목표 구조

- `apps/blog`: 기본 블로그 애플리케이션.
- `apps/truvis`: 두 번째 콘텐츠 사이트 자리. 현재는 공통 UI와 토큰을 검증하는 자리표시 앱.
- `apps/*`: 앞으로 추가될 프론트엔드 애플리케이션.
- `packages/ui`: 공유 React UI 컴포넌트와 레이아웃 원시 요소.
- `packages/tailwind-config`: 공유 Tailwind CSS 토큰과 프리셋.
- `packages/tsconfig`: 공유 TypeScript 설정.
- `packages/eslint-config`: 공유 ESLint 설정.
- `packages/content`: 블로그 콘텐츠 처리나 콘텐츠 도메인 유틸이 필요해졌을 때 사용.

루트 파일은 패키지 매니저 메타데이터, 공유 스크립트, lint/typecheck/build 조율, 저장소 문서를 담당한다.

## 함께 참고할 문서

`AGENTS.md`가 이 저장소의 에이전트 작업 규칙의 기준이다. 다만 아래 문서도 함께 읽고, 서로 모순되지 않게 유지한다.

- `CLAUDE.md`: 저장소 전체 작업 관례.
- `apps/blog/CLAUDE.md`: 블로그 앱 전용 소유 영역, 자주 하는 변경, 검증 명령.
- `apps/truvis/CLAUDE.md`: Truvis 앱 전용 소유 영역, 현재 범위, 검증 명령.
- `docs/ARCHITECTURE.md`: 현재 아키텍처와 배포 방향.
- `docs/ADR.md`: 수용된 기술 결정.
- `docs/PRD.md`: 블로그 MVP 제품 범위.
- `docs/UI_GUIDE.md`: UI와 접근성 방향.

함께 참고할 문서가 오래되었으면 그대로 두지 말고 문서 정리 작업에 포함해서 갱신한다.

## 언어 규칙

문서, 작업 규칙, 설명 문구, 깃 커밋 메시지는 한국어로 작성한다.

문서 작업 중 영어 문장으로 새 내용을 작성하지 않는다. 단, 코드 식별자, 파일 경로, 명령어, 패키지명, API 이름, 에러 메시지 원문, 외부에서 정해진 고유 명칭은 그대로 둘 수 있다.

깃 커밋 메시지의 제목과 본문도 한국어로 작성한다. 관례상 꼭 필요한 접두어나 도구가 요구하는 토큰이 있다면 최소한으로만 쓰고, 사람이 읽는 설명은 한국어로 쓴다.

영문 README처럼 특정 문서의 목적이 영어 문서인 경우를 제외하고, 새 문서와 기존 한국어 문서는 한국어를 기본으로 유지한다.

## 패키지 매니저

설치, 스크립트 실행, 워크스페이스 작업은 `pnpm`을 사용한다. `npm`, `yarn`, `bun` lockfile을 추가하지 않는다.

공통 작업은 루트 스크립트로 실행할 수 있게 유지한다.

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

검증 명령이 없으면 작업 범위에 맞게 추가하거나, 마무리할 때 그 공백을 분명히 말한다.

## Next.js

Next.js 코드를 수정하기 전에는 `node_modules/next/dist/docs/` 아래의 관련 로컬 문서를 먼저 읽는다. 이 저장소는 최신 Next.js를 사용하므로 예전 관례 기억만으로 판단하지 않는다.

기존 코드가 다른 패턴을 명확히 세우지 않았다면 App Router와 현재 문서화된 API를 사용한다. 라우팅, metadata, font, cache, server action, config, build/runtime 동작을 바꾸기 전에는 로컬 문서를 확인한다.

## Tailwind CSS

기본 스타일링 시스템은 Tailwind CSS다. 이 저장소는 Tailwind v4를 사용하므로 CSS-first 패턴을 따른다.

앱 전용 스타일은 소유 앱 안에 둔다. 여러 앱에서 반복되는 기본 토큰은 `packages/tailwind-config`에 둔다. 반복되는 레이아웃 원시 요소와 재사용 컴포넌트는 실제 반복이 생긴 뒤에 `packages/ui`로 올린다.

전역 CSS는 reset, theme token, base typography, 정말 전역인 동작만 담는다. 페이지별 넓은 selector를 전역 CSS에 추가하지 않는다.

## 모노레포 경계

앱은 공유 패키지를 import할 수 있다. 공유 패키지는 앱을 import하지 않는다.

`packages/ui`는 표현 계층으로 유지한다. 접근 가능한 컴포넌트, 레이아웃 원시 요소, 시각 빌딩 블록은 둘 수 있지만 블로그 전용 라우팅, 콘텐츠 로딩, 앱 데이터에 의존하지 않는다.

설정 패키지는 지루하고 명시적으로 유지한다. 숨은 동작이 많은 공통 설정보다 작고 분명한 공유 설정을 선호한다.

새 앱을 추가할 때는 기존 앱 구조, 스크립트, Tailwind 설정, TypeScript 설정, lint 설정, 네이밍 관례를 따른다.

## 프론트엔드 기준

요청이 마케팅 콘텐츠가 아닌 이상 placeholder landing page가 아니라 실제 제품 화면을 만든다.

semantic HTML, accessible label, 키보드 친화적 조작, 반응형 레이아웃을 사용한다. 콘텐츠가 많은 화면은 예측 가능하고 차분한 구조를 우선한다.

공유 컴포넌트와 토큰이 있으면 사용한다. 아직 공유 컴포넌트가 없는 영역은 앱 안에 먼저 만들고, 두 번째 실제 사용처가 생겼을 때 추출한다.

## 에이전트 작업 흐름

변경 전에 관련 파일을 읽는다. 기존 패턴을 먼저 따른다.

작업 범위를 요청된 내용에 맞게 유지한다. 필요한 경우가 아니라면 넓은 리팩터링, 의존성 교체, 파일 이동을 하지 않는다.

저장소 관례가 바뀌면 이 파일을 업데이트한다. `AGENTS.md`는 사람과 에이전트가 이 저장소에서 일하는 방식의 기준 문서다.

생성 파일이나 lockfile은 손으로 고치지 않는다. 의존성 변경은 `pnpm`으로 수행한다.

마무리 전 관련 검증 명령을 실행한다. 검증을 실행할 수 없으면 이유와 남는 위험을 말한다.
