# 블로그 앱 Dockerfile 정리

## 이번 단계의 목표

`apps/blog/Dockerfile`은 모노레포 안의 블로그 앱을 컨테이너 이미지로 빌드하기 위한 첫 배포 단위다.

이 Dockerfile은 저장소 루트를 빌드 컨텍스트로 사용한다고 가정한다.

```bash
docker build -f apps/blog/Dockerfile -t atelier-blog .
```

루트에서 빌드하는 이유는 `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `packages/*` 같은 워크스페이스 정보가 앱 바깥에 있기 때문이다.

## 멀티 스테이지 빌드

Dockerfile은 여러 단계로 나뉜다.

- `base`: Node와 pnpm 실행 환경을 준비한다.
- `deps`: lockfile 기준으로 의존성을 설치한다.
- `builder`: 블로그 앱을 `next build`로 빌드한다.
- `runner`: 실제 실행에 필요한 결과물만 담는다.

이렇게 나누면 최종 이미지에 소스 전체와 개발 도구를 모두 넣지 않아도 된다.

## Next.js standalone 출력

`apps/blog/next.config.ts`에 `output: "standalone"`을 설정했다.

이 설정을 켜면 Next.js가 프로덕션 실행에 필요한 파일을 추적해서 `.next/standalone`에 모아준다. Docker 실행 이미지는 이 결과물과 정적 파일만 복사하면 된다.

단, `public`과 `.next/static`은 standalone 폴더에 자동으로 모두 들어가지 않으므로 Dockerfile에서 별도로 복사한다.

## 실행 방식

최종 컨테이너는 `next start`가 아니라 standalone 결과물의 `server.js`를 실행한다.

```bash
node apps/blog/server.js
```

컨테이너 안에서는 `HOSTNAME=0.0.0.0`, `PORT=3000`을 지정한다. `0.0.0.0`으로 열어야 컨테이너 바깥에서 포트 매핑을 통해 접근할 수 있다.

## .dockerignore

`.dockerignore`는 Docker 빌드 컨텍스트에 넣지 않을 파일을 정한다.

`node_modules`, `.next`, 로그, 캐시, 환경 변수 파일을 제외해서 빌드 컨텍스트를 작게 유지하고 민감한 파일이 이미지 빌드 과정에 들어가지 않게 한다.

## 다음에 이어질 개념

다음 단계에서는 이 이미지를 직접 실행하거나 Docker Compose로 감싸게 된다. 그 다음 Nginx가 컨테이너 앞에서 reverse proxy 역할을 하고, blue-green 배포에서는 같은 이미지를 blue와 green 중 한쪽 슬롯에 새로 띄운 뒤 트래픽을 전환한다.

## Dockerfile 전체 흐름 복습

이 Dockerfile은 pnpm 모노레포 안의 `apps/blog` Next.js 앱을 빌드하고, 실행에 필요한 최소 파일만 담은 Docker 이미지를 만든다.

전체 흐름은 네 단계다.

```text
base
  Node와 pnpm 준비

deps
  package.json만 먼저 복사
  pnpm install 실행

builder
  설치된 의존성 가져오기
  전체 소스 복사
  Next.js build 실행

runner
  실행에 필요한 standalone 결과물만 복사
  일반 사용자로 server.js 실행
```

## base 단계

```dockerfile
FROM node:24-alpine AS base
```

`base`는 여러 단계에서 재사용하는 공통 기반이다. `node:24-alpine`은 Node.js 24가 들어 있는 가벼운 Linux 이미지다.

```dockerfile
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /repo
```

pnpm을 `/pnpm` 경로에서 쓸 수 있게 하고, Corepack으로 pnpm 9.0.0을 활성화한다. 루트 `package.json`의 `packageManager`와 버전을 맞추기 위해서다.

`WORKDIR /repo` 이후 명령은 컨테이너 안의 `/repo` 폴더 기준으로 실행된다.

## deps 단계

```dockerfile
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/blog/package.json apps/blog/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
RUN pnpm install --frozen-lockfile
```

`deps` 단계는 의존성 설치만 담당한다.

전체 소스를 바로 복사하지 않고 `package.json`과 lockfile만 먼저 복사한다. 이렇게 하면 소스 코드만 바뀐 경우 Docker가 의존성 설치 캐시를 재사용할 수 있다.

`pnpm-workspace.yaml`은 `apps/*`, `packages/*`를 워크스페이스로 선언한다. 그래서 `apps/blog/package.json`, `packages/eslint-config/package.json`, `packages/tsconfig/package.json`을 복사하면 pnpm이 이 패키지들을 모노레포 패키지로 인식할 수 있다.

`--frozen-lockfile`은 `pnpm-lock.yaml`과 `package.json`이 맞지 않으면 설치를 실패시킨다. CI/CD에서 같은 의존성으로 재현 가능한 빌드를 하기 위한 옵션이다.

## builder 단계

```dockerfile
FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/blog/node_modules ./apps/blog/node_modules
COPY . .
RUN pnpm -F @atelier/blog build
```

`builder` 단계는 실제 Next.js 앱을 빌드한다.

먼저 `deps` 단계에서 설치한 의존성을 가져온다. 그 다음 전체 소스를 복사한다. 이때 `.dockerignore`에 적힌 `node_modules`, `.next`, 로그, 캐시 파일 등은 빌드 컨텍스트에서 제외된다.

`pnpm -F @atelier/blog build`는 워크스페이스 중 `@atelier/blog` 패키지만 골라서 `build` 스크립트를 실행한다. 현재 블로그 앱에서는 `next build`가 실행된다.

`next.config.ts`에 `output: "standalone"`이 있기 때문에 빌드 결과로 `.next/standalone` 폴더가 만들어진다.

## runner 단계

```dockerfile
FROM node:24-alpine AS runner
WORKDIR /app
```

`runner`는 실제 운영 컨테이너다. 빌드 도구와 전체 소스를 넣지 않고 실행에 필요한 파일만 담는다.

```dockerfile
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
```

프로덕션 모드로 실행하고, 서버가 컨테이너 바깥에서도 접근 가능하도록 `0.0.0.0`에 바인딩한다. 포트는 3000번을 사용한다.

```dockerfile
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
```

앱을 root가 아니라 `nextjs` 일반 사용자로 실행하기 위해 사용자와 그룹을 만든다.

```dockerfile
COPY --from=builder --chown=nextjs:nodejs /repo/apps/blog/public ./apps/blog/public
COPY --from=builder --chown=nextjs:nodejs /repo/apps/blog/.next/static ./apps/blog/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/blog/.next/standalone ./
```

빌드 결과에서 실행에 필요한 파일만 복사한다.

- `public`: 사용자가 직접 제공한 정적 파일
- `.next/static`: Next.js 빌드 정적 파일
- `.next/standalone`: Next.js 서버 실행에 필요한 최소 묶음

`--chown=nextjs:nodejs`는 복사한 파일의 소유자를 실행 사용자에 맞춘다.

```dockerfile
USER nextjs
EXPOSE 3000
CMD ["node", "apps/blog/server.js"]
```

컨테이너는 `nextjs` 사용자로 실행된다.

`EXPOSE 3000`은 이 이미지가 3000번 포트를 사용한다는 표시다. 실제로 내 PC의 `localhost:3000`과 연결하려면 `docker run -p 3000:3000` 또는 Compose의 `ports` 설정이 필요하다.

`CMD`는 컨테이너가 시작될 때 standalone 결과물의 Next.js 서버를 실행한다.

## 이 구조의 장점

- 의존성 설치 캐시가 잘 동작해서 빌드가 빨라진다.
- 최종 이미지에 전체 소스와 개발 도구가 덜 들어간다.
- Next.js standalone 결과물을 사용해서 Docker 실행 구조가 단순해진다.
- 나중에 Nginx, blue-green 배포, CI/CD로 확장하기 좋은 단위가 된다.
