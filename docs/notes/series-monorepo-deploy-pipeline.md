# 모노레포 프론트엔드 배포 파이프라인 시리즈 기획

## 시리즈 방향

이 시리즈는 블로그 자체를 만드는 이야기가 아니라, pnpm 모노레포 안의 특정 프론트엔드 앱을 배포 가능한 단위로 키우는 과정을 기록한다.

현재 대상 앱은 `apps/blog`지만, 글의 중심은 블로그 기능이 아니다. 핵심은 다음 흐름이다.

```text
모노레포
  -> 특정 앱 선택 빌드
  -> Docker 이미지화
  -> Docker Compose 실행 고정
  -> Nginx reverse proxy
  -> blue-green 배포
  -> CI/CD 자동화
```

## 독자

- Next.js 앱은 만들어봤지만 직접 배포 구조를 잡아본 경험은 적은 사람
- Dockerfile, Compose, Nginx, CI/CD가 각각 어디서 필요한지 헷갈리는 사람
- 모노레포 안의 여러 앱 중 특정 앱만 배포하는 흐름을 이해하고 싶은 사람

## 톤

완성된 정답을 던지기보다, 작은 구조가 왜 필요한지 질문에서 출발한다.

예시는 `apps/blog`를 사용하되, 글 안에서는 “블로그 앱”보다 “대상 앱” 또는 “프론트엔드 앱”이라는 표현을 우선한다.

## 시리즈 목차 초안

### 1편: pnpm 모노레포에서 특정 앱을 Docker 이미지로 빌드하기

다룰 내용:

- `packages/ui` 같은 실제 공유 코드 패키지를 앱에서 사용하는 흐름
- Docker build context를 왜 저장소 루트로 두는가
- `pnpm-workspace.yaml`과 `workspace:*`가 Docker 빌드에 미치는 영향
- Docker 캐시를 위해 `package.json`만 먼저 복사하는 이유
- `pnpm -F @atelier/blog build`
- Next.js `output: "standalone"`

### 2편: Docker Compose로 앱 실행 환경 고정하기

다룰 내용:

- 이미지와 컨테이너의 차이
- 컨테이너 이름을 고정하는 이유
- `ports: "3000:3000"`
- Docker Desktop GUI 클릭 실행과 Compose 실행의 차이
- 실행 설정을 파일로 남기는 이유

### 3편: Nginx reverse proxy로 외부 진입점 만들기

다룰 내용:

- 앱 컨테이너 앞에 Nginx를 두는 이유
- 외부 공개 포트와 앱 내부 포트 분리
- Compose 서비스 이름이 내부 DNS처럼 동작하는 방식
- `upstream`, `proxy_pass`
- `localhost:8080 -> nginx -> app:3000`

### 4편: blue-green 배포 구조로 확장하기

다룰 내용:

- `app-blue`, `app-green` 두 슬롯
- 새 버전을 비활성 슬롯에 먼저 띄우기
- health check
- Nginx upstream 전환
- 실패 시 롤백

### 5편: CI/CD 파이프라인으로 자동화하기

다룰 내용:

- lint, typecheck, test, build 순서
- Docker image build
- 이미지 태그 전략
- 서버 배포 스크립트 실행
- secret 관리

### 6편: 운영에 가까운 보완

다룰 내용:

- 로그와 관찰성
- health endpoint
- HTTPS
- 보안 헤더
- 이미지 정리
- 환경 변수 관리

## 글 사이 연결 문장 방향

1편 끝:

```text
이미지를 만들 수 있게 되었지만, 아직 컨테이너 이름과 포트 연결은 명령어 옵션에 흩어져 있다. 다음 글에서는 Docker Compose로 실행 설정을 파일에 고정한다.
```

2편 끝:

```text
컨테이너 실행은 재현 가능해졌지만, 외부 사용자가 앱 컨테이너에 직접 붙는 구조다. 다음 글에서는 Nginx를 앞단에 세워 외부 진입점을 분리한다.
```

3편 끝:

```text
Nginx가 앞단에 생기면 트래픽을 어느 앱 컨테이너로 보낼지 바꿀 수 있다. 다음 글에서는 이 성질을 이용해 blue-green 배포 구조로 확장한다.
```
