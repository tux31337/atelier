import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const TECH_STACK = ["React 18", "Three.js", "GLSL Shaders", "Tauri", "WebGPU"] as const;

const RESULTS = [
  { label: "Iterative Mesh Generation", size: "md:col-span-8 md:row-span-2" },
  { label: "Interior Rendering", size: "md:col-span-4" },
  { label: "Brutalist Architecture", size: "md:col-span-4" },
] as const;

export default function ProjectPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[600px] md:h-[870px] w-full overflow-hidden flex items-end pb-32">
        <div className="absolute inset-0 z-0 bg-surface-container-low">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="w-full h-full flex items-center justify-center opacity-10">
            <span className="text-8xl font-black text-zinc-600 font-headline-lg">HERO</span>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            <span className="font-code-label text-code-label text-secondary mb-4 block tracking-widest">
              PROJECT_CASE_042
            </span>
            <h1 className="font-display-xl text-display-xl text-on-background mb-6 uppercase">
              NEURAL_ARCH_V2
            </h1>
            <p className="font-headline-lg text-headline-lg text-on-surface-variant max-w-2xl">
              A generative design system exploring the intersection of algorithmic precision and
              architectural brutalism.
            </p>
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section className="border-y border-white/5 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-code-label text-code-label text-on-primary-container uppercase mb-3">
              Role
            </h3>
            <p className="font-body-md text-body-md text-on-surface">
              Lead Technical Architect &amp; UI/UX Designer
            </p>
          </div>
          <div>
            <h3 className="font-code-label text-code-label text-on-primary-container uppercase mb-3">
              Timeline
            </h3>
            <p className="font-body-md text-body-md text-on-surface">14 Weeks (Q1 2024)</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-code-label text-code-label text-on-primary-container uppercase mb-3">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-surface-container-high glass-border rounded-full text-xs font-medium text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-8">
              The Challenge
            </h2>
            <p className="font-blog-content text-blog-content text-on-surface-variant mb-6 italic">
              &ldquo;How can we translate pure mathematical noise into structurally viable,
              aesthetically compelling architectural forms in real-time?&rdquo;
            </p>
            <p className="font-body-md text-body-md text-on-surface">
              The primary hurdle was performance. Rendering thousands of unique geometric meshes
              while maintaining 60FPS on a mobile device required a complete rethink of
              traditional vertex manipulation.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden glass-border shadow-2xl bg-surface-container h-64 md:h-auto flex items-center justify-center">
            <span className="text-4xl font-black text-zinc-700 font-headline-lg opacity-30">
              IMG
            </span>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-[720px] mx-auto px-6">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-8 text-center">
            The Solution
          </h2>
          <p className="font-body-md text-body-md text-on-surface mb-12 text-center">
            We moved the heavy lifting to the GPU using custom GLSL shaders. By utilizing
            instanced rendering and vertex displacement textures, we achieved a 400% increase in
            polygon throughput.
          </p>
          <div className="bg-[#050506] border border-white/5 rounded-xl p-6 font-mono text-sm leading-relaxed overflow-x-auto rim-light">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <div className="w-3 h-3 rounded-full bg-error" />
              <div className="w-3 h-3 rounded-full bg-secondary-container" />
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="ml-4 font-code-label text-on-primary-container text-[10px] uppercase">
                displacement_shader.glsl
              </span>
            </div>
            <pre className="text-zinc-300">
              <code>{`uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  float noise = pnoise(pos.xyz * 0.5 + uTime, vec3(10.0));
  pos += normal * noise * 2.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-12">
          The Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[800px]">
          {RESULTS.map(({ label, size }) => (
            <div
              key={label}
              className={`${size} group relative overflow-hidden rounded-xl glass-border bg-surface-container flex items-center justify-center`}
            >
              <span className="text-zinc-700 font-headline-lg text-sm uppercase tracking-widest opacity-40">
                {label}
              </span>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <span className="text-white font-code-label uppercase tracking-widest text-sm">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-32 pt-12 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a
            href="#"
            className="w-full md:w-auto px-12 py-5 bg-secondary text-on-secondary font-code-label uppercase tracking-widest text-center rounded-lg hover:opacity-90 transition-all duration-300 hover:-translate-y-1 transform rim-light"
          >
            Live Demo
          </a>
          <a
            href="#"
            className="w-full md:w-auto px-12 py-5 border border-white/20 text-white font-code-label uppercase tracking-widest text-center rounded-lg hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 transform"
          >
            Github Repository
          </a>
        </div>
      </section>

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-code-label text-code-label uppercase text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="size-4" />
          All Projects
        </Link>
      </div>
    </main>
  );
}
