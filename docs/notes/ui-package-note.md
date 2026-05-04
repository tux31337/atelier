# UI 패키지 정리

## 목적

`packages/ui`는 여러 앱에서 반복해서 쓰는 작은 React 표현 계층을 담는 공유 패키지다.

현재 저장소에서는 블로그 앱과 Truvis 앱이 같은 UI 원시 요소와 스타일 유틸을 사용할 수 있게 한다.

## 왜 앱 밖에 두는가

처음부터 모든 컴포넌트를 공유 패키지로 올리지는 않는다.

공유 패키지는 다음 조건이 생겼을 때 올린다.

```text
둘 이상의 앱에서 실제로 반복된다.
블로그 전용 데이터나 라우팅에 의존하지 않는다.
표현 계층으로 분리해도 의미가 명확하다.
```

블로그 전용 컴포넌트는 `apps/blog/components`에 둔다. 여러 앱에서 쓸 수 있는 Button, Container, `cn` 같은 작은 단위만 `packages/ui`로 올린다.

## 앱과 패키지의 방향

앱은 공유 패키지를 import할 수 있다.

```tsx
import { Button } from "@atelier/ui";
```

하지만 공유 패키지는 앱을 import하지 않는다.

```text
apps/blog -> packages/ui
apps/truvis -> packages/ui
packages/ui -> apps/blog 금지
```

이 방향이 깨지면 공유 패키지가 특정 앱에 묶이고, 새 앱이 같은 패키지를 쓰기 어려워진다.

## Docker 빌드와의 관계

`apps/blog`가 `@atelier/ui`를 사용하면 Docker 빌드도 이 패키지를 알아야 한다.

그래서 Dockerfile의 의존성 설치 단계에서 `packages/ui/package.json`을 먼저 복사한다.

```dockerfile
COPY packages/ui/package.json packages/ui/package.json
```

그리고 Next.js 앱은 워크스페이스 내부 TS/TSX 패키지를 빌드 과정에서 함께 변환해야 한다.

```ts
transpilePackages: ["@atelier/ui"]
```

공유 UI 패키지는 단순한 코드 분리만이 아니라, Docker 빌드와 Next.js 빌드 설정에도 영향을 준다.

## 한 줄 정리

`packages/ui`는 앱 전용 기능이 아니라 여러 앱에서 재사용할 수 있는 작은 표현 primitive를 담는 곳이다.
