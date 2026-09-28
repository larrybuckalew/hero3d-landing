/**
 * Renders the 1200x630 social card to `src/app/opengraph-image.png`.
 *
 * Why a committed PNG instead of the `opengraph-image.tsx` route? Under
 * `output: export` the dynamic route is written to `out/opengraph-image` with
 * NO file extension, and GitHub Pages then serves it as application/octet-stream
 * — which Facebook/LinkedIn/Slack refuse to render. A real `.png` in the app
 * dir is picked up by Next's metadata-file convention and served as image/png.
 *
 *   node tools/og-card.mjs
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const out = new URL("../src/app/opengraph-image.png", import.meta.url).pathname.replace(
  /^\/(\w:)/,
  "$1",
);
mkdirSync(new URL("../src/app/", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"), {
  recursive: true,
});

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @import url("https://fonts.googleapis.com/css2?family=Sora:wght@700&family=Inter:wght@400;600&display=swap");
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: radial-gradient(120% 90% at 78% 0%, #1b1440 0%, #0a0c1f 48%, #04050c 100%);
    color: #fff;
    font-family: Inter, system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 72px; position: relative; overflow: hidden;
  }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(124,92,255,0.10) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,92,255,0.10) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(80% 60% at 20% 100%, #000 0%, transparent 75%);
  }
  .orb {
    position: absolute; right: -80px; top: 90px;
    width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #a78bfa, #7c5cff 38%, #0b1030 72%);
    filter: blur(6px); opacity: 0.75;
  }
  .row { display: flex; align-items: center; gap: 16px; position: relative; }
  .mark {
    width: 44px; height: 44px; border-radius: 999px;
    background: linear-gradient(135deg, #c4f24a, #22d3ee 55%, #7c5cff);
  }
  .brand { font-family: Sora, Inter, sans-serif; font-size: 30px; font-weight: 700; }
  h1 {
    font-family: Sora, Inter, sans-serif;
    font-size: 76px; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em;
    position: relative;
  }
  .accent {
    background: linear-gradient(96deg, #c4f24a, #22d3ee);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .sub { font-size: 28px; color: rgba(232,236,248,0.65); margin-top: 20px; position: relative; }
  .pills { display: flex; gap: 14px; position: relative; }
  .pill {
    font-size: 22px; color: rgba(232,236,248,0.72);
    border: 1px solid rgba(232,236,248,0.18);
    border-radius: 999px; padding: 8px 20px;
    background: rgba(232,236,248,0.05);
  }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="orb"></div>

  <div class="row"><div class="mark"></div><div class="brand">Helio</div></div>

  <div>
    <h1>Ship at the speed of<br /><span class="accent">your best engineer</span></h1>
    <div class="sub">The AI ops copilot that finds the bug, writes the fix, opens the PR.</div>
  </div>

  <div class="pills">
    <div class="pill">SOC 2 Type II</div>
    <div class="pill">14-day trial</div>
    <div class="pill">No credit card</div>
  </div>
</body>
</html>`;

// The bundled Playwright browser isn't always installed; fall back to system
// Chrome, then to a plain chromium launch.
async function launch() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return await chromium.launch();
  }
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out}`);
