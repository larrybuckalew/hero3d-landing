import HeroCanvas from "@/components/three/HeroCanvas";
import { ArrowIcon, BoltIcon, CheckIcon } from "@/components/Icons";
import { hero, site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="top"
      className="grain relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-10"
    >
      {/* ---- background stack: aurora wash -> blueprint grid -> WebGL ---- */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-[radial-gradient(120%_80%_at_75%_-10%,#1b1440_0%,#0a0c1f_45%,#04050c_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-30 opacity-70 [background:radial-gradient(45%_35%_at_15%_75%,rgba(34,211,238,0.16),transparent_70%),radial-gradient(40%_30%_at_85%_65%,rgba(196,242,74,0.12),transparent_70%)]"
      />
      <div aria-hidden className="grid-veil absolute inset-0 -z-20" />

      <div
        aria-hidden
        className="absolute inset-0 -z-10 transition-transform duration-700 ease-out md:translate-x-[14%] xl:translate-x-[19%]"
      >
        <HeroCanvas />
      </div>

      {/* legibility scrim over the 3D, never intercepting pointer events */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(4,5,12,0.95),transparent_55%)] md:bg-[linear-gradient(to_right,rgba(4,5,12,0.94)_0%,rgba(4,5,12,0.6)_42%,transparent_68%)]"
      />

      {/* ---- copy ---- */}
      <div className="shell relative z-10 flex flex-1 items-center">
        <div className="max-w-2xl animate-rise">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-volt" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
            </span>
            {hero.eyebrow}
          </span>

          <h1 className="font-display mt-6 text-[clamp(2.6rem,7vw,4.6rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
            <span className="block text-white">{hero.titleLead}</span>
            <span className="text-gradient block">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {hero.body}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={site.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-2xl bg-volt px-6 py-3.5 text-base font-semibold text-void shadow-[0_20px_60px_-20px_rgba(196,242,74,0.65)] transition hover:brightness-110 focus-visible:brightness-110"
            >
              {site.primaryCta.label}
              <ArrowIcon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={site.secondaryCta.href}
              className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-base font-medium text-white/90 transition hover:border-white/25 hover:bg-white/10"
            >
              <BoltIcon className="h-4.5 w-4.5 text-ion" />
              {site.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
            {hero.bullets.map((b) => (
              <li key={b} className="inline-flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-volt" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- floating proof card, anchored bottom-right on wide screens ---- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 flex justify-center px-5 lg:justify-end lg:pr-[6%]">
        <div className="glass pointer-events-auto w-full max-w-xs animate-rise rounded-3xl p-4 [animation-delay:400ms]">
          <div className="flex items-center justify-between text-xs text-white/55">
            <span className="font-mono">svc-checkout</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-volt/15 px-2 py-0.5 text-volt">
              <CheckIcon className="h-3 w-3" /> auto-resolved
            </span>
          </div>
          <p className="mt-2 text-sm leading-snug text-white/85">
            Rollback of <span className="font-mono text-ion">deploy #4192</span>{" "}
            cut error rate 94% in 40s.
          </p>
          <div className="mt-3 flex items-end gap-1" aria-hidden>
            {[38, 52, 46, 61, 44, 28, 18, 12, 9, 7, 6, 5].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h * 0.42}px` }}
                className={`w-full rounded-sm ${i < 5 ? "bg-magenta/70" : "bg-volt/80"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---- scroll cue ---- */}
      <div className="shell relative z-10 flex justify-center">
        <a
          href="#platform"
          className="group inline-flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/40 transition hover:text-white/70"
        >
          scroll
          <span className="relative h-9 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-3 animate-cue bg-gradient-to-b from-volt to-transparent" />
          </span>
        </a>
      </div>
    </section>
  );
}
