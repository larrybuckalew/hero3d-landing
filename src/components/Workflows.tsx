const steps = [
  {
    kicker: "01 — Detect",
    title: "Correlate in milliseconds",
    body: "Traces, deploys, and customer tickets collapse into a single incident with a confidence score.",
  },
  {
    kicker: "02 — Decide",
    title: "Get the plan, not a wall of YAML",
    body: "Helio proposes the smallest safe change, shows the blast radius, and links the evidence.",
  },
  {
    kicker: "03 — Deliver",
    title: "Approve and move on",
    body: "One click merges the rollback or opens a PR. The runbook updates itself afterwards.",
  },
];

const log: { t: string; kind?: "ok" | "warn" | "cmd" }[] = [
  { t: "$ helio watch --service svc-checkout", kind: "cmd" },
  { t: "◐ ingesting 12 sources … traces, logs, deploys, tickets" },
  { t: "▲ p99 latency 1,840ms (threshold 600ms)  ·  errors 4.7%", kind: "warn" },
  { t: "✓ suspect: deploy #4192 — cart-pricing hot path (conf 0.94)" },
  { t: "→ proposal: rollback deploy #4192  ·  blast radius: 2 pods" },
  { t: "✓ approved by @dana  ·  rollback complete in 41s", kind: "ok" },
  { t: "✓ error rate 4.7% → 0.3%  ·  runbook updated", kind: "ok" },
];

const tone = {
  cmd: "text-volt",
  warn: "text-magenta",
  ok: "text-ion",
};

export default function Workflows() {
  return (
    <section id="workflows" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/4 -z-10 h-96 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(124,92,255,0.14),transparent_70%)]"
      />
      <div className="shell grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ion/80">
            Workflows
          </p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
            From page to patch in one thread
          </h2>

          <ol className="mt-10 space-y-7">
            {steps.map((s) => (
              <li key={s.kicker} className="relative pl-12">
                <span className="absolute left-0 top-0.5 font-mono text-xs text-white/35">
                  {s.kicker.split(" ")[0]}
                </span>
                <span
                  aria-hidden
                  className="absolute left-[2.15rem] top-9 h-[calc(100%+0.75rem)] w-px bg-gradient-to-b from-white/15 to-transparent last:hidden"
                />
                <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                  {s.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/60">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="glass relative overflow-hidden rounded-3xl p-1.5 shadow-[0_40px_120px_-50px_rgba(34,211,238,0.55)]">
          <div className="flex items-center gap-2 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-magenta/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-volt/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-ion/70" />
            <span className="ml-2 font-mono text-xs text-white/40">
              helio — incident #4192
            </span>
          </div>
          <div className="rounded-[1.35rem] bg-[#05070f]/85 p-5 font-mono text-[13px] leading-7">
            {log.map((line) => (
              <div
                key={line.t}
                className={line.kind ? tone[line.kind] : "text-white/65"}
              >
                {line.t}
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2 text-white/45">
              <span className="text-volt">$</span>
              <span className="inline-block h-4 w-2 animate-pulse bg-volt/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
