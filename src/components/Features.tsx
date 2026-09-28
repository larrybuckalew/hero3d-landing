import { iconMap } from "@/components/Icons";
import { features } from "@/lib/site";

/** Static class strings so Tailwind can see every variant at build time. */
const accents = {
  plasma: {
    ring: "shadow-[0_0_0_1px_rgba(124,92,255,0.35),0_18px_50px_-24px_rgba(124,92,255,0.9)]",
    icon: "bg-plasma/15 text-plasma",
    hover: "hover:border-plasma/40",
  },
  volt: {
    ring: "shadow-[0_0_0_1px_rgba(196,242,74,0.3),0_18px_50px_-24px_rgba(196,242,74,0.8)]",
    icon: "bg-volt/15 text-volt",
    hover: "hover:border-volt/40",
  },
  ion: {
    ring: "shadow-[0_0_0_1px_rgba(34,211,238,0.3),0_18px_50px_-24px_rgba(34,211,238,0.8)]",
    icon: "bg-ion/15 text-ion",
    hover: "hover:border-ion/40",
  },
  magenta: {
    ring: "shadow-[0_0_0_1px_rgba(244,114,182,0.3),0_18px_50px_-24px_rgba(244,114,182,0.8)]",
    icon: "bg-magenta/15 text-magenta",
    hover: "hover:border-magenta/40",
  },
} as const;

export default function Features() {
  return (
    <section id="platform" className="relative py-24 sm:py-32">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-volt/80">
            The platform
          </p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
            Every signal, one copilot, zero dashboards
          </h2>
          <p className="mt-4 text-lg text-white/65">
            Helio sits between your telemetry and your ticket queue, reasoning
            over both so nobody has to context-switch at 3am.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((f) => {
            const Icon = iconMap[f.icon as keyof typeof iconMap];
            const a = accents[f.accent as keyof typeof accents];
            return (
              <article
                key={f.title}
                className={`glass group relative overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 ${a.hover} ${a.ring}`}
              >
                <span
                  aria-hidden
                  className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/5 blur-2xl transition duration-500 group-hover:bg-white/10"
                />
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${a.icon}`}
                >
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="font-display mt-5 text-lg font-semibold tracking-tight text-white">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/60">
                  {f.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
