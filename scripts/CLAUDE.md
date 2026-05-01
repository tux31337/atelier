# scripts/

Phase 기반 step 실행 하네스. atelier 의 phase 디렉터리를 순차 실행하고, 단계별 자동 커밋·브랜치 관리·가드레일 로딩까지 처리한다.

## Owns

- `execute.py` — `phases/{phase}/index.json` 안의 step 을 순차 실행하고 `feat:` + `chore:` 두 종 커밋을 단계별로 만든다.
- `test_execute.py` — `execute.py` 리팩터링 안전망. pytest 기반.
- 진행 표시기 (`progress_indicator`), KST 타임스탬프, `feat-{phase}` 브랜치 자동 체크아웃 같은 하네스 유틸.

## Common workflow

```bash
python scripts/execute.py <phase-dir>          # phase 실행 (예: 0-mvp)
python scripts/execute.py <phase-dir> --push   # 단계별 자동 push
python -m pytest scripts/test_execute.py       # 리팩터링 회귀 검증
```

새 phase 를 추가할 때는 `phases/{name}/index.json` 과 step 파일만 만든다. 이 디렉터리 코드는 손대지 않는다.

## Why: 비자명한 규칙

- **Important:** `ROOT` 는 `scripts/` 의 부모로 고정 (`Path(__file__).resolve().parent.parent`). 어디서 실행해도 같은 워크스페이스를 잡는다.
- **자동 커밋이 `git add -A` 를 쓴다**. 실행 직전 working tree 에 미커밋 변경이 남아 있으면 함께 끌려간다. 실행 전에 깨끗이 정리할 것.
- **브랜치 규약은 `feat-{phase_name}`**. step 진입 시 자동 전환되며, 다른 브랜치 작업과 충돌하면 stash / commit 후 다시 시도해야 한다.
- **stdlib 만 사용**. 런타임 의존성을 추가하지 말 것. pytest 만 dev 의존으로 허용.
- **하네스가 가드레일 (`CLAUDE.md`, `docs/`) 을 읽어 step 컨텍스트에 주입한다**. 이 두 위치가 이동하면 `execute.py` 의 `_load_guardrails` 도 같은 변경으로 손봐야 한다.

## Dependencies / See also

- 루트 가드레일: [`../CLAUDE.md`](../CLAUDE.md), [`../AGENTS.md`](../AGENTS.md), [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md), [`../docs/ADR.md`](../docs/ADR.md)
- 실행 대상: 워크스페이스 루트의 `phases/` 디렉터리 (현 시점 미생성 — 첫 phase 가 들어올 때 생성된다)
- 외부 의존: 안전망 테스트가 `pytest` 에 의존
