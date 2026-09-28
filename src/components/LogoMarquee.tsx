import { logos } from "@/lib/site";

export default function LogoMarquee() {
  // Duplicated once so the -50% translate loops seamlessly.
  const track = [...logos, ...logos];

  return (
    <section
      aria-label="Trusted by engineering teams"
      className="relative border-y border-white/5 bg-ink/60 py-7"
    >
      <p className="shell mb-5 text-center text-[11px] uppercase tracking-[0.3em] text-white/35">
        Powering on-call for 1,400+ engineering teams
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-14 pr-14">
          {track.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display whitespace-nowrap text-xl font-medium text-white/45"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
