import { LogoMark } from "@/components/Icons";
import { footer, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="resources" className="border-t border-white/5 bg-ink/50 py-16">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span className="font-display text-lg font-semibold tracking-tight">
                {site.name}
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {footer.blurb}
            </p>
            <p className="mt-6 font-mono text-xs text-white/30">
              status.helio.example.com — all systems operational
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs uppercase tracking-[0.22em] text-white/40">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-7 text-xs text-white/35 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {site.name} Labs. Built as a 3D landing
            starter.
          </span>
          <div className="flex items-center gap-5">
            <a href="#top" className="transition hover:text-white/70">
              Privacy
            </a>
            <a href="#top" className="transition hover:text-white/70">
              Terms
            </a>
            <a href="#top" className="transition hover:text-white/70">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
