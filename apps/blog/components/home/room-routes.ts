export type RoomRoute = {
  id: "blog" | "projects" | "about" | "archive";
  label: string;
  href: string;
  objectName: string;
  description: string;
  accent: string;
  position: [number, number, number];
};

export const ROOM_ROUTES: RoomRoute[] = [
  {
    id: "blog",
    label: "BLOG",
    href: "/blog",
    objectName: "네온 서가 게이트",
    description: "새 글과 정리된 기록으로 이동합니다.",
    accent: "#22d3ee",
    position: [0, 1.8, -28],
  },
  {
    id: "projects",
    label: "PROJECTS",
    href: "/projects",
    objectName: "홀로그램 작업대",
    description: "만들고 실험한 프로젝트를 엽니다.",
    accent: "#facc15",
    position: [28, 2.1, 0],
  },
  {
    id: "about",
    label: "ABOUT",
    href: "/about",
    objectName: "미러 포털",
    description: "Atelier를 만드는 사람과 방향을 봅니다.",
    accent: "#a78bfa",
    position: [-28, 2.4, 0],
  },
  {
    id: "archive",
    label: "ARCHIVE",
    href: "/archive",
    objectName: "데이터 서랍장",
    description: "오래된 기록과 분류된 자료로 갑니다.",
    accent: "#fb7185",
    position: [0, 1.6, 28],
  },
];
