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
import {
  ComparisonPair,
  DemoCard,
  FpsMeter,
  InputLatencyGraph,
  ListCallbackScenario,
  MeasuredRegion,
  OptimizationToggle,
  RenderFlash,
  RenderStats,
  SortScenario,
} from "@/components/perf-demo";

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

const tlsCertFields = [
  {
    field: "주체 (Subject)",
    value: "CN=example.com, O=Example Corp",
    desc: "이 인증서가 발급된 대상. 도메인(CN)과 조직(O)을 담는다.",
  },
  {
    field: "공개키 (Public Key)",
    value: "RSA 2048-bit (또는 EC P-256)",
    desc: "서버의 공개키. 누구나 볼 수 있고, 이 키로 암호화하면 서버만 복호화할 수 있다.",
  },
  {
    field: "발급자 (Issuer)",
    value: "Let's Encrypt R3",
    desc: "이 인증서에 서명한 CA. 브라우저는 이 발급자를 신뢰하는지 체인을 따라 올라가 확인한다.",
  },
  {
    field: "유효 기간",
    value: "2026-01-01 ~ 2026-07-01",
    desc: "Not Before / Not After. 이 범위를 벗어나면 브라우저가 인증서를 거부한다.",
  },
  {
    field: "SAN (Subject Alternative Name)",
    value: "example.com, www.example.com",
    desc: "이 인증서가 유효한 도메인 목록. 실무에서는 CN보다 SAN을 기준으로 도메인을 검증한다.",
  },
  {
    field: "서명 (Signature)",
    value: "CA의 개인키로 서명한 해시값",
    desc: "이 필드 덕분에 인증서 위조를 탐지할 수 있다. CA의 공개키로 서명을 검증한다.",
  },
];

const pkiChainLevels = [
  {
    level: "01",
    title: "Root CA",
    tag: "최상위 신뢰 기관",
    description:
      "자기 자신을 서명한 인증서(자체 서명, Self-Signed)를 갖는다. Windows, macOS, iOS, Android, 주요 브라우저의 신뢰 저장소에 미리 내장되어 있다. 우리가 어떤 인증서를 처음부터 믿는 이유는 결국 이 Root CA를 OS나 브라우저 벤더가 보증했기 때문이다.",
    note: "Root CA의 개인키는 오프라인 하드웨어 보안 모듈(HSM)에 보관되며 인터넷과 격리된다. 이 키가 노출되면 해당 CA가 서명한 모든 인증서의 신뢰가 무너진다.",
    isWarning: true,
  },
  {
    level: "02",
    title: "Intermediate CA",
    tag: "중간 발급 기관",
    description:
      "Root CA가 서명해준 인증서를 갖는다. Root CA 대신 실제 서버 인증서를 발급하는 역할을 맡는다. Root CA가 직접 서버 인증서를 발급하지 않는 이유는 보안 격리 때문이다.",
    note: "Intermediate CA가 침해당해도 Root CA는 Intermediate CA의 인증서를 폐기(Revoke)하면 된다. 만약 Root CA가 직접 발급했다면 Root CA 자체를 교체해야 하는 최악의 상황이 된다.",
    isWarning: false,
  },
  {
    level: "03",
    title: "서버 인증서 (End-Entity Certificate)",
    tag: "말단 인증서",
    description:
      "Intermediate CA가 서명한 인증서다. example.com 같은 실제 도메인에 발급된다. 서버는 TLS 핸드셰이크에서 이 인증서를 브라우저로 전달하며, 자신의 공개키를 함께 제공한다.",
    note: "서버는 자신의 인증서만 보내지 않고 Intermediate CA 인증서도 함께 전송해 체인을 완성한다. 브라우저가 Intermediate CA를 미리 캐시하지 않았을 수 있기 때문이다.",
    isWarning: false,
  },
];

const pkiVerificationSteps = [
  {
    step: "01",
    title: "서버 인증서 수신",
    description: "브라우저가 TLS 핸드셰이크에서 서버 인증서와 Intermediate CA 인증서를 받는다.",
    detail: "인증서에는 도메인, 공개키, 유효 기간, 발급자(Intermediate CA), 서명이 들어 있다.",
  },
  {
    step: "02",
    title: "도메인 일치 확인",
    description: "인증서의 SAN 필드에 지금 접속한 도메인이 포함되어 있는지 확인한다.",
    detail: "example.com에 접속했는데 SAN에 example.com이 없으면 즉시 경고를 표시한다.",
  },
  {
    step: "03",
    title: "유효 기간 확인",
    description: "인증서의 Not Before / Not After 범위 안에 오늘 날짜가 있는지 확인한다.",
    detail: "만료된 인증서는 서명이 유효해도 브라우저가 경고를 표시한다.",
  },
  {
    step: "04",
    title: "서명 검증 (체인 올라가기)",
    description: "Intermediate CA의 공개키로 서버 인증서의 서명을 검증한다. 그다음 Root CA의 공개키로 Intermediate CA 인증서의 서명을 검증한다.",
    detail: "서명 검증은 '이 인증서가 해당 CA의 개인키로 서명되었음'을 수학적으로 증명한다. 내용이 조금이라도 바뀌었다면 서명이 맞지 않는다.",
  },
  {
    step: "05",
    title: "Root CA 신뢰 확인",
    description: "체인을 따라 올라갔을 때 최종적으로 도달한 Root CA가 브라우저의 신뢰 저장소에 있는지 확인한다.",
    detail: "신뢰 저장소에 없는 Root CA면 '신뢰할 수 없는 인증서' 경고가 나온다. 자체 서명 인증서(self-signed)가 브라우저 경고를 일으키는 이유가 여기 있다.",
  },
];

type HandshakeStep = {
  step: string;
  direction: "c2s" | "s2c" | "both";
  label: string;
  tag: string;
  contents: string[];
  note?: string;
};

const handshake12Steps: HandshakeStep[] = [
  {
    step: "01",
    direction: "c2s",
    label: "ClientHello",
    tag: "클라이언트 → 서버",
    contents: [
      "지원하는 TLS 버전 목록",
      "지원하는 Cipher Suite 목록",
      "Client Random (32바이트 난수)",
      "Session ID (재개 시 이전 세션 ID)",
    ],
    note: "연결을 시작하는 첫 메시지. 클라이언트가 할 수 있는 것을 모두 나열하고, 서버가 그 중에서 고르게 한다.",
  },
  {
    step: "02",
    direction: "s2c",
    label: "ServerHello",
    tag: "서버 → 클라이언트",
    contents: [
      "선택된 TLS 버전 하나",
      "선택된 Cipher Suite 하나",
      "Server Random (32바이트 난수)",
    ],
    note: "ClientHello 목록 중 서버가 지원하는 것을 하나씩 확정한다. 이 선택이 이후 핸드셰이크 전체의 기준이 된다.",
  },
  {
    step: "03",
    direction: "s2c",
    label: "Certificate",
    tag: "서버 → 클라이언트",
    contents: [
      "서버 인증서 (공개키 포함)",
      "Intermediate CA 인증서 (체인 완성용)",
    ],
    note: "클라이언트는 이 인증서의 서명을 CA 공개키로 검증해 '이 서버가 정말 example.com인가'를 확인한다.",
  },
  {
    step: "04",
    direction: "s2c",
    label: "ServerKeyExchange",
    tag: "서버 → 클라이언트 (DHE/ECDHE 시에만)",
    contents: [
      "DH 파라미터 (서버 측 임시 공개값)",
      "서버 개인키로 서명한 값 (무결성 보장)",
    ],
    note: "키 교환 방식이 DHE/ECDHE일 때만 전송된다. RSA 키 교환이면 이 단계가 없다.",
  },
  {
    step: "05",
    direction: "s2c",
    label: "ServerHelloDone",
    tag: "서버 → 클라이언트",
    contents: ["서버 측 협상이 끝났다는 신호 (빈 메시지)"],
    note: "여기까지가 서버 입장에서 1회 왕복(1-RTT)이다. 클라이언트가 응답할 차례다.",
  },
  {
    step: "06",
    direction: "c2s",
    label: "ClientKeyExchange",
    tag: "클라이언트 → 서버",
    contents: [
      "Pre-Master Secret — 서버의 공개키로 암호화해서 전송",
    ],
    note: "클라이언트가 직접 생성한 Pre-Master Secret을 서버의 공개키로 암호화한다. 서버의 개인키가 없으면 복호화가 불가능해 도청해도 의미가 없다.",
  },
  {
    step: "07",
    direction: "both",
    label: "세션 키 파생 (로컬 계산)",
    tag: "클라이언트 · 서버 각자 독립적으로 계산",
    contents: [
      "Pre-Master Secret + Client Random + Server Random",
      "→ PRF(의사 난수 함수) 적용",
      "→ Master Secret 48바이트",
      "→ Client Write Key / Server Write Key / MAC Key 파생",
    ],
    note: "네트워크로 전송되지 않는다. 양측이 같은 재료를 갖고 있기 때문에 통신 없이 같은 세션 키를 독립적으로 계산할 수 있다.",
  },
  {
    step: "08",
    direction: "c2s",
    label: "ChangeCipherSpec + Finished",
    tag: "클라이언트 → 서버",
    contents: [
      "지금부터 합의된 암호화를 사용한다는 선언",
      "핸드셰이크 전체 메시지의 해시값 (세션 키로 암호화)",
    ],
    note: "Finished 메시지가 검증에 성공하면 핸드셰이크 중 중간자 개입이 없었음이 확인된다.",
  },
  {
    step: "09",
    direction: "s2c",
    label: "ChangeCipherSpec + Finished",
    tag: "서버 → 클라이언트",
    contents: [
      "서버도 암호화 전환 선언",
      "서버가 계산한 핸드셰이크 해시값",
    ],
    note: "양측의 Finished가 모두 검증되면 2-RTT 핸드셰이크가 완료된다. 이후 모든 HTTP 데이터는 세션 키로 암호화된다.",
  },
];

const handshake13Steps: HandshakeStep[] = [
  {
    step: "01",
    direction: "c2s",
    label: "ClientHello",
    tag: "클라이언트 → 서버",
    contents: [
      "TLS 1.3 버전 명시",
      "지원 Cipher Suite 목록",
      "Key Share: 클라이언트 ECDHE 공개값 (미리 동봉)",
      "Client Random",
    ],
    note: "TLS 1.3의 핵심 변화다. ClientHello에 ECDHE Key Share를 함께 담아 서버가 한 번의 응답으로 공유 비밀을 계산할 수 있게 한다. 이것이 RTT를 1로 줄이는 방법이다.",
  },
  {
    step: "02",
    direction: "s2c",
    label: "ServerHello",
    tag: "서버 → 클라이언트",
    contents: [
      "선택된 Cipher Suite",
      "Key Share: 서버 ECDHE 공개값",
      "Server Random",
    ],
    note: "서버도 Key Share를 응답에 담는다. 이 시점에서 클라이언트와 서버 모두 ECDHE 공유 비밀을 즉시 계산할 수 있다.",
  },
  {
    step: "03",
    direction: "both",
    label: "공유 비밀 도출 (로컬 계산)",
    tag: "클라이언트 · 서버 각자 독립적으로 계산",
    contents: [
      "클라이언트: 자신의 ECDHE 개인키 × 서버 ECDHE 공개값",
      "서버: 자신의 ECDHE 개인키 × 클라이언트 ECDHE 공개값",
      "→ 수학적으로 동일한 Shared Secret",
      "→ HKDF로 핸드셰이크 키 및 세션 키 파생",
    ],
    note: "ECDHE의 수학적 성질 덕분에 개인키는 네트워크를 통해 전달되지 않고도 양측이 같은 값을 얻는다. 이 임시 키는 세션이 끝나면 폐기되므로 PFS가 보장된다.",
  },
  {
    step: "04",
    direction: "s2c",
    label: "EncryptedExtensions · Certificate · CertificateVerify · Finished",
    tag: "서버 → 클라이언트 (이미 암호화된 상태)",
    contents: [
      "EncryptedExtensions: 추가 협상 정보",
      "Certificate: 서버 인증서 (암호화 채널로 전송)",
      "CertificateVerify: 핸드셰이크 해시에 대한 서버 개인키 서명",
      "Finished: 핸드셰이크 검증값",
    ],
    note: "TLS 1.3에서는 ServerHello 이후 모든 메시지가 암호화된다. TLS 1.2와 달리 인증서도 암호화 채널로 전달되므로 중간자가 서버 도메인을 알 수 없다.",
  },
  {
    step: "05",
    direction: "c2s",
    label: "Finished",
    tag: "클라이언트 → 서버",
    contents: ["클라이언트 Finished 검증값"],
    note: "여기까지 1-RTT로 완료된다. 이후 즉시 암호화된 HTTP 데이터를 전송할 수 있다.",
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

function TLSCertificateDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        X.509 인증서 구조
      </figcaption>
      <div className="rounded-md border border-border bg-card">
        <div className="border-b border-border bg-surface-container-high px-4 py-3">
          <span className="font-code-label text-sm text-secondary">Certificate (인증서)</span>
        </div>
        <div className="divide-y divide-border">
          {tlsCertFields.map((item) => (
            <div key={item.field} className="grid gap-1 px-4 py-3 md:grid-cols-[220px_1fr]">
              <span className="font-code-label text-sm text-muted-foreground">{item.field}</span>
              <div>
                <span className="block font-code-label text-sm text-on-surface">{item.value}</span>
                <span className="mt-1 block font-body-md text-sm leading-relaxed text-on-surface-variant">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

function PKITrustChainDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        인증서 체인: Root CA부터 서버 인증서까지
      </figcaption>
      <div className="space-y-2">
        {pkiChainLevels.map((level, index) => (
          <div key={level.level}>
            <div className="rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-container-high font-code-label text-xs text-secondary">
                  {level.level}
                </span>
                <strong className="font-headline-lg text-lg text-secondary">{level.title}</strong>
                <span className="rounded-full border border-border bg-surface-container-high px-3 py-1 font-code-label text-xs text-on-surface">
                  {level.tag}
                </span>
              </div>
              <p className="mt-3 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                {level.description}
              </p>
              {level.note && (
                <div className="mt-3 rounded border border-border bg-surface-container-high px-3 py-2 font-body-md text-sm leading-relaxed text-on-surface-variant">
                  {level.note}
                </div>
              )}
            </div>
            {index < pkiChainLevels.length - 1 && (
              <div className="my-2 flex items-center gap-2 pl-5">
                <ArrowDown className="size-4 text-muted-foreground" />
                <span className="font-code-label text-xs text-muted-foreground">
                  서명 (하위 인증서를 상위 CA의 개인키로 서명)
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}

function PKIVerificationDiagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-5 font-headline-lg text-xl text-secondary">
        브라우저가 인증서를 검증하는 순서
      </figcaption>
      <div className="space-y-3">
        {pkiVerificationSteps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < pkiVerificationSteps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <strong className="font-headline-lg text-base text-secondary">{item.title}</strong>
              <p className="mt-2 mb-0 font-body-md text-sm leading-relaxed text-on-surface-variant">
                {item.description}
              </p>
              <div className="mt-3 rounded border border-border bg-surface-container-high px-3 py-2 font-body-md text-sm leading-relaxed text-on-surface-variant">
                {item.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function TLSHandshake12Diagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-2 font-headline-lg text-xl text-secondary">
        TLS 1.2 핸드셰이크 흐름
      </figcaption>
      <p className="mb-5 font-body-md text-sm text-on-surface-variant">
        데이터를 보내기 전까지 클라이언트-서버 사이에 2번의 왕복(2-RTT)이 필요하다.
      </p>
      <div className="space-y-3">
        {handshake12Steps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < handshake12Steps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="font-headline-lg text-base text-secondary">{item.label}</strong>
                <span className="rounded-full border border-border bg-surface-container-high px-3 py-1 font-code-label text-xs text-on-surface">
                  {item.tag}
                </span>
              </div>
              <div className="mt-3 space-y-1">
                {item.contents.map((content) => (
                  <div
                    key={content}
                    className="flex gap-2 font-code-label text-sm text-on-surface-variant"
                  >
                    <span className="shrink-0 text-muted-foreground">·</span>
                    <span>{content}</span>
                  </div>
                ))}
              </div>
              {item.note && (
                <div className="mt-3 rounded border border-border bg-surface-container-high px-3 py-2 font-body-md text-sm leading-relaxed text-on-surface-variant">
                  {item.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function TLSHandshake13Diagram() {
  return (
    <figure className="my-12 rounded-md border border-border bg-surface-container p-5 md:p-6">
      <figcaption className="mb-2 font-headline-lg text-xl text-secondary">
        TLS 1.3 핸드셰이크 흐름
      </figcaption>
      <p className="mb-5 font-body-md text-sm text-on-surface-variant">
        Key Share를 ClientHello에 미리 담아 1번의 왕복(1-RTT)으로 핸드셰이크를 끝낸다.
      </p>
      <div className="space-y-3">
        {handshake13Steps.map((item, index) => (
          <div key={item.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:items-stretch">
            <div className="flex items-center gap-3 md:block">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-code-label text-xs text-secondary">
                {item.step}
              </span>
              {index < handshake13Steps.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground md:mx-auto md:mt-3" />
              )}
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="font-headline-lg text-base text-secondary">{item.label}</strong>
                <span className="rounded-full border border-border bg-surface-container-high px-3 py-1 font-code-label text-xs text-on-surface">
                  {item.tag}
                </span>
              </div>
              <div className="mt-3 space-y-1">
                {item.contents.map((content) => (
                  <div
                    key={content}
                    className="flex gap-2 font-code-label text-sm text-on-surface-variant"
                  >
                    <span className="shrink-0 text-muted-foreground">·</span>
                    <span>{content}</span>
                  </div>
                ))}
              </div>
              {item.note && (
                <div className="mt-3 rounded border border-border bg-surface-container-high px-3 py-2 font-body-md text-sm leading-relaxed text-on-surface-variant">
                  {item.note}
                </div>
              )}
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
  TLSCertificateDiagram,
  PKITrustChainDiagram,
  PKIVerificationDiagram,
  TLSHandshake12Diagram,
  TLSHandshake13Diagram,
  ComparisonPair,
  DemoCard,
  OptimizationToggle,
  MeasuredRegion,
  RenderStats,
  RenderFlash,
  FpsMeter,
  InputLatencyGraph,
  SortScenario,
  ListCallbackScenario,
};
