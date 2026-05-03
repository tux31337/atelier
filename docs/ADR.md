# Architecture Decision Records

## 철학

작게 시작하고, 실제 반복이 생긴 뒤에 공통화합니다. Atelier는 블로그 하나로 출발하지만, 장기적으로 여러 프론트엔드 앱을 같은 방식으로 빌드하고 배포할 수 있는 작업 공간을 목표로 합니다.

---

## ADR-001: pnpm 모노레포

**결정**: 패키지 매니저는 pnpm을 사용하고, 워크스페이스는 `apps/*`와 `packages/*`로 나눕니다.

**이유**: 첫 앱은 블로그지만 이후 앱이 추가될 가능성이 높습니다. 앱과 공유 패키지를 한 저장소에서 관리하면 설정과 컴포넌트를 재사용하기 쉽습니다.

**트레이드오프**: 앱 하나만 있을 때는 구조가 다소 커 보일 수 있습니다. 대신 다음 앱을 추가할 때 같은 harness를 재사용할 수 있습니다.

---

## ADR-002: Next.js 16 App Router + React 19

**결정**: 블로그 앱은 Next.js 16 App Router와 React 19를 사용합니다.

**이유**: 블로그는 정적 생성과 Server Component에 잘 맞습니다. App Router는 layout, metadata, route segment 구조를 명확하게 표현할 수 있습니다.

**주의**: 이 저장소의 Next.js 버전은 기존 지식과 다른 부분이 있을 수 있습니다. 라우팅, metadata, font, cache, server action, config, deploy 관련 코드를 바꾸기 전에는 설치된 `next/dist/docs` 문서를 확인합니다.

---

## ADR-003: Tailwind CSS v4 CSS-first

**결정**: Tailwind CSS v4의 CSS-first 방식을 사용합니다. `tailwind.config.{js,ts}`는 만들지 않습니다.

**이유**: 현재 앱은 `globals.css`의 `@theme`과 CSS 변수로 토큰을 관리합니다. v4 방식에 맞게 CSS 안에서 토큰을 다루는 편이 단순합니다.

**트레이드오프**: Tailwind v3 방식의 플러그인이나 설정 예시는 그대로 적용하기 어렵습니다. 필요한 경우 v4 문서를 기준으로 다시 판단합니다.

---

## ADR-004: 파일 기반 MDX 콘텐츠

**결정**: 블로그 글은 `apps/blog/content/blog/*.mdx`에 저장합니다.

**이유**: 개인 블로그 MVP에는 CMS나 데이터베이스보다 파일 기반 콘텐츠가 단순하고 관리하기 쉽습니다. 코드 리뷰와 배포 흐름에 콘텐츠 변경을 함께 태울 수 있습니다.

**트레이드오프**: 검색, 관리자 화면, 비개발자 편집 경험은 직접 구현해야 합니다. MVP 범위에서는 제외합니다.

---

## ADR-005: TypeScript strict mode

**결정**: TypeScript는 strict mode를 유지합니다.

**이유**: 초기에 타입 경계를 엄격하게 잡아두면 이후 공유 패키지와 앱이 늘어날 때 유지보수 비용을 줄일 수 있습니다.

**트레이드오프**: 외부 라이브러리 타입이 부족할 때 작업이 느려질 수 있습니다. 우회가 필요하면 최소 범위에 격리합니다.

---

## ADR-006: 공유 패키지는 필요할 때 추출

**결정**: `packages/*`는 실제 반복이나 설정 공유 필요가 생겼을 때 최소 범위로 채웁니다. TypeScript와 ESLint 기준은 공통 설정의 성격이 명확하므로 공유 패키지로 두고, Tailwind 토큰과 UI 원시 요소는 두 앱에서 반복이 생긴 뒤 공유 패키지로 둡니다.

**이유**: 앱 하나만 있는 단계에서 지나친 추상화를 만들면 오히려 변경 비용이 커집니다. 반대로 두 앱에서 같은 토큰과 UI 원시 요소를 쓰기 시작하면 공유 패키지로 경계를 세우는 편이 유지보수에 유리합니다.

**현재 상태**: `packages/eslint-config`, `packages/tailwind-config`, `packages/ui`가 최소 범위로 생겼습니다. `packages/ui`는 `Button`과 `cn`처럼 두 앱에서 실제로 쓰는 표현 계층만 담고, 블로그 전용 라우팅이나 콘텐츠 구조는 앱 안에 둡니다.
