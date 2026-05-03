#!/usr/bin/env bash
set -euo pipefail

IMAGE="atelier-blog:test"
BUILD=false
PULL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --image|-Image)
      IMAGE="$2"
      shift 2
      ;;
    --build|-Build)
      BUILD=true
      shift
      ;;
    --pull|-Pull)
      PULL=true
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTIVE_FILE="$ROOT/infra/nginx/includes/blog-active.conf"
BLUE_FILE="$ROOT/infra/nginx/includes/blog-blue.conf"
GREEN_FILE="$ROOT/infra/nginx/includes/blog-green.conf"

run_root() {
  (cd "$ROOT" && "$@")
}

is_running() {
  local container="$1"
  local state

  state="$(docker inspect -f "{{.State.Running}}" "$container" 2>/dev/null || true)"
  [[ "$state" == "true" ]]
}

wait_health() {
  local url="$1"
  local timeout_seconds="${2:-90}"
  local deadline=$((SECONDS + timeout_seconds))
  local response

  while (( SECONDS < deadline )); do
    response="$(curl -fsS --max-time 3 "$url" 2>/dev/null || true)"
    if [[ "$response" == *'"ok":true'* && "$response" == *'"app":"blog"'* ]]; then
      return 0
    fi

    sleep 2
  done

  echo "Health check failed: $url" >&2
  return 1
}

ACTIVE_CONTENT="$(cat "$ACTIVE_FILE")"
if [[ "$ACTIVE_CONTENT" == *"blog-green"* ]]; then
  CURRENT_SLOT="green"
  TARGET_SLOT="blue"
else
  CURRENT_SLOT="blue"
  TARGET_SLOT="green"
fi

TARGET_SERVICE="blog-$TARGET_SLOT"
TARGET_CONTAINER="atelier-blog-$TARGET_SLOT"
PREVIOUS_CONTAINER="atelier-blog-$CURRENT_SLOT"

if [[ "$TARGET_SLOT" == "blue" ]]; then
  TARGET_INCLUDE="$BLUE_FILE"
else
  TARGET_INCLUDE="$GREEN_FILE"
fi

TARGET_HEALTH_URL="http://$TARGET_SERVICE:3000/api/health"

echo "Current slot: $CURRENT_SLOT"
echo "Target slot: $TARGET_SLOT"
echo "Image: $IMAGE"

if [[ "$PULL" == true ]]; then
  echo "Pulling image: $IMAGE"
  run_root docker pull "$IMAGE"
fi

echo "Starting target container: $TARGET_CONTAINER"
PREVIOUS_BLOG_IMAGE="${BLOG_IMAGE:-}"
export BLOG_IMAGE="$IMAGE"

if [[ "$BUILD" == true || "$IMAGE" == "atelier-blog:test" ]]; then
  run_root docker compose up --build -d "$TARGET_SERVICE"
else
  run_root docker compose up -d "$TARGET_SERVICE"
fi

if [[ -n "$PREVIOUS_BLOG_IMAGE" ]]; then
  export BLOG_IMAGE="$PREVIOUS_BLOG_IMAGE"
else
  unset BLOG_IMAGE
fi

echo "Waiting for health check: $TARGET_HEALTH_URL"
wait_health "$TARGET_HEALTH_URL"

PREVIOUS_ACTIVE_CONTENT="$(cat "$ACTIVE_FILE")"
SWITCHED=false

rollback() {
  if [[ "$SWITCHED" == true ]]; then
    echo "Switch failed. Restoring previous active upstream."
    printf "%s" "$PREVIOUS_ACTIVE_CONTENT" > "$ACTIVE_FILE"
  fi
}

trap rollback ERR

echo "Switching active upstream to $TARGET_SLOT"
cp "$TARGET_INCLUDE" "$ACTIVE_FILE"
SWITCHED=true

if ! is_running "atelier-nginx"; then
  echo "Starting nginx"
  run_root docker compose up -d nginx
fi

echo "Validating nginx configuration"
run_root docker exec atelier-nginx nginx -t

echo "Reloading nginx"
run_root docker exec atelier-nginx nginx -s reload

trap - ERR

if is_running "$PREVIOUS_CONTAINER"; then
  echo "Stopping previous container: $PREVIOUS_CONTAINER"
  docker stop "$PREVIOUS_CONTAINER" >/dev/null
fi

echo "Blog deployment switched to $TARGET_SLOT."
