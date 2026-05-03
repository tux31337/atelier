# 컨테이너 이름과 네트워크 흐름 정리

## 왜 이름이 헷갈리는가

Docker와 Compose에는 비슷해 보이지만 역할이 다른 이름이 많다.

이번 블로그 배포 연습에서는 특히 다음 이름들이 나온다.

```text
@atelier/blog
atelier-blog:test
blog
atelier-blog
atelier-nginx
atelier_blog
```

각 이름은 쓰이는 위치와 의미가 다르다.

## 패키지 이름

```json
"name": "@atelier/blog"
```

`@atelier/blog`는 pnpm 워크스페이스 패키지 이름이다.

루트에서 다음 명령을 실행할 때 사용한다.

```bash
pnpm -F @atelier/blog build
```

뜻은 워크스페이스 패키지 중 `@atelier/blog`만 골라서 `build` 스크립트를 실행하라는 것이다.

## 이미지 이름

```yaml
image: atelier-blog:test
```

`atelier-blog:test`는 Docker 이미지 이름이다.

이미지는 컨테이너를 만들기 위한 실행 파일 묶음이다. Dockerfile을 빌드하면 이 이미지가 만들어진다.

```bash
docker build -f apps/blog/Dockerfile -t atelier-blog:test .
```

여기서 `atelier-blog`는 이미지 이름이고, `test`는 태그다.

## Compose 서비스 이름

```yaml
services:
  blog:
```

`blog`는 Compose 서비스 이름이다.

Compose 네트워크 안에서는 서비스 이름이 DNS 이름처럼 동작한다. 그래서 Nginx 컨테이너는 다음 주소로 블로그 컨테이너에 접근할 수 있다.

```text
blog:3000
```

Nginx 설정의 이 줄이 바로 그 연결이다.

```nginx
upstream atelier_blog {
  server blog:3000;
}
```

## 컨테이너 이름

```yaml
container_name: atelier-blog
```

`atelier-blog`는 실제 실행되는 블로그 컨테이너 이름이다.

Docker Desktop의 컨테이너 목록이나 `docker ps`에서 보이는 이름이다.

```yaml
container_name: atelier-nginx
```

`atelier-nginx`는 실제 실행되는 Nginx 컨테이너 이름이다.

컨테이너 이름을 지정하지 않으면 Docker가 `quizzical_haslett` 같은 랜덤 이름을 붙인다.

## Nginx upstream 이름

```nginx
upstream atelier_blog {
  server blog:3000;
}
```

`atelier_blog`는 Nginx 설정 안에서만 쓰는 upstream 그룹 이름이다.

이 이름은 Docker 이미지 이름이나 컨테이너 이름이 아니다. Nginx 설정 안에서 `blog:3000` 대상 서버를 묶어 부르기 위한 이름이다.

아래 설정에서 사용된다.

```nginx
proxy_pass http://atelier_blog;
```

## 포트 이름 흐름

현재 Compose 설정에서는 두 경로로 접속할 수 있다.

```text
직접 접근:
브라우저 localhost:3000
  -> atelier-blog 컨테이너 3000
  -> Next.js 앱
```

```text
Nginx 경유:
브라우저 localhost:8080
  -> atelier-nginx 컨테이너 80
  -> Nginx proxy_pass
  -> blog 서비스 3000
  -> atelier-blog 컨테이너 3000
  -> Next.js 앱
```

## 파일별 역할

```text
apps/blog/Dockerfile
  블로그 이미지를 만드는 방법

docker-compose.yml
  blog, nginx 컨테이너를 어떻게 실행할지
  포트를 어떻게 연결할지
  어떤 설정 파일을 마운트할지

infra/nginx/default.conf
  Nginx가 받은 요청을 어디로 넘길지
```

## 한 줄 정리

```text
Dockerfile은 이미지 빌드,
Compose는 컨테이너 실행과 네트워크 연결,
Nginx 설정은 요청 전달 방향을 담당한다.
```
