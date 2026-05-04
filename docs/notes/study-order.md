# 학습 노트 복습 순서

## 목적

이 문서는 `docs/notes` 아래에 쌓이는 학습 노트를 어떤 순서로 읽으면 좋은지 정리한다.

지금 목표는 블로그 앱을 기준으로 pnpm 모노레포, Docker, Nginx, blue-green 배포, CI/CD까지 한 단계씩 이해하는 것이다.

## 1단계: 모노레포 기본 설정

먼저 모노레포 안에서 패키지가 어떻게 연결되는지 이해한다.

1. `tsconfig-package-note.txt`
2. `eslint-config-package-note.txt`
3. `ui-package-note.md`

이 단계에서 볼 개념:

- `packages/*`는 앱 밖의 공유 패키지 영역이다.
- `workspace:*`는 외부 npm이 아니라 같은 저장소 안의 패키지를 연결한다.
- 루트 명령은 여러 앱과 패키지의 명령을 조율한다.
- 공유 UI 패키지는 실제 재사용 가능성이 보이는 작은 primitive부터 시작한다.

## 2단계: 블로그 앱 Docker 이미지

다음으로 블로그 앱 하나를 Docker 이미지로 만드는 흐름을 본다.

1. `blog-dockerfile-note.md`
2. `container-name-and-network-flow.md`

이 단계에서 볼 개념:

- Dockerfile은 이미지를 만드는 설명서다.
- 멀티 스테이지 빌드로 `deps`, `builder`, `runner` 역할을 나눈다.
- Next.js `standalone` 출력은 컨테이너 실행 파일 묶음을 만든다.
- 이미지 이름, 컨테이너 이름, 서비스 이름은 서로 다르다.

## 3단계: Docker Compose 실행

이미지를 직접 실행하는 대신 Compose로 실행 설정을 파일화한다.

1. `docker-compose-blog-note.md`
2. `container-name-and-network-flow.md`

이 단계에서 볼 개념:

- Compose는 컨테이너 이름, 포트 매핑, 환경 변수를 고정한다.
- `ports`는 내 컴퓨터 포트와 컨테이너 포트를 연결한다.
- Docker Desktop GUI 클릭 실행보다 Compose가 재현성이 좋다.

## 4단계: Nginx reverse proxy

이제 블로그 컨테이너 앞에 Nginx를 둔다.

1. `nginx-reverse-proxy-note.md`
2. `container-name-and-network-flow.md`

이 단계에서 볼 개념:

- 브라우저는 `localhost:8080`으로 Nginx에 접속한다.
- Nginx는 Compose 네트워크 안에서 `blog:3000`으로 블로그 컨테이너를 찾는다.
- `proxy_pass`는 요청을 뒤쪽 앱 서버로 넘긴다.

## 5단계: blue-green 배포

Nginx 앞단 구조를 이용해 blue, green 슬롯을 나누고 active upstream을 전환한다.

1. `blue-green-deploy-note.md`
2. `container-name-and-network-flow.md`

이 단계에서 볼 개념:

- `blog-blue`, `blog-green`은 같은 앱을 띄우는 두 실행 자리다.
- Nginx는 `blog-active.conf`를 통해 현재 활성 슬롯을 바라본다.
- 새 슬롯을 먼저 띄우고 health check가 성공한 뒤 active include 파일을 전환한다.
- 실패 중간 상태에서는 active 파일이 살아 있는 슬롯을 보는지 확인한다.

## 6단계: Jenkins CI/CD

로컬 Jenkins가 GitHub 코드를 읽고, 검증과 이미지 빌드, registry push, blue-green 배포 스크립트 실행까지 맡는다.

1. `jenkins-ci-cd-note.md`
2. `blue-green-deploy-note.md`
3. `container-name-and-network-flow.md`

이 단계에서 볼 개념:

- Jenkins도 컨테이너로 실행할 수 있다.
- Jenkins 컨테이너 안에서 Docker를 쓰려면 Docker CLI와 Docker socket 연결이 필요하다.
- Compose 프로젝트명을 고정하지 않으면 작업 폴더명 때문에 컨테이너 이름이 충돌할 수 있다.
- Jenkins 컨테이너 안의 `localhost`는 내 PC가 아니라 Jenkins 컨테이너 자기 자신이다.

## 7단계: 다음 예정

다음에 노트가 추가되면 이 순서로 이어가면 좋다.

1. GitHub webhook으로 push 시 자동 빌드
2. Jenkins credential로 registry 주소와 secret 관리
3. 실제 배포 서버 SSH 실행
4. Docker build cache와 이미지 정리 정책

## 복습할 때 추천 질문

- 이 파일은 이미지를 만드는 파일인가, 컨테이너를 실행하는 파일인가?
- 이 이름은 이미지 이름인가, 서비스 이름인가, 컨테이너 이름인가?
- 이 포트는 내 컴퓨터 포트인가, 컨테이너 내부 포트인가?
- 이 설정은 빌드 시점에 필요한가, 실행 시점에 필요한가?
