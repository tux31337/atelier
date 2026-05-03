# UI 가이드

## 방향

Atelier 블로그의 UI는 글과 작업물을 편하게 읽기 위한 조용한 작업 화면을 지향한다. 홈은 화려한 랜딩 페이지가 아니라 최근 글과 주요 섹션으로 바로 들어갈 수 있는 제품 화면이어야 한다.

장식은 정보 구조를 보조할 때만 사용한다. 배경 효과, 유리 효과, 과한 그림자, 의미 없는 애니메이션은 기본값으로 두지 않는다.

## 기준

- 콘텐츠가 주인공이다.
- 레이아웃은 넓게 띄우기보다 읽기 좋은 폭과 명확한 간격을 우선한다.
- 색상은 CSS 변수와 Tailwind 토큰을 통해 사용한다.
- 앱 전용 스타일은 `apps/blog` 안에 둔다.
- 여러 앱에서 실제 반복이 생긴 토큰은 `packages/tailwind-config`, 컴포넌트와 UI 원시 요소는 `packages/ui`로 올린다.
- `docs/design/*.html`은 과거 시안 보관용이다. 현재 구현 기준으로 사용하지 않는다.

## Tailwind CSS

Tailwind CSS v4의 CSS-first 방식을 사용한다.

- 공유 토큰은 `packages/tailwind-config/tokens.css`의 `@theme`과 CSS 변수로 관리한다.
- 블로그 전용 토큰은 `apps/blog/app/globals.css`에 둔다.
- `tailwind.config.{js,ts}`를 새로 만들지 않는다.
- 전역 CSS에는 reset, theme token, 기본 타이포그래피, 정말 공통인 유틸리티만 둔다.
- 페이지 전용 장식 유틸리티는 전역 CSS에 만들지 않는다.

## 레이아웃

- 본문 영역은 `max-w-3xl` 안팎을 기본으로 한다.
- 목록 화면은 스캔이 쉬운 카드 또는 행 구조를 사용한다.
- nav, footer, 페이지 헤더는 같은 간격과 토큰을 사용한다.
- 카드 안에 카드를 중첩하지 않는다.
- 첫 화면에서 실제 콘텐츠 진입점이 보여야 한다.

## 타이포그래피

- 큰 제목은 페이지 제목이나 홈의 대표 제목에만 사용한다.
- 카드, 목록, 본문 안에서는 작은 heading scale을 사용한다.
- letter spacing은 0을 기본으로 한다.
- 버튼이나 작은 UI 안의 텍스트가 부모 너비를 넘치지 않게 한다.
- 본문은 `font-blog-content`와 `text-blog-content`를 사용하되, 보조 설명과 UI 라벨은 `font-body-md` 또는 `font-code-label`을 사용한다.

## 컴포넌트

현재 블로그 전용 컴포넌트는 `apps/blog/components`에 둔다. 공유 컴포넌트와 UI 원시 요소는 `packages/ui`에 둔다.

현재 공유 패키지에 둘 수 있는 것:

- 여러 앱에서 같은 의미로 쓸 버튼 primitive.
- 공통 레이아웃 primitive.
- 접근성 처리와 상태 표현이 반복되는 UI.

앱 안에 남길 것:

- 블로그 라우팅이나 콘텐츠 구조를 아는 컴포넌트.
- 블로그 전용 navigation, footer, MDX 렌더러.
- 한 화면에서만 쓰는 표현 컴포넌트.

## 접근성

- 링크와 버튼은 의미에 맞는 HTML 요소를 사용한다.
- 모든 인터랙티브 요소는 키보드로 접근 가능해야 한다.
- `focus-visible` 상태를 숨기지 않는다.
- 색만으로 상태를 전달하지 않는다.
- 이미지가 추가될 경우 의미 있는 alt 텍스트를 둔다.

## 피할 것

- `backdrop-filter`, glass card, gradient orb, glow 같은 장식 중심 효과.
- 의미 없는 pulse, scale, slide-in 애니메이션.
- 하드코딩 색상 남발.
- 한 화면 전체를 같은 색 계열로만 채우는 팔레트.
- 앱 하나에서만 쓰는 코드를 성급하게 공유 패키지로 분리하는 것.
