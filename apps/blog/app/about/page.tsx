import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32">
      <header className="space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          About
        </h1>
        <p className="font-blog-content text-blog-content text-on-surface-variant max-w-[580px] italic">
          A note on the studio, the work, and the workflow. Drafting underway.
        </p>
      </header>
    </div>
  );
}
