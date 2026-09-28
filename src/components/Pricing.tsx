import { ArrowIcon, CheckIcon } from "@/components/Icons";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/mo",
    blurb: "For side projects and 3-seat trials.",
    perks: ["3 seats", "1 service", "Community runbooks"],
    featured: false,
    cta: "Start free",
  },
  {
    name: "Scale",
    price: "$49",
    cadence: "/seat/mo",
    blurb: "Autonomous remediation for production teams.",
    perks: [
      "Unlimited services",
      "Auto-rollback + PR drafts",
      "SSO & audit export",
      "99.9% SLA",
    ],
    featured: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "VPC deployment with your compliance rules.",
    perks: ["Self-hosted control plane", "Custom guardrails", "Named architect"],
    featured: false,
    cta: "Talk to sales",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-28">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-plasma/80">
            Pricing
          </p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
            Priced per engineer, not per alert
          </h2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-3xl p-7 ${
                t.featured
                  ? "border border-volt/35 bg-[linear-gradient(160deg,rgba(196,242,74,0.12),rgba(124,92,255,0.1)_45%,rgba(255,255,255,0.02))] shadow-[0_40px_120px_-60px_rgba(196,242,74,0.85)] lg:-mt-4 lg:pb-11"
                  : "glass"
              }`}
            >
              {t.featured ? (
                <span className="absolute -top-3 left-7 rounded-full bg-volt px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-void">
                  Most popular
                </span>
              ) : null}

              <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                {t.name}
              </h3>
              <p className="mt-1.5 text-sm text-white/55">{t.blurb}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-white">
                  {t.price}
                </span>
                <span className="text-sm text-white/45">{t.cadence}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-white/70">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" />
                    {p}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  t.featured
                    ? "bg-volt text-void hover:brightness-110"
                    : "glass text-white/90 hover:border-white/25 hover:bg-white/10"
                }`}
              >
                {t.cta}
                <ArrowIcon className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
