import { Cpu, FlaskConical, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex-1 relative overflow-hidden flex flex-col items-center justify-center py-20">
      {/* Atmospheric backgrounds */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      {/* Floating node: Engineering (top-left) */}
      <div
        className="absolute top-[20%] left-[15%] glass-card p-6 rounded-xl animate-pulse hidden lg:block"
        style={{ animationDuration: "4s" }}
      >
        <div className="flex flex-col gap-2">
          <Cpu className="text-secondary size-8" />
          <h3 className="font-headline-lg text-lg text-zinc-100">Engineering</h3>
          <p className="text-xs text-zinc-500 font-code-label">Full-Stack Scalability</p>
        </div>
      </div>

      {/* Floating node: The Lab (top-right) */}
      <div
        className="absolute top-[25%] right-[10%] glass-card p-6 rounded-xl animate-pulse hidden lg:block"
        style={{ animationDuration: "5s" }}
      >
        <div className="flex flex-col gap-2">
          <FlaskConical className="text-tertiary size-8" />
          <h3 className="font-headline-lg text-lg text-zinc-100">The Lab</h3>
          <p className="text-xs text-zinc-500 font-code-label">AI &amp; Web3 Research</p>
        </div>
      </div>

      {/* Floating node: Design (bottom-left) */}
      <div
        className="absolute bottom-[20%] left-[10%] glass-card p-6 rounded-xl animate-pulse hidden lg:block"
        style={{ animationDuration: "6s" }}
      >
        <div className="flex flex-col gap-2">
          <Layers className="text-secondary-container size-8" />
          <h3 className="font-headline-lg text-lg text-zinc-100">Design</h3>
          <p className="text-xs text-zinc-500 font-code-label">3D UI &amp; Systems</p>
        </div>
      </div>

      {/* Central hero content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-gutter">
        {/* Mascot placeholder — replace with actual 3D character image */}
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-base">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
          <div className="w-64 h-64 rounded-full bg-surface-container-high flex items-center justify-center opacity-20">
            <span className="text-8xl font-black text-zinc-400 font-headline-lg select-none">
              D
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-display-xl text-display-xl text-on-background uppercase">
            Architecting <br /> Digital Dreams.
          </h1>
          <p className="font-blog-content text-blog-content text-zinc-400 max-w-2xl mx-auto">
            Bridging the gap between artistic vision and technical precision. I build
            high-performance web experiences with a focus on motion and 3D interaction.
          </p>
          <div className="pt-8 flex justify-center">
            <Link
              href="/blog"
              className="bg-secondary text-on-secondary font-code-label text-code-label px-8 py-4 rounded-full hover:opacity-90 transition-all flex items-center gap-2 group"
            >
              START JOURNEY
              <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
