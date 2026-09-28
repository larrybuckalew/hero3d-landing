/**
 * Visual smoke test: loads the running server, waits for the WebGL canvas to
 * actually paint, captures desktop + mobile shots, reports console errors.
 *
 *   npm run build && npm start        # then, in another shell:
 *   npm run shots                     # or: node tools/capture.mjs http://localhost:3000
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = new URL("../shots/", import.meta.url).pathname.replace(
  /^\/(\w:)/,
  "$1",
);
mkdirSync(outDir, { recursive: true });

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
const problems = [];

async function capture(name, viewport, opts = {}) {
  const { scroll = 0, fullPage = false, waitForCanvas = true } = opts;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`[${name}] console: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`[${name}] pageerror: ${e.message}`));

  await page.goto(base, { waitUntil: "networkidle" });

  if (waitForCanvas) {
    await page.waitForSelector("canvas", { timeout: 20_000 });
    // Let the render loop draw real geometry, not just a clear color.
    await page.waitForTimeout(3000);
  }
  if (scroll) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      scroll,
    );
    await page.waitForTimeout(1500);
  }

  const file = `${outDir}${name}.png`;
  await page.screenshot({ path: file, fullPage });
  const painted = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return "no canvas";
    return `${c.width}x${c.height}`;
  });
  console.log(`captured ${file} — canvas ${painted}`);
  await page.close();
}

await capture("hero-desktop", { width: 1440, height: 900 });
await capture(
  "full-desktop",
  { width: 1440, height: 900 },
  { fullPage: true, waitForCanvas: false },
);
await capture(
  "workflows-desktop",
  { width: 1440, height: 900 },
  { scroll: 2400, waitForCanvas: false },
);
await capture("hero-mobile", { width: 390, height: 844 });

await browser.close();

if (problems.length) {
  console.error("\nPROBLEMS:");
  for (const p of problems) console.error(" -", p);
  process.exitCode = 1;
} else {
  console.log("\nno console errors");
}
