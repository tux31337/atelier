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
};
