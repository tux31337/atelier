# UI 디자인 가이드

## 디자인 원칙
1. **글이 주인공이다.** UI는 배경. 본문 가독성이 항상 1순위이고, 장식은 그 다음이다.
2. **도구처럼 보이게 한다.** 매일 쓰는 텍스트 기반 도구의 느낌. 마케팅 랜딩 페이지의 화려함은 의도적으로 피한다.
3. **다크/라이트 양쪽 모두 의도된 모습이어야 한다.** 한쪽이 다른 쪽의 부산물처럼 보이면 안 된다.

## AI 슬롭 안티패턴 — 하지 마라

| 금지 사항 | 이유 |
|-----------|------|
| `backdrop-filter: blur()` | glass morphism은 AI 템플릿의 가장 흔한 징후 |
| 그라데이션 텍스트 (`background-clip: text` + gradient) | AI가 만든 SaaS 랜딩의 1번 특징 |
| "Powered by AI" 류 배지 | 기능이 아니라 장식. 사용자에게 가치 없음 |
| `box-shadow` 글로우 애니메이션 | 네온 글로우 = AI 슬롭 |
| 보라/인디고 브랜드 색상 | "AI = 보라색" 클리셰 |
| 모든 카드에 동일한 `rounded-2xl` | 균일한 둥근 모서리는 템플릿 느낌 |
| 배경 gradient orb (`blur-3xl` 원형) | 모든 AI 랜딩 페이지에 있는 장식 |
| 의미 없는 hover scale (`hover:scale-105`) | 카드를 호버할 때 커지는 게 무슨 의미인지 묻고 답할 수 있어야 한다 |
| 모든 섹션에 fade-in/slide-in 모션 | 정보 도달을 늦출 뿐 |

## 색상 토큰 (초안)

`apps/blog/app/globals.css`의 `@theme` 블록에서 정의한다. 라이트·다크 둘 다 동시에 채운다.

### 배경
| 용도 | 라이트 | 다크 |
|------|------|------|
| 페이지 | `#ffffff` | `#0a0a0a` |
| 표면(헤더·카드) | `#fafafa` | `#141414` |
| 강조 표면 | `#f4f4f5` (zinc-100) | `#1f1f1f` |

### 텍스트
| 용도 | 라이트 | 다크 |
|------|------|------|
| 본문 주 | `#171717` (zinc-900) | `#ededed` |
| 본문 보조 | `#52525b` (zinc-600) | `#a1a1aa` (zinc-400) |
| 비활성/메타 | `#a1a1aa` (zinc-400) | `#71717a` (zinc-500) |
| 링크 | 포인트 컬러 (아래) | 포인트 컬러 |

### 포인트 (단일)
- 라이트: `#0f766e` (teal-700) 정도
- 다크: `#5eead4` (teal-300) 정도
- 보라/인디고는 쓰지 않는다.
- 한 화면에 포인트 색은 한 종류만.

### 시맨틱
| 용도 | 라이트 | 다크 |
|------|------|------|
| 성공 | `#16a34a` | `#4ade80` |
| 경고 | `#d97706` | `#fbbf24` |
| 에러 | `#dc2626` | `#f87171` |

## 컴포넌트

### 카드 (글 목록 항목 등)
```
배경: bg-white / dark:bg-[#141414]
테두리: border border-zinc-200 / dark:border-zinc-800
모서리: rounded-md  (rounded-2xl 금지)
패딩: p-5 ~ p-6
```

### 버튼
```
Primary: rounded-md bg-zinc-900 text-white hover:bg-zinc-800
         dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200
Ghost  : text-zinc-600 hover:text-zinc-900
         dark:text-zinc-400 dark:hover:text-zinc-100
Link   : text-[포인트] underline-offset-2 hover:underline
```

### 입력 필드 (검색이 도입될 경우)
```
bg-white border border-zinc-300 rounded-md px-3 py-2
dark:bg-[#141414] dark:border-zinc-700
focus:outline-none focus:ring-1 focus:ring-zinc-400
dark:focus:ring-zinc-500
```

### 코드 블록 (글 본문)
- 인라인: `bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[0.9em]`
- 블록: 가로 스크롤 허용, 폰트는 `--font-mono`, 신택스 하이라이트는 빌드 시점(rehype-pretty-code 또는 동등물).

## 레이아웃
- 본문(글 상세)의 가독성 폭: `max-w-2xl` (~672px). 한 줄이 너무 길어지면 가독성이 떨어진다.
- 글 목록·인덱스: `max-w-3xl` 정도까지 허용.
- 페이지 좌우 패딩: 모바일 `px-4`, sm 이상 `px-6`.
- 정렬은 좌측 정렬이 기본. 가운데 정렬은 헤더의 운영자명·날짜 같은 단일 요소에만.
- 섹션 간 간격: `space-y-8 ~ space-y-12`.

## 타이포그래피
| 용도 | 스타일 |
|------|--------|
| 페이지 제목 (H1) | `text-3xl sm:text-4xl font-semibold tracking-tight` |
| 섹션 제목 (H2) | `text-2xl font-semibold tracking-tight` |
| 글 카드 제목 | `text-lg font-medium` |
| 본문 | `text-base leading-7` (한글 가독성을 위한 `leading-7`/`leading-8`) |
| 본문 보조/메타 | `text-sm text-zinc-500 dark:text-zinc-400` |
| 코드 | `font-mono text-[0.95em]` |

서체는 1차로 시스템 스택 + Geist Mono(현재 설정 그대로). 한글 가독성이 부족하다고 판단되면 Pretendard 도입을 ADR에서 다룬다.

## 애니메이션
- 허용: 다크 모드 토글 시 색 전환 (`transition-colors duration-150`).
- 허용: 호버 색 변경 (`transition-colors`).
- 금지: 페이지 진입 fade-in/slide-up (정보 도달을 늦춘다).
- 금지: 글로우/펄스 애니메이션.
- 모션 감소 환경(`prefers-reduced-motion`)을 존중한다.

## 아이콘
- SVG 인라인. `strokeWidth: 1.5`. Lucide 같은 일관된 세트 한 종류만 쓴다.
- 아이콘을 둥근 배경 박스(`rounded-full bg-...`)로 감싸지 않는다 — 그건 AI 슬롭 표지다.
- 본문 안 아이콘 크기: `w-4 h-4` 또는 `w-5 h-5`.

## 접근성
- 모든 인터랙티브 요소는 키보드 포커스가 보여야 한다 (`focus-visible:ring`).
- 본문 글자 크기는 14px(`text-sm`) 미만으로 떨어뜨리지 않는다 — 메타·캡션 한정.
- 색만으로 정보를 전달하지 않는다 (예: 에러는 색 + 아이콘 + 텍스트).
- `prefers-color-scheme`을 따르되, 사용자가 명시적으로 토글하면 그 선택을 우선한다.
