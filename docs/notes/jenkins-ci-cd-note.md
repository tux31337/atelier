# Jenkins CI/CD 정리

## 목표

Jenkins가 GitHub 저장소를 읽고, 블로그 앱을 검증한 뒤 Docker 이미지를 만들고, 로컬 registry에 push하고, 선택적으로 blue-green 배포 스크립트까지 실행한다.

## Jenkins 실행 환경

기본 `jenkins/jenkins:lts` 이미지만으로는 Docker, Node.js, pnpm 실행이 부족할 수 있다.

그래서 `infra/jenkins/Dockerfile`에서 Jenkins 이미지에 다음 도구를 추가한다.

```text
Docker CLI
Docker Compose plugin
Node.js
pnpm
Git
```

`docker-compose.jenkins.yml`은 Jenkins 컨테이너에 Docker socket을 연결한다.

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

이렇게 하면 Jenkins 컨테이너 안의 `docker build`가 호스트 Docker Engine에서 실행된다.

## Jenkins Job 설정

Pipeline Job은 `Pipeline script from SCM`을 사용한다.

```text
SCM: Git
Repository URL: https://github.com/tux31337/atelier.git
Branch: */main
Script Path: Jenkinsfile
```

Triggers는 처음에는 비워둔다. 수동으로 `Build with Parameters`를 실행하며 흐름을 검증한다.

## 파라미터

```text
REGISTRY
  기본값: localhost:5000

START_LOCAL_REGISTRY
  true면 Jenkins가 registry 컨테이너를 실행한다.

DEPLOY_LOCAL
  true면 이미지 push 후 로컬 blue-green 배포까지 실행한다.
```

## 파이프라인 단계

```text
Checkout
Prepare
Install
Workspace Checks
Start Local Registry
Build Blog Image
Push Blog Image
Deploy Local
```

`Workspace Checks`는 다음 루트 명령을 실행한다.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 이미지 태그

Jenkins는 현재 커밋 해시를 이미지 태그로 사용한다.

```text
localhost:5000/atelier-blog:30f45bbb59f1
```

이 태그는 어떤 커밋으로 만들어진 이미지인지 추적하기 쉽게 해준다.

## Compose 프로젝트명 문제

Jenkins 작업 폴더가 `atelier-blog`라서 Compose 프로젝트명이 `atelier-blog`로 잡혔다. 로컬에서 이미 `atelier` 프로젝트로 뜬 `atelier-registry` 컨테이너와 이름이 충돌했다.

해결:

```groovy
environment {
  COMPOSE_PROJECT_NAME = 'atelier'
}
```

이렇게 하면 Jenkins와 로컬 명령이 같은 Compose 프로젝트를 바라본다.

## localhost 문제

Jenkins 컨테이너 안에서 `127.0.0.1`은 내 PC가 아니라 Jenkins 컨테이너 자기 자신이다.

그래서 Jenkins에서 실행하는 Linux 배포 스크립트는 health check를 host port가 아니라 Compose 서비스 이름으로 한다.

```text
http://blog-blue:3000/api/health
http://blog-green:3000/api/health
```

Windows PowerShell에서 실행하는 로컬 스크립트는 host port 기준을 사용한다.

```text
http://127.0.0.1:3001/api/health
http://127.0.0.1:3002/api/health
```

## 검증 완료 흐름

성공 로그의 핵심:

```text
Starting target container: atelier-blog-green
Waiting for health check: http://blog-green:3000/api/health
Switching active upstream to green
Validating nginx configuration
Reloading nginx
Stopping previous container: atelier-blog-blue
Blog deployment switched to green.
Finished: SUCCESS
```

## 다음 보완

```text
GitHub webhook
Jenkins credential
실제 배포 서버 SSH 실행
앱별 파이프라인 분리
Docker build cache
rollback 자동화
이미지 정리 정책
```
