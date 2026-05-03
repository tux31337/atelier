# 블로그 Docker Compose 정리

## 왜 Dockerfile만으로는 부족한가

Dockerfile은 이미지를 만드는 방법을 적는 파일이다.

하지만 다음 값들은 이미지를 만들 때가 아니라 컨테이너를 실행할 때 정한다.

- 컨테이너 이름
- 내 컴퓨터 포트와 컨테이너 포트의 연결
- 실행 시점의 환경 변수
- 여러 컨테이너를 함께 띄우는 방식

그래서 `apps/blog/Dockerfile`만으로는 Docker Desktop에서 클릭 실행할 때 이름이나 포트 연결을 안정적으로 고정하기 어렵다.

## 이번에 추가한 Compose 설정

루트에 `docker-compose.yml`을 추가했다.

```yaml
services:
  blog:
    container_name: atelier-blog
    ports:
      - "3000:3000"
```

이 설정 덕분에 컨테이너 이름은 `atelier-blog`로 고정되고, Windows의 `localhost:3000`은 컨테이너 안의 `3000`번 포트로 연결된다.

## 실행 명령

루트에서 다음 명령으로 실행한다.

```bash
pnpm docker:blog:up
```

직접 Docker 명령을 쓰면 다음과 같다.

```bash
docker compose up --build blog
```

중지할 때는 다음 명령을 쓴다.

```bash
pnpm docker:blog:down
```

## Docker Desktop GUI와의 차이

Docker Desktop에서 이미지를 클릭해 실행하면 포트 연결이나 컨테이너 이름이 자동으로 원하는 값이 되지 않을 수 있다.

Compose는 실행 설정을 파일로 남기기 때문에 GUI 클릭보다 재현성이 좋다.

앞으로 Nginx, blue-green 배포를 붙일 때도 Compose가 기준점이 된다. Nginx 컨테이너, blue 슬롯, green 슬롯을 같은 파일이나 확장 파일에서 함께 관리할 수 있기 때문이다.
