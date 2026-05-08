import type { ComponentPropsWithoutRef } from "react";
import {
  ArrowDown,
  ArrowRight,
  Braces,
  Clock3,
  Lightbulb,
  MousePointerClick,
  Network,
  RotateCw,
  Zap,
} from "lucide-react";

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type ParaProps = ComponentPropsWithoutRef<"p">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;

type CalloutProps = { children: React.ReactNode; title?: string };

const pipelineSteps = [
  {
    title: "HTML",
    description: "문서 구조를 읽는다",
  },
  {
    title: "DOM",
    description: "요소 관계를 트리로 만든다",
  },
  {
    title: "CSSOM",
    description: "스타일 규칙을 계산한다",
  },
  {
    title: "Render Tree",
    description: "실제로 그릴 노드를 고른다",
  },
  {
    title: "Layout",
    description: "크기와 위치를 계산한다",
  },
  {
    title: "Paint",
    description: "색, 글자, 그림자를 칠한다",
  },
  {
    title: "Composite",
    description: "레이어를 합쳐 화면을 만든다",
  },
];

const eventSources = [
  {
    title: "setTimeout",
    description: "시간이 지나면 callback을 보낸다",
    icon: Clock3,
  },
  {
    title: "click",
    description: "사용자 입력을 이벤트로 보낸다",
    icon: MousePointerClick,
  },
  {
    title: "fetch",
    description: "응답 뒤 Promise 후속 작업으로 이어진다",
    icon: Network,
  },
];

const orderSteps = [
  {
    step: "1",
    title: "동기 코드",
    description: "지금 콜 스택에서 바로 실행",
    items: ["console.log('A')", "console.log('D')"],
  },
  {
    step: "2",
    title: "마이크로태스크",
    description: "현재 작업 직후 먼저 비움",
    items: ["Promise.then -> C"],
  },
  {
    step: "3",
    title: "매크로태스크",
    description: "다음 큰 작업 차례에 실행",
    items: ["setTimeout -> B"],
  },
];

const gitCommandAtlas = [
  {
    title: "이력을 합치거나 옮기기",
    commands: ["merge", "rebase", "cherry-pick"],
    description: "브랜치 사이의 커밋 흐름을 이어 붙이거나 특정 커밋만 골라 옮긴다.",
  },
  {
    title: "되돌리기",
    commands: ["revert", "reset", "restore"],
    description: "커밋 이력을 남긴 채 취소할지, 브랜치 위치를 되감을지, 파일만 원복할지 나눈다.",
  },
  {
    title: "위치 바꾸기",
    commands: ["switch", "checkout"],
    description: "브랜치나 특정 커밋으로 이동한다. 최신 Git에서는 switch와 restore로 역할이 분리됐다.",
  },
  {
    title: "작업 저장하기",
    commands: ["add", "commit", "stash"],
    description: "현재 변경을 스테이징하거나 기록으로 남기거나 잠깐 서랍에 넣어 둔다.",
  },
];

const gitStrategyCards = [
  {
    title: "Git Flow",
    fit: "릴리스 절차가 길고 단계가 분명한 팀",
    points: ["브랜치 역할이 선명하다", "release/hotfix 흐름이 익숙하다", "구조가 무거워질 수 있다"],
  },
  {
    title: "GitHub Flow",
    fit: "작고 빠른 제품 팀",
    points: ["main을 항상 배포 가능 상태로 둔다", "기능 브랜치와 PR 중심이다", "구조가 단순하다"],
  },
  {
    title: "Trunk-Based",
    fit: "CI가 빠르고 자주 통합하는 팀",
    points: ["짧은 브랜치 수명", "기능 플래그와 궁합이 좋다", "자동화가 약하면 부담이 커진다"],
  },
  {
    title: "Release Branch",
    fit: "여러 버전을 병행 유지하는 팀",
    points: ["운영 버전 관리가 쉽다", "핫픽스 전달 경로가 분명하다", "브랜치 관리 복잡도가 높다"],
  },
];

const timerSteps = [
  {
    step: "01",
    title: "start 출력",
    stack: ["global"],
    browser: [],
    queue: [],
    output: ["start"],
  },
  {
    step: "02",
    title: "setTimeout 등록",
    stack: ["setTimeout", "global"],
    browser: ["Timer: 1000ms 대기"],
    queue: [],
    output: ["start"],
  },
  {
    step: "03",
    title: "end 출력",
    stack: ["global"],
    browser: ["Timer: 대기 중"],
    queue: [],
    output: ["start", "end"],
  },
  {
    step: "04",
    title: "callback 줄 서기",
    stack: [],
    browser: ["Timer 완료"],
    queue: ["() => console.log('timer')"],
    output: ["start", "end"],
  },
  {
    step: "05",
    title: "timer 출력",
    stack: ["timer callback"],
    browser: [],
    queue: [],
    output: ["start", "end", "timer"],
  },
];

const eventListenerSteps = [
  {
    step: "01",
    title: "이벤트 리스너 등록",
    stack: ["addEventListener", "global"],
    browser: ["click 감시 시작"],
    queue: [],
    output: [],
  },
  {
    step: "02",
    title: "전역 코드 종료",
    stack: [],
    browser: ["click 감시 중"],
    queue: [],
    output: [],
  },
  {
    step: "03",
    title: "사용자가 버튼 클릭",
    stack: [],
    browser: ["click 이벤트 감지"],
    queue: ["click handler"],
    output: [],
  },
  {
    step: "04",
    title: "핸들러 실행",
    stack: ["click handler"],
    browser: [],
    queue: [],
    output: ["clicked"],
  },
];

const promiseSteps = [
  {
    step: "01",
    title: "start 출력",
    stack: ["global"],
    microtask: [],
    output: ["start"],
  },
  {
    step: "02",
    title: "then callback 등록",
    stack: ["global"],
    microtask: ["() => console.log('promise')"],
    output: ["start"],
  },
  {
    step: "03",
    title: "end 출력",
    stack: ["global"],
    microtask: ["() => console.log('promise')"],
    output: ["start", "end"],
  },
  {
    step: "04",
    title: "전역 코드 종료",
    stack: [],
    microtask: ["() => console.log('promise')"],
    output: ["start", "end"],
  },
  {
    step: "05",
    title: "마이크로태스크 실행",
    stack: ["promise callback"],
    microtask: [],
    output: ["start", "end", "promise"],
  },
];

const mixedTaskSteps = [
  {
    step: "01",
    title: "A 출력",
    stack: ["global"],
    microtask: [],
    macrotask: [],
    output: ["A"],
  },
  {
    step: "02",
    title: "setTimeout 예약",
    stack: ["global"],
    microtask: [],
    macrotask: ["B 출력 대기"],
    output: ["A"],
  },
  {
    step: "03",
    title: "Promise.then 예약",
    stack: ["global"],
    microtask: ["C 출력 대기"],
    macrotask: ["B 출력 대기"],
    output: ["A"],
  },
  {
    step: "04",
    title: "D 출력 후 전역 코드 종료",
    stack: [],
    microtask: ["C 출력 대기"],
    macrotask: ["B 출력 대기"],
    output: ["A", "D"],
  },
  {
    step: "05",
    title: "Microtask 먼저 실행",
    stack: ["promise callback"],
    microtask: [],
    macrotask: ["B 출력 대기"],
    output: ["A", "D", "C"],
  },
  {
    step: "06",
    title: "다음 Macrotask 실행",
    stack: ["timer callback"],
    microtask: [],
    macrotask: [],
    output: ["A", "D", "C", "B"],
  },
];

const asyncAwaitSteps = [
  {
    step: "01",
    title: "script start 출력",
    stack: ["global"],
    microtask: [],
    output: ["script start"],
  },
  {
    step: "02",
    title: "run() 실행",
    stack: ["run", "global"],
    microtask: [],
    output: ["script start", "run start"],
  },
  {
    step: "03",
    title: "await에서 잠시 끊김",
    stack: ["global"],
    microtask: ["await 이후 코드"],
    output: ["script start", "run start"],
  },
  {
    step: "04",
    title: "script end 출력",
    stack: ["global"],
    microtask: ["await 이후 코드"],
    output: ["script start", "run start", "script end"],
  },
  {
    step: "05",
    title: "await 이후 코드 실행",
    stack: ["run continuation"],
    microtask: [],
    output: ["script start", "run start", "script end", "run end: Ada"],
  },
];

const loopCycleSteps = [
  {
    step: "01",
    title: "Call Stack 확인",
    description: "지금 실행 중인 함수가 남아 있으면 그대로 기다린다.",
    badge: "비어야 다음 단계",
  },
  {
    step: "02",
    title: "Microtask Queue 비우기",
    description: "Promise.then, await 이후 코드처럼 급한 후속 작업을 먼저 모두 처리한다.",
    badge: "전부 처리",
  },
  {
    step: "03",
    title: "렌더링 기회",
    description: "필요하면 브라우저가 스타일, 레이아웃, 페인트를 갱신할 시간을 얻는다.",
    badge: "필요할 때",
  },
  {
    step: "04",
    title: "Macrotask 하나 실행",
    description: "setTimeout, click handler 같은 다음 큰 작업 하나를 콜 스택에 올린다.",
    badge: "하나만",
  },
];

const callStackFrames = [
  {
    step: "01",
    title: "전역 코드 시작",
    frames: ["global"],
    note: "파일의 바깥 코드가 실행된다.",
  },
  {
    step: "02",
    title: "first() 호출",
    frames: ["first", "global"],
    note: "global 위에 first가 쌓인다.",
  },
  {
    step: "03",
    title: "second() 호출",
    frames: ["second", "first", "global"],
    note: "first 안에서 second가 실행된다.",
  },
  {
    step: "04",
    title: "third() 호출",
    frames: ["third", "second", "first", "global"],
    note: "가장 위의 third가 지금 실행 중이다.",
  },
  {
    step: "05",
    title: "함수들이 끝남",
    frames: ["global"],
    note: "third, second, first 순서로 빠진다.",
  },
  {
    step: "06",
    title: "전역 코드 종료",
    frames: [],
    note: "실행할 코드가 없어 콜 스택이 빈다.",
  },
];

const starvationSteps = [
  {
    step: "01",
    title: "마이크로태스크 실행",
    microtask: ["loop()"],
    macrotask: ["setTimeout callback"],
    browser: "다음 단계로 넘어가려 함",
  },
  {
    step: "02",
    title: "새 마이크로태스크 추가",
    microtask: ["loop()", "loop()"],
    macrotask: ["setTimeout callback"],
    browser: "큐가 아직 비지 않음",
  },
  {
    step: "03",
    title: "계속 먼저 처리",
    microtask: ["loop()", "loop()", "loop()"],
    macrotask: ["setTimeout callback"],
    browser: "렌더링과 다음 태스크가 밀림",
  },
];

const promiseExecutorSteps = [
  {
    step: "01",
    title: "Promise 객체 생성",
    stack: ["global"],
    promise: ["pending"],
    microtask: [],
    output: [],
  },
  {
    step: "02",
    title: "executor 즉시 실행",
    stack: ["executor", "global"],
    promise: ["pending"],
    microtask: [],
    output: ["executor"],
  },
  {
    step: "03",
    title: "resolve 호출",
    stack: ["resolve", "executor", "global"],
    promise: ["fulfilled: done"],
    microtask: [],
    output: ["executor"],
  },
  {
    step: "04",
    title: "resolve 종료",
    stack: ["executor", "global"],
    promise: ["fulfilled: done"],
    microtask: [],
    output: ["executor"],
  },
  {
    step: "05",
    title: "then callback 예약",
    stack: ["global"],
    promise: ["fulfilled: done"],
    microtask: ["then callback 대기"],
    output: ["executor"],
  },
  {
    step: "06",
    title: "동기 코드 종료 후 실행",
    stack: ["then callback"],
    promise: ["fulfilled: done"],
    microtask: [],
    output: ["executor", "then: done"],
  },
];

const promiseApiSteps = [
  {
    step: "01",
    title: "fetch 호출",
    stack: ["fetch", "global"],
    promise: ["pending"],
    browser: ["network request 시작"],
    microtask: [],
  },
  {
    step: "02",
    title: "then callback 등록",
    stack: ["global"],
    promise: ["pending"],
    browser: ["network request 진행 중"],
    microtask: [],
  },
  {
    step: "03",
    title: "응답 도착",
    stack: [],
    promise: ["fulfilled: response"],
    browser: ["network 완료"],
    microtask: ["then callback 대기"],
  },
  {
    step: "04",
    title: "then callback 실행",
    stack: ["then callback"],
    promise: ["fulfilled: response"],
    browser: [],
    microtask: [],
  },
];

const promiseChainSteps = [
  {
    step: "01",
    title: "첫 번째 then",
    description: "이전 Promise의 값을 받고 새 값을 return한다.",
    input: "1",
    output: "2",
  },
  {
    step: "02",
    title: "두 번째 then",
    description: "앞 then이 돌려준 값을 다음 then이 받는다.",
    input: "2",
    output: "20",
  },
  {
    step: "03",
    title: "세 번째 then",
    description: "체인의 마지막 값으로 이어진다.",
    input: "20",
    output: "result: 20",
  },
];

function RenderingPipeline() {
  return (
    <div className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <div className="grid gap-3 md:grid-cols-7 md:items-stretch">
        {pipelineSteps.map((step, index) => (
          <div key={step.title} className="flex items-stretch gap-3 md:block">
            <div className="relative flex min-h-24 flex-1 flex-col justify-between rounded-md border border-border bg-card p-4">
              <span className="font-code-label text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong className="block font-headline-lg text-base text-secondary">
                  {step.title}
                </strong>
                <span className="mt-2 block font-body-md text-sm leading-relaxed text-on-surface-variant">
                  {step.description}
                </span>
              </div>
            </div>
            {index < pipelineSteps.length - 1 && (
              <div className="flex items-center justify-center text-muted-foreground md:my-3">
                <ArrowRight className="size-4 rotate-90 md:rotate-0" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <span className="font-code-label text-xs text-muted-foreground">{title}</span>
      <div className="mt-2 min-h-11 rounded border border-border bg-surface-container-high p-2">
        {items.length > 0 ? (
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={`${item}-${index}`} className="font-code-label text-xs text-on-surface">
                {item}
              </div>
            ))}
          </div>
        ) : (
          <span className="font-code-label text-xs text-muted-foreground">비어 있음</span>
        )}
      </div>
    </div>
  );
}

function TimerFlowDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        setTimeout 예제 실행 흐름
      </figcaption>
      <div className="space-y-3">
        {timerSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < timerSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniList title="Call Stack" items={item.stack} />
                <MiniList title="Browser" items={item.browser} />
                <MiniList title="Macrotask Queue" items={item.queue} />
                <MiniList title="출력" items={item.output} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function EventListenerFlowDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        click 이벤트 리스너 실행 흐름
      </figcaption>
      <div className="space-y-3">
        {eventListenerSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < eventListenerSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniList title="Call Stack" items={item.stack} />
                <MiniList title="Browser" items={item.browser} />
                <MiniList title="Macrotask Queue" items={item.queue} />
                <MiniList title="출력" items={item.output} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function PromiseFlowDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        Promise.then 예제 실행 흐름
      </figcaption>
      <div className="space-y-3">
        {promiseSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < promiseSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MiniList title="Call Stack" items={item.stack} />
                <MiniList title="Microtask Queue" items={item.microtask} />
                <MiniList title="출력" items={item.output} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function MixedTaskFlowDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        Promise와 setTimeout이 같이 있을 때
      </figcaption>
      <div className="space-y-3">
        {mixedTaskSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < mixedTaskSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniList title="Call Stack" items={item.stack} />
                <MiniList title="Microtask Queue" items={item.microtask} />
                <MiniList title="Macrotask Queue" items={item.macrotask} />
                <MiniList title="출력" items={item.output} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function AsyncAwaitFlowDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        async/await 실행 흐름
      </figcaption>
      <div className="space-y-3">
        {asyncAwaitSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < asyncAwaitSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MiniList title="Call Stack" items={item.stack} />
                <MiniList title="Microtask Queue" items={item.microtask} />
                <MiniList title="출력" items={item.output} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function EventLoopCycleDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        이벤트 루프가 한 바퀴 도는 방식
      </figcaption>
      <div className="grid gap-3">
        {loopCycleSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < loopCycleSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="font-headline-lg text-base text-secondary">
                  {item.title}
                </strong>
                <span className="rounded border border-border bg-surface-container-high px-2 py-1 font-code-label text-xs text-muted-foreground">
                  {item.badge}
                </span>
              </div>
              <p className="mt-3 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function CallStackDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        함수 호출이 콜 스택에 쌓이는 모습
      </figcaption>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {callStackFrames.map((item) => (
          <div key={item.step} className="rounded-md border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <span className="rounded border border-border bg-surface-container-high px-2 py-1 font-code-label text-xs text-muted-foreground">
                {item.step}
              </span>
            </div>
            <div className="flex min-h-44 flex-col justify-end gap-2 rounded border border-border bg-surface-container-high p-3">
              {item.frames.length > 0 ? (
                item.frames.map((frame, index) => (
                  <div
                    key={`${item.step}-${frame}`}
                    className="rounded border border-border bg-card px-3 py-2 font-code-label text-sm text-on-surface"
                  >
                    {frame}
                    {index === 0 ? (
                      <span className="ml-2 text-xs text-muted-foreground">실행 중</span>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded border border-border bg-card px-3 py-2 font-code-label text-sm text-muted-foreground">
                  empty
                </div>
              )}
            </div>
            <p className="mt-3 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function MicrotaskStarvationDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        마이크로태스크가 계속 늘어나면 생기는 일
      </figcaption>
      <div className="grid gap-3 md:grid-cols-3">
        {starvationSteps.map((item) => (
          <div key={item.step} className="rounded-md border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <span className="rounded border border-border bg-surface-container-high px-2 py-1 font-code-label text-xs text-muted-foreground">
                {item.step}
              </span>
            </div>
            <div className="space-y-3">
              <MiniList title="Microtask Queue" items={item.microtask} />
              <MiniList title="Macrotask Queue" items={item.macrotask} />
              <div className="rounded border border-border bg-surface-container-high p-3">
                <span className="font-code-label text-xs text-muted-foreground">브라우저</span>
                <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                  {item.browser}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function PromiseLifecycleDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        Promise 상태 변화
      </figcaption>
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1.2fr_auto_1fr] md:items-center">
        <div className="rounded-md border border-border bg-card p-4">
          <span className="font-code-label text-xs text-muted-foreground">01</span>
          <strong className="mt-3 block font-headline-lg text-lg text-secondary">pending</strong>
          <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            아직 결과가 정해지지 않은 상태다.
          </p>
        </div>

        <div className="flex justify-center text-muted-foreground">
          <ArrowRight className="hidden size-5 md:block" />
          <ArrowDown className="size-5 md:hidden" />
        </div>

        <div className="grid gap-3">
          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <strong className="font-headline-lg text-base text-secondary">fulfilled</strong>
              <span className="rounded border border-border bg-surface-container-high px-2 py-1 font-code-label text-xs text-muted-foreground">
                성공
              </span>
            </div>
            <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
              resolve(value)로 성공 값이 정해진다.
            </p>
          </div>

          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <strong className="font-headline-lg text-base text-secondary">rejected</strong>
              <span className="rounded border border-border bg-surface-container-high px-2 py-1 font-code-label text-xs text-muted-foreground">
                실패
              </span>
            </div>
            <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
              reject(error)나 throw로 실패 이유가 정해진다.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-muted-foreground">
          <ArrowRight className="hidden size-5 md:block" />
          <ArrowDown className="size-5 md:hidden" />
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <span className="font-code-label text-xs text-muted-foreground">03</span>
          <strong className="mt-3 block font-headline-lg text-lg text-secondary">settled</strong>
          <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            성공이든 실패든 한 번 정해지면 다시 바뀌지 않는다.
          </p>
        </div>
      </div>
    </figure>
  );
}

function PromiseExecutorDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        Promise 코드에서 바로 도는 것과 나중에 도는 것
      </figcaption>
      <div className="space-y-3">
        {promiseExecutorSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < promiseExecutorSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniList title="Call Stack" items={item.stack} />
                <MiniList title="Promise 상태" items={item.promise} />
                <MiniList title="Microtask Queue" items={item.microtask} />
                <MiniList title="출력" items={item.output} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function PromiseApiFlowDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        API 호출로 보는 Promise 흐름
      </figcaption>
      <div className="space-y-3">
        {promiseApiSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < promiseApiSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">
                {item.title}
              </strong>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniList title="Call Stack" items={item.stack} />
                <MiniList title="Promise 상태" items={item.promise} />
                <MiniList title="Browser" items={item.browser} />
                <MiniList title="Microtask Queue" items={item.microtask} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function PromiseChainDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        then 체인은 값을 다음 Promise로 넘긴다
      </figcaption>
      <div className="grid gap-3 md:grid-cols-3">
        {promiseChainSteps.map((item, index) => (
          <div key={item.step} className="flex gap-3 md:block">
            <div className="flex min-h-56 flex-1 flex-col rounded-md border border-border bg-card p-4">
              <span className="mb-4 flex size-8 items-center justify-center rounded-full border border-border bg-surface-container-high font-code-label text-sm text-secondary">
                {item.step}
              </span>
              <strong className="font-headline-lg text-lg text-secondary">{item.title}</strong>
              <p className="mt-2 mb-4 font-body-md text-sm leading-relaxed text-on-surface-variant">
                {item.description}
              </p>
              <MiniList title="받는 값" items={[item.input]} />
              <div className="mt-3">
                <MiniList title="넘기는 값" items={[item.output]} />
              </div>
            </div>
            {index < promiseChainSteps.length - 1 && (
              <div className="flex items-center justify-center text-muted-foreground md:hidden">
                <ArrowDown className="size-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}

function EventLoopDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        자바스크립트 실행 흐름 한 장으로 보기
      </figcaption>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.1fr] lg:items-center">
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Braces className="size-4 text-secondary" />
              <strong className="font-headline-lg text-base text-secondary">
                Call Stack
              </strong>
            </div>
            <div className="space-y-2 font-code-label text-sm">
              <div className="rounded border border-border bg-surface-container-high px-3 py-2 text-on-surface">
                console.log(&quot;D&quot;)
              </div>
              <div className="rounded border border-border bg-surface-container-high px-3 py-2 text-on-surface">
                global script
              </div>
            </div>
            <p className="mt-3 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
              지금 실행 중인 함수가 위에 쌓이고, 끝나면 위에서부터 빠진다.
            </p>
          </div>

          <div className="rounded-md border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <RotateCw className="size-4 text-secondary" />
              <strong className="font-headline-lg text-base text-secondary">
                Event Loop
              </strong>
            </div>
            <p className="mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
              콜 스택이 비는 순간을 보고, 먼저 마이크로태스크를 비운 뒤 다음
              매크로태스크를 올린다.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-muted-foreground lg:block">
          <ArrowRight className="hidden size-6 lg:block" />
          <ArrowDown className="size-6 lg:hidden" />
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-border bg-card p-4">
            <strong className="font-headline-lg text-base text-secondary">Web API</strong>
            <div className="mt-3 grid gap-3 md:grid-cols-3 lg:grid-cols-1">
              {eventSources.map((source) => {
                const Icon = source.icon;
                return (
                  <div
                    key={source.title}
                    className="rounded border border-border bg-surface-container-high p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-secondary" />
                      <span className="font-code-label text-sm text-on-surface">
                        {source.title}
                      </span>
                    </div>
                    <span className="mt-2 block font-body-md text-sm leading-relaxed text-on-surface-variant">
                      {source.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="size-4 text-secondary" />
                <strong className="font-headline-lg text-base text-secondary">
                  Microtask Queue
                </strong>
              </div>
              <div className="rounded border border-border bg-surface-container-high px-3 py-2 font-code-label text-sm text-on-surface">
                Promise.then
              </div>
              <p className="mt-3 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                지금 작업이 끝나자마자 먼저 처리한다.
              </p>
            </div>

            <div className="rounded-md border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Clock3 className="size-4 text-secondary" />
                <strong className="font-headline-lg text-base text-secondary">
                  Macrotask Queue
                </strong>
              </div>
              <div className="rounded border border-border bg-surface-container-high px-3 py-2 font-code-label text-sm text-on-surface">
                setTimeout
              </div>
              <p className="mt-3 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                다음 큰 작업 차례를 기다린다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function TaskOrderDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        A, D, C, B가 되는 순서
      </figcaption>
      <div className="grid gap-3 md:grid-cols-3">
        {orderSteps.map((item, index) => (
          <div key={item.step} className="flex gap-3 md:block">
            <div className="flex min-h-52 flex-1 flex-col rounded-md border border-border bg-card p-4">
              <span className="mb-4 flex size-8 items-center justify-center rounded-full border border-border bg-surface-container-high font-code-label text-sm text-secondary">
                {item.step}
              </span>
              <strong className="font-headline-lg text-lg text-secondary">{item.title}</strong>
              <span className="mt-2 font-body-md text-sm leading-relaxed text-on-surface-variant">
                {item.description}
              </span>
              <div className="mt-4 space-y-2">
                {item.items.map((queueItem) => (
                  <div
                    key={queueItem}
                    className="rounded border border-border bg-surface-container-high px-3 py-2 font-code-label text-sm text-on-surface"
                  >
                    {queueItem}
                  </div>
                ))}
              </div>
            </div>
            {index < orderSteps.length - 1 && (
              <div className="flex items-center justify-center text-muted-foreground md:hidden">
                <ArrowDown className="size-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}

function GitCommandAtlasDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        Git 명령어를 질문별로 나누면
      </figcaption>
      <div className="grid gap-3 md:grid-cols-2">
        {gitCommandAtlas.map((group) => (
          <div key={group.title} className="rounded-md border border-border bg-card p-4">
            <strong className="font-headline-lg text-lg text-secondary">{group.title}</strong>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.commands.map((command) => (
                <span
                  key={command}
                  className="rounded-full border border-border bg-surface-container-high px-3 py-1 font-code-label text-xs text-on-surface"
                >
                  {command}
                </span>
              ))}
            </div>
            <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
              {group.description}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function GitRebaseRevertDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        rebase와 revert가 실제로 바꾸는 것
      </figcaption>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <strong className="font-headline-lg text-lg text-secondary">rebase</strong>
            <span className="rounded-full border border-border bg-surface-container-high px-3 py-1 font-code-label text-xs text-on-surface">
              히스토리 재배치
            </span>
          </div>
          <div className="space-y-3 font-code-label text-sm text-on-surface">
            <div className="rounded border border-border bg-surface-container-high p-3">
              <div>main: A --- B --- C --- F</div>
              <div>feature:          D --- E</div>
            </div>
            <div className="flex justify-center text-muted-foreground">
              <ArrowDown className="size-4" />
            </div>
            <div className="rounded border border-border bg-surface-container-high p-3">
              <div>main: A --- B --- C --- F</div>
              <div>feature:              D&apos; --- E&apos;</div>
            </div>
          </div>
          <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            기존 feature 커밋을 최신 기반 위에 다시 적용한다. 그래서 커밋 ID가 바뀔 수 있다.
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <strong className="font-headline-lg text-lg text-secondary">revert</strong>
            <span className="rounded-full border border-border bg-surface-container-high px-3 py-1 font-code-label text-xs text-on-surface">
              취소 커밋 추가
            </span>
          </div>
          <div className="space-y-3 font-code-label text-sm text-on-surface">
            <div className="rounded border border-border bg-surface-container-high p-3">
              <div>main: A --- B --- C --- D</div>
            </div>
            <div className="flex justify-center text-muted-foreground">
              <ArrowDown className="size-4" />
            </div>
            <div className="rounded border border-border bg-surface-container-high p-3">
              <div>main: A --- B --- C --- D --- R</div>
              <div className="mt-2 text-muted-foreground">R = C를 취소하는 새 커밋</div>
            </div>
          </div>
          <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            기존 이력은 그대로 두고, 반대 작업을 담은 새 커밋을 쌓는다. 공유 브랜치에서 안전한 편이다.
          </p>
        </div>
      </div>
    </figure>
  );
}

function GitMergeRebaseCherryPickDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        merge, rebase, cherry-pick을 한 화면에 놓으면
      </figcaption>
      <div className="grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-border bg-card p-4">
          <strong className="font-headline-lg text-lg text-secondary">merge</strong>
          <div className="mt-4 rounded border border-border bg-surface-container-high p-3 font-code-label text-sm text-on-surface">
            <div>main:    A --- B --- C -------- M</div>
            <div>                    \         /</div>
            <div>feature:             D --- E --</div>
          </div>
          <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            두 갈래의 역사를 모두 남기며 합친다.
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <strong className="font-headline-lg text-lg text-secondary">rebase</strong>
          <div className="mt-4 rounded border border-border bg-surface-container-high p-3 font-code-label text-sm text-on-surface">
            <div>main:    A --- B --- C --- F</div>
            <div>                           \</div>
            <div>feature:                    D&apos; --- E&apos;</div>
          </div>
          <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            feature 커밋을 새 기반 위에 다시 얹어 선형 흐름을 만든다.
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <strong className="font-headline-lg text-lg text-secondary">cherry-pick</strong>
          <div className="mt-4 rounded border border-border bg-surface-container-high p-3 font-code-label text-sm text-on-surface">
            <div>main:    A --- B --- C --- E&apos;</div>
            <div>feature:      \</div>
            <div>               D --- E --- F</div>
          </div>
          <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            브랜치 전체가 아니라 필요한 커밋 하나만 골라서 옮긴다.
          </p>
        </div>
      </div>
    </figure>
  );
}

function GitResetRestoreDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        reset과 restore는 건드리는 대상이 다르다
      </figcaption>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_auto_1fr] lg:items-center">
        <div className="rounded-md border border-border bg-card p-4">
          <strong className="font-headline-lg text-lg text-secondary">reset</strong>
          <div className="mt-4 rounded border border-border bg-surface-container-high p-3 font-code-label text-sm text-on-surface">
            <div>main: A --- B --- C --- D</div>
            <div>                    ^ HEAD</div>
          </div>
          <div className="mt-3 flex justify-center text-muted-foreground">
            <ArrowDown className="size-4" />
          </div>
          <div className="rounded border border-border bg-surface-container-high p-3 font-code-label text-sm text-on-surface">
            <div>git reset --hard B</div>
            <div className="mt-2">main: A --- B</div>
          </div>
          <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            브랜치가 가리키는 위치를 움직인다. 옵션에 따라 스테이징과 작업 파일도 함께 되감긴다.
          </p>
        </div>

        <div className="flex justify-center text-muted-foreground lg:block">
          <ArrowRight className="hidden size-5 lg:block" />
          <ArrowDown className="size-5 lg:hidden" />
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <strong className="font-headline-lg text-lg text-secondary">restore</strong>
          <div className="mt-4 space-y-3">
            <div className="rounded border border-border bg-surface-container-high p-3">
              <span className="font-code-label text-sm text-on-surface">
                git restore src/app.ts
              </span>
              <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                작업 파일 내용만 원래대로 돌린다.
              </p>
            </div>
            <div className="rounded border border-border bg-surface-container-high p-3">
              <span className="font-code-label text-sm text-on-surface">
                git restore --staged src/app.ts
              </span>
              <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                스테이징만 빼고 작업 파일은 남긴다.
              </p>
            </div>
          </div>
          <p className="mt-4 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
            히스토리보다 파일 상태를 다룰 때 떠올리면 덜 헷갈린다.
          </p>
        </div>
      </div>
    </figure>
  );
}

function GitStrategyDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        팀 전략도 모양으로 보면 빠르게 구분된다
      </figcaption>
      <div className="grid gap-3 xl:grid-cols-4">
        {gitStrategyCards.map((card) => (
          <div key={card.title} className="rounded-md border border-border bg-card p-4">
            <strong className="font-headline-lg text-lg text-secondary">{card.title}</strong>
            <div className="mt-3 rounded border border-border bg-surface-container-high px-3 py-2 font-code-label text-xs text-on-surface">
              {card.fit}
            </div>
            <div className="mt-4 space-y-2">
              {card.points.map((point) => (
                <div
                  key={point}
                  className="rounded border border-border bg-surface-container-high px-3 py-2 font-body-md text-sm leading-relaxed text-on-surface-variant"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

export const mdxComponents = {
  h2: ({ children, ...props }: HeadingProps) => (
    <h2
      className="mb-8 mt-16 font-headline-lg text-headline-lg text-secondary first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps) => (
    <h3 className="mb-4 mt-10 font-headline-lg text-2xl text-on-surface" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ParaProps) => (
    <p
      className="mb-6 font-blog-content text-blog-content leading-relaxed text-on-surface"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ListProps) => (
    <ul className="mb-6 space-y-3 pl-0" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-6 list-decimal space-y-3 pl-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps) => (
    <li className="flex gap-3 font-blog-content text-blog-content text-on-surface" {...props}>
      <span className="mt-1 shrink-0 text-secondary" aria-hidden="true">
        -
      </span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote
      className="my-12 border-l-2 border-border py-4 pl-8 font-blog-content text-blog-content italic text-on-surface-variant"
      {...props}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-secondary" {...props}>
      {children}
    </strong>
  ),
  a: ({ href, children, ...props }: AnchorProps) => (
    <a
      href={href}
      className="text-secondary underline underline-offset-4 transition-opacity hover:opacity-75"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, className, ...props }: CodeProps) => {
    if (className) {
      return (
        <code className={`${className} text-on-surface`} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[0.875em] text-secondary"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: PreProps) => (
    <div className="mb-8">
      <div className="overflow-x-auto rounded-md border border-border bg-surface-container p-6 font-mono text-sm">
        <pre className="whitespace-pre text-on-surface" {...props}>
          {children}
        </pre>
      </div>
    </div>
  ),
  hr: () => <hr className="my-12 border-border" />,
  Callout: ({ children, title = "Insight" }: CalloutProps) => (
    <div className="my-10 rounded-md border border-border border-l-secondary bg-surface-container p-6">
      <div className="flex gap-4">
        <Lightbulb className="mt-0.5 size-6 shrink-0 text-secondary" />
        <div>
          <h4 className="mb-2 font-headline-lg text-lg text-secondary">{title}</h4>
          <div className="font-body-md text-body-md text-on-surface-variant">{children}</div>
        </div>
      </div>
    </div>
  ),
  RenderingPipeline,
  CallStackDiagram,
  MicrotaskStarvationDiagram,
  TimerFlowDiagram,
  EventListenerFlowDiagram,
  PromiseFlowDiagram,
  MixedTaskFlowDiagram,
  AsyncAwaitFlowDiagram,
  EventLoopCycleDiagram,
  PromiseLifecycleDiagram,
  PromiseExecutorDiagram,
  PromiseApiFlowDiagram,
  PromiseChainDiagram,
  EventLoopDiagram,
  TaskOrderDiagram,
  GitCommandAtlasDiagram,
  GitRebaseRevertDiagram,
  GitMergeRebaseCherryPickDiagram,
  GitResetRestoreDiagram,
  GitStrategyDiagram,
};
