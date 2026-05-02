# Atelier

Atelier는 프론트엔드 작업을 위한 pnpm 모노레포다. 첫 제품 앱은 `apps/blog`의 블로그이며, 이후 앱도 같은 워크스페이스 구조, 같은 스크립트, 같은 배포 학습 흐름을 재사용한다.

이 문서는 보조 문서다. 저장소 작업 규칙의 기준은 `AGENTS.md`다.

## 스택과 주의점

- **Next.js 16 App Router**: 예전 Next.js 지식과 다를 수 있다. 라우팅, metadata, font, cache, server action, config, 배포 동작을 바꾸기 전에는 설치된 `next/dist/docs` 문서를 확인한다.
- **React 19**: 기본은 Server Component다. `"use client"`는 상호작용, 브라우저 API, 로컬 상태가 실제로 필요할 때만 붙인다.
- **TypeScript strict**: `any`나 넓은 타입 단언을 피한다. 입력 경계에서 타입을 좁힌다.
- **Tailwind CSS v4 CSS-first**: 토큰은 CSS의 `@theme`과 CSS 변수로 관리한다. 저장소 관례가 바뀌기 전에는 `tailwind.config.{js,ts}`를 추가하지 않는다.
- **pnpm workspaces**: 설치, 스크립트, 의존성 변경은 pnpm을 사용한다. 다른 패키지 매니저 lockfile을 추가하지 않는다.

## 언어 규칙

문서, 작업 규칙, 설명 문구, 깃 커밋 메시지는 한국어로 작성한다.

영어 문장을 새로 추가하지 않는다. 단, 코드 식별자, 파일 경로, 명령어, 패키지명, API 이름, 에러 메시지 원문, 외부 고유 명칭은 예외다.

깃 커밋 메시지는 제목과 본문 모두 한국어로 작성한다. 도구가 요구하는 접두어가 있을 때도 사람이 읽는 설명은 한국어로 쓴다.

## 현재 상태

- 블로그 제품 코드는 `apps/blog`에 있다.
- 루트 파일은 워크스페이스와 문서를 조율한다.
- `pnpm-workspace.yaml`은 `apps/*`, `packages/*`를 선언한다.
- 현재 공유 패키지는 `packages/tsconfig`만 있다.
- Docker, Docker Compose, Nginx, blue-green 배포 스크립트, CI/CD 워크플로는 아직 없다.

## 경계

- 앱은 공유 패키지를 import할 수 있다.
- 공유 패키지는 앱을 import하지 않는다.
- `packages/ui`가 생기면 표현 계층으로 유지한다.
- 블로그 전용 라우팅, 콘텐츠 로딩, MDX 렌더링은 `apps/blog` 안에 둔다.
- 실제 반복이 생기기 전에는 공유 코드로 추출하지 않는다.

## 구현 지침

- 요청 범위에 맞게 변경한다.
- 먼저 앱 안에 구현하고, 재사용이 분명할 때만 `packages/*`로 올린다.
- 전역 CSS는 reset, theme token, base typography, 정말 전역인 동작만 담는다.
- 생성 파일이나 lockfile은 손으로 고치지 않는다. 의존성 변경은 pnpm으로 한다.
- 루트 스크립트를 유지한다.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

검증을 실행할 수 없으면 무엇이 막았는지 정확히 적는다.

## 다음 작업 후보

1. `packages/eslint-config`의 작은 골격을 만든다.
2. `packages/ui`는 실제 공유 컴포넌트가 생길 때 최소 범위로 만든다.
3. `apps/blog` Docker 빌드 경로를 추가한다.
4. 블로그 컨테이너용 로컬 Docker Compose를 추가한다.
5. Nginx reverse proxy 설정을 추가한다.
6. 컨테이너와 프록시 구조가 안정되면 blue-green 배포 스크립트를 추가한다.
