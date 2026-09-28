import { ArrowIcon, BoltIcon } from "@/components/Icons";
import { cta } from "@/lib/site";

export default function CTA() {
  return (
    <section id="cta" className="relative py-20 sm:py-28">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] p-px">
          {/* gradient hairline border */}
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(120deg,rgba(196,242,74,0.65),rgba(34,211,238,0.45),rgba(124,92,255,0.7))]"
          />
          <div className="grain relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#060812] px-6 py-14 text-center sm:px-14 sm:py-20">
            <span
              aria-hidden
              className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-plasma/25 blur-[90px]"
            />
            <span
              aria-hidden
              className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-volt/20 blur-[90px]"
            />

            <h2 className="font-display mx-auto max-w-3xl text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-white">
              {cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
              {cta.body}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#top"
                className="group inline-flex items-center gap-2 rounded-2xl bg-volt px-7 py-3.5 text-base font-semibold text-void shadow-[0_24px_70px_-24px_rgba(196,242,74,0.8)] transition hover:brightness-110"
              >
                {cta.primary}
                <ArrowIcon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#workflows"
                className="glass inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-base font-medium text-white/90 transition hover:border-white/25 hover:bg-white/10"
              >
                <BoltIcon className="h-4.5 w-4.5 text-ion" />
                {cta.secondary}
              </a>
            </div>

            <p className="mt-5 text-sm text-white/40">{cta.hint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
