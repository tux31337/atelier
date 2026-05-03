# Nginx reverse proxy 정리

## 이번 단계의 목표

이번 단계에서는 브라우저가 블로그 컨테이너에 직접 접속하지 않고 Nginx를 먼저 거치게 만들었다.

흐름은 다음과 같다.

```text
브라우저
  http://localhost:8080
    -> atelier-nginx 컨테이너:80
    -> atelier-blog 컨테이너:3000
```

## 왜 Nginx를 앞에 세우는가

블로그 앱은 여전히 3000번 포트에서 실행된다. 하지만 외부 사용자가 앱 컨테이너에 직접 붙는 구조보다, 앞단의 reverse proxy가 요청을 받아 내부 앱으로 넘겨주는 구조가 배포 연습에 더 가깝다.

Nginx를 앞에 두면 다음 단계를 연습하기 좋아진다.

- 외부 공개 포트와 앱 내부 포트를 분리한다.
- 여러 앱이나 여러 버전의 앱으로 요청을 나눌 수 있다.
- blue-green 배포에서 Nginx가 현재 활성 슬롯으로 트래픽을 넘기는 역할을 할 수 있다.

## Compose 변경

`docker-compose.yml`에 `nginx` 서비스를 추가했다.

```yaml
services:
  nginx:
    container_name: atelier-nginx
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
```

이 설정은 내 컴퓨터의 `localhost:8080`을 Nginx 컨테이너의 80번 포트로 연결한다.

블로그 서비스는 기존처럼 3000번 포트를 열어둔다.

```yaml
blog:
  ports:
    - "3000:3000"
```

그래서 학습 중에는 두 경로를 모두 확인할 수 있다.

```text
http://localhost:3000  -> 블로그 컨테이너 직접 접근
http://localhost:8080  -> Nginx를 거쳐 블로그 컨테이너 접근
```

운영 구조에 더 가까운 방향은 외부에서 블로그 컨테이너에 직접 접근하지 않고 Nginx만 공개하는 것이다. 다만 지금 단계에서는 비교 학습을 위해 직접 접근 포트도 남겨둔다.

## Nginx 설정

Nginx 설정 파일은 `infra/nginx/default.conf`에 있다.

```nginx
upstream atelier_blog {
  server blog:3000;
}
```

Compose 네트워크 안에서는 서비스 이름이 DNS 이름처럼 동작한다. 그래서 Nginx는 `blog:3000`으로 블로그 컨테이너를 찾을 수 있다.

```nginx
location / {
  proxy_pass http://atelier_blog;
}
```

`proxy_pass`는 들어온 요청을 뒤쪽 서버로 넘긴다. 이때 Nginx는 reverse proxy 역할을 한다.

## 실행 명령

루트에서 다음 명령으로 Nginx와 블로그를 함께 띄운다.

```bash
pnpm docker:proxy:up
```

직접 Docker 명령을 쓰면 다음과 같다.

```bash
docker compose up --build nginx
```

접속 주소는 다음이다.

```text
http://localhost:8080
```

중지할 때는 다음 명령을 쓴다.

```bash
pnpm docker:proxy:down
```

## 다음에 이어질 개념

다음 단계의 blue-green 배포에서는 블로그 컨테이너를 `blue`, `green` 두 슬롯으로 나누고, Nginx가 둘 중 하나로 요청을 넘기게 만들 수 있다.

처음에는 사람이 Nginx 설정을 바꾸고 reload하는 방식으로 연습하고, 그 다음 스크립트로 자동화하면 흐름을 이해하기 좋다.
