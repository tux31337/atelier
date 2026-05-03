import { Button } from "@atelier/ui";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-20">
      <p className="font-code-label text-code-label text-secondary">truvis</p>
      <h1 className="font-display-xl text-display-xl text-on-background">
        준비 중인 콘텐츠 사이트입니다.
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Atelier 워크스페이스의 공통 UI 구조를 검증하기 위해 자리만 잡아둔 페이지입니다.
      </p>
      <div className="pt-2">
        <Button variant="secondary" size="lg" disabled>
          준비 중
        </Button>
      </div>
    </div>
  );
}
