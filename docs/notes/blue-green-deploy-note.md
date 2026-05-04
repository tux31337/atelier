# blue-green 배포 정리

## 목표

블로그 앱을 `blog-blue`, `blog-green` 두 슬롯으로 나누고, Nginx가 현재 활성 슬롯만 바라보게 한다.

배포는 새 이미지를 비활성 슬롯에 먼저 띄운 뒤 health check를 통과하면 Nginx active include 파일을 바꾸는 방식으로 진행한다.

## 슬롯 구조

```text
blog-blue
  container: atelier-blog-blue
  host port: 3001
  internal address: blog-blue:3000

blog-green
  container: atelier-blog-green
  host port: 3002
  internal address: blog-green:3000
```

## Nginx active 파일

Nginx는 `infra/nginx/includes/blog-active.conf`를 include한다.

이 파일이 blue를 가리키면:

```nginx
upstream atelier_blog {
  server blog-blue:3000;
}
```

green을 가리키면:

```nginx
upstream atelier_blog {
  server blog-green:3000;
}
```

## 배포 순서

```text
현재 active 슬롯 확인
반대 슬롯 target 결정
이미지 pull
target 컨테이너 실행
target health check
active include 파일 전환
nginx -t
nginx reload
이전 슬롯 중지
```

## health check 순서가 중요한 이유

active include 파일을 먼저 바꾸면 새 컨테이너가 죽어 있을 때 사용자가 502를 만난다.

그래서 반드시:

```text
새 슬롯 실행
  -> health check 성공
  -> active 전환
```

순서로 진행한다.

## 실패 중간 상태

실습 중 active 파일은 `blog-green`을 보고 있는데 실제로는 `atelier-blog-blue`만 떠 있는 상태가 있었다.

이때 Nginx는 다음 흐름으로 실패한다.

```text
nginx -> blog-green:3000 -> 없음 -> 502
```

복구는 살아 있는 슬롯의 include 파일을 active 파일로 복사하고 Nginx를 reload하면 된다.

```powershell
Copy-Item C:\study\atelier\infra\nginx\includes\blog-blue.conf C:\study\atelier\infra\nginx\includes\blog-active.conf -Force
docker exec atelier-nginx nginx -s reload
```

## 한 줄 정리

blue-green 배포는 두 슬롯과 하나의 Nginx active pointer를 다루는 문제다.
