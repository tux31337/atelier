import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32">
      <header className="space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          Projects
        </h1>
        <p className="font-blog-content text-blog-content text-on-surface-variant max-w-[580px] italic">
          Selected works are being prepared. Index page coming soon.
        </p>
      </header>
    </div>
  );
}
