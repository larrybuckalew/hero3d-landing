import { stats } from "@/lib/site";

export default function Stats() {
  return (
    <section className="relative py-6">
      <div className="shell">
        <div className="glass grid gap-px overflow-hidden rounded-3xl bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group bg-void/40 px-7 py-9 text-center transition hover:bg-white/[0.03]"
            >
              <div className="text-gradient font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-white/55">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
