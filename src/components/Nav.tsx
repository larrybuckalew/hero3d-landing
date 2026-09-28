"use client";

import { useEffect, useState } from "react";

import { CloseIcon, LogoMark, MenuIcon } from "@/components/Icons";
import { nav, site } from "@/lib/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`shell transition-all duration-300 ${
          scrolled ? "pt-3" : "pt-5"
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${
            scrolled ? "glass shadow-[0_18px_60px_-30px_rgba(124,92,255,0.8)]" : "border border-transparent"
          }`}
          aria-label="Primary"
        >
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="font-display text-lg font-semibold tracking-tight">
              {site.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-xl px-3.5 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#cta"
              className="rounded-xl px-3.5 py-2 text-sm text-white/75 transition hover:text-white"
            >
              Sign in
            </a>
            <a
              href={site.primaryCta.href}
              className="group inline-flex items-center gap-1.5 rounded-xl bg-volt px-4 py-2 text-sm font-semibold text-void transition hover:brightness-110"
            >
              {site.primaryCta.label}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="glass inline-flex h-10 w-10 items-center justify-center rounded-xl text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <MenuIconSwap open /> : <MenuIconSwap />}
          </button>
        </nav>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="shell md:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="glass mt-2 rounded-2xl p-3">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-base text-white/80 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={site.primaryCta.href}
              className="mt-2 block rounded-xl bg-volt px-4 py-3 text-center text-base font-semibold text-void"
            >
              {site.primaryCta.label}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MenuIconSwap({ open = false }: { open?: boolean }) {
  return open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />;
}
