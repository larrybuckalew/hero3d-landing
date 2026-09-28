"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ClusterScene = dynamic(() => import("./ClusterScene"), {
  // WebGL only exists in the browser — never attempt SSR for the canvas.
  ssr: false,
  loading: () => null,
});

type GfxTier = "checking" | "webgl" | "fallback";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/** Pure-CSS stand-in for devices without WebGL (or if the GPU context dies). */
function StaticCluster() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#a78bfa,#7c5cff_38%,#0b1030_72%)] opacity-70 blur-[2px] animate-drift" />
      <div className="absolute left-[28%] top-[32%] h-28 w-28 rounded-[30%] bg-gradient-to-br from-[#22d3ee] to-[#0e7490] opacity-70 blur-[1px] animate-drift [animation-duration:16s]" />
      <div className="absolute left-[64%] top-[58%] h-20 w-20 rotate-12 rounded-[26%] bg-gradient-to-br from-[#c4f24a] to-[#4d7c0f] opacity-70 animate-drift [animation-duration:19s]" />
      <div className="absolute left-[58%] top-[24%] h-14 w-14 -rotate-12 rounded-[24%] bg-gradient-to-br from-[#f472b6] to-[#6d28d9] opacity-60 animate-drift [animation-duration:23s]" />
      <div className="absolute left-[34%] top-[64%] h-12 w-12 rounded-full border border-white/20 opacity-60" />
      <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
    </div>
  );
}

export default function HeroCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<GfxTier>("checking");
  const [isMobile, setIsMobile] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const syncMobile = () => setIsMobile(mq.matches);
    syncMobile();
    mq.addEventListener("change", syncMobile);

    // Probing the GPU is a side effect, so keep it off this render pass instead
    // of cascading a synchronous setState through the effect body.
    const probe = window.requestAnimationFrame(() => {
      setTier(detectWebGL() ? "webgl" : "fallback");
    });

    // Stop rendering entirely once the hero scrolls out of view.
    const node = hostRef.current;
    let observer: IntersectionObserver | undefined;
    if (node && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => setOffscreen(!entry.isIntersecting),
        { rootMargin: "120px" },
      );
      observer.observe(node);
    }

    return () => {
      window.cancelAnimationFrame(probe);
      mq.removeEventListener("change", syncMobile);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 [&>div]:h-full [&>div]:w-full"
    >
      {tier === "webgl" ? (
        <ClusterScene isMobile={isMobile} paused={offscreen} />
      ) : tier === "fallback" ? (
        <StaticCluster />
      ) : null}
    </div>
  );
}
