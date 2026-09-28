/**
 * Quantitative visual QA for the 3D hero. Since we can't eyeball screenshots,
 * we sample pixels from the composited page and assert on them:
 *
 *  1. desktop: canvas present, render loop alive, geometry actually painted
 *  2. motion:  the 3D region changes between frames (orbit/float/parallax work)
 *  3. a11y:    prefers-reduced-motion => same region is pixel-identical (frozen)
 *  4. fallback: WebGL unavailable => pure-CSS cluster, still no errors
 *  5. layout:  no horizontal overflow, in-page anchors resolve, mobile menu works
 *
 *   npm start                     # then:
 *   node tools/verify.mjs [http://localhost:3000]
 */
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";

const gpuArgs = [
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
];

async function launch() {
  try {
    return await chromium.launch({ channel: "chrome", args: gpuArgs });
  } catch {
    return await chromium.launch({ args: gpuArgs });
  }
}

const browser = await launch();
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` -- ${detail}` : ""}`);
};

async function newPage(options = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    ...options,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e.message)));
  await page.goto(base, { waitUntil: "networkidle" });
  return { ctx, page, errors };
}

/** Decode a screenshot inside the page and histogram its pixels. */
async function analyse(page, clip) {
  const buf = await page.screenshot({ clip });
  const b64 = buf.toString("base64");
  return page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const { data: px } = g.getImageData(0, 0, c.width, c.height);
    const seen = new Set();
    let accent = 0;
    let lit = 0;
    let total = 0;
    for (let i = 0; i < px.length; i += 4 * 7) {
      const r = px[i];
      const gr = px[i + 1];
      const b = px[i + 2];
      seen.add(((r >> 2) << 12) | ((gr >> 2) << 6) | (b >> 2));
      const lum = 0.2126 * r + 0.7152 * gr + 0.0722 * b;
      const sat = Math.max(r, gr, b) - Math.min(r, gr, b);
      if (lum > 105) lit += 1;
      if (sat > 55 && lum > 65) accent += 1;
      total += 1;
    }
    return {
      distinct: seen.size,
      litPct: +((lit / total) * 100).toFixed(1),
      accentPct: +((accent / total) * 100).toFixed(1),
    };
  }, b64);
}

/** Are two grabs of the same region identical? (0 = identical, 1 = changed) */
async function regionChanged(page, clip, gap = 900) {
  const a = await page.screenshot({ clip });
  await page.waitForTimeout(gap);
  const b = await page.screenshot({ clip });
  return a.equals(b) ? 0 : 1;
}

// Region that only ever contains the WebGL cluster (right of the copy,
// above the floating proof card).
const CLUSTER_CLIP = { x: 980, y: 120, width: 360, height: 440 };

/* ---------------- 1 + 2: desktop render, motion, layout, a11y ---------------- */
{
  const { ctx, page, errors } = await newPage();
  await page.waitForSelector("canvas", { timeout: 20_000 });
  await page.waitForTimeout(3200); // let materials/env map settle

  const fps = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0;
        const t0 = performance.now();
        const tick = () => {
          frames += 1;
          if (performance.now() - t0 < 1000) requestAnimationFrame(tick);
          else resolve(frames);
        };
        requestAnimationFrame(tick);
      }),
  );
  ok("render loop alive", fps > 20, `${fps} fps`);

  const stats = await analyse(page, CLUSTER_CLIP);
  ok(
    "canvas paints geometry",
    stats.distinct > 150 && stats.litPct > 2,
    `distinct=${stats.distinct} lit=${stats.litPct}% accent=${stats.accentPct}%`,
  );

  const changed = await regionChanged(page, CLUSTER_CLIP);
  ok("3D animates over time", changed === 1, changed ? "pixels differ" : "frozen");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  ok("no horizontal overflow", overflow <= 0, `${overflow}px`);

  const brokenAnchors = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h !== "#" && !document.querySelector(h)),
  );
  ok(
    "all in-page anchors resolve",
    brokenAnchors.length === 0,
    [...new Set(brokenAnchors)].join(", ") || "0 broken",
  );

  const seo = await page.evaluate(() => ({
    desc: document.querySelector('meta[name="description"]')?.content?.length ?? 0,
    og: document.querySelectorAll('meta[property^="og:"]').length,
    ld: !!document.querySelector('script[type="application/ld+json"]'),
    h1: document.querySelectorAll("h1").length,
  }));
  ok(
    "SEO metadata present",
    seo.desc > 60 && seo.og >= 4 && seo.ld && seo.h1 === 1,
    `desc=${seo.desc} og=${seo.og} jsonld=${seo.ld} h1=${seo.h1}`,
  );

  ok("no console errors (desktop)", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

/* ---------------- 3: prefers-reduced-motion must freeze the scene ----------- */
{
  const { ctx, page, errors } = await newPage({ reducedMotion: "reduce" });
  await page.waitForSelector("canvas", { timeout: 20_000 });
  await page.waitForTimeout(2500);
  const changed = await regionChanged(page, CLUSTER_CLIP, 1100);
  ok("reduced-motion freezes 3D", changed === 0, changed ? "still moving" : "static");
  const stats = await analyse(page, CLUSTER_CLIP);
  ok("reduced-motion still renders scene", stats.distinct > 120, `distinct=${stats.distinct}`);
  ok("no console errors (reduced motion)", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

/* ---------------- 4: no WebGL -> CSS fallback, no crash --------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      if (String(type).startsWith("webgl")) return null;
      return orig.call(this, type, ...rest);
    };
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e.message)));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const noCanvas = await page.evaluate(() => !document.querySelector("canvas"));
  const fallbackNodes = await page.evaluate(
    () => document.querySelectorAll('[class*="animate-drift"]').length,
  );
  ok("WebGL-less: no canvas mounted", noCanvas);
  ok("WebGL-less: CSS fallback cluster shown", fallbackNodes >= 3, `${fallbackNodes} shards`);
  ok("WebGL-less: no console errors", errs.length === 0, errs.slice(0, 2).join(" | "));
  await ctx.close();
}

/* ---------------- 5: mobile layout + nav menu ------------------------------ */
{
  const { ctx, page, errors } = await newPage({ viewport: { width: 390, height: 844 } });
  await page.waitForSelector("canvas", { timeout: 20_000 });
  await page.waitForTimeout(2200);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  ok("mobile: no horizontal overflow", overflow <= 0, `${overflow}px`);

  // R3F caps dpr at 1.5 on small screens: canvas backing store stays modest.
  const dprRatio = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    return c ? +(c.width / c.getBoundingClientRect().width).toFixed(2) : 0;
  });
  ok("mobile: canvas resolution capped", dprRatio > 0 && dprRatio <= 1.6, `backing ratio=${dprRatio}`);

  const burger = page.locator('header button[aria-expanded]').first();
  const hasBurger = (await burger.count()) > 0;
  if (hasBurger) {
    await burger.click();
    await page.waitForTimeout(400);
    const links = await page.locator('#mobile-menu a[href^="#"]').count();
    ok("mobile: menu opens with links", links >= 3, `${links} links`);
    await burger.click();
  } else {
    ok("mobile: menu opens with links", false, "no toggle found");
  }

  const tap = await page.evaluate(() => {
    const c = document.elementFromPoint(window.innerWidth / 2, 700);
    return { hit: c?.tagName, overlayBlocks: c?.tagName === "CANVAS" };
  });
  ok("mobile: canvas never blocks taps", !tap.overlayBlocks, `top element at hero centre: ${tap.hit}`);
  ok("no console errors (mobile)", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;
