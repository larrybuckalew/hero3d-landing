# Helio — 3D hero landing page

A dark, neon, single-page marketing site built with **Next.js 16 (App Router) +
React Three Fiber + Tailwind CSS v4**. The hero is a live WebGL scene: a metal
torus-knot core wrapped in a wireframe shell, with twelve shards (icosahedra,
octahedra, tetrahedra, tori, cubes) orbiting on tilted planes.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-checks too)
npm start        # serve .next
npm run typecheck
npm run lint
npm run shots    # screenshot smoke test — needs a server running + Chrome
npm run verify   # pixel-level QA of the 3D hero — needs a server running + Chrome
```

## Where things live

```
src/
  app/
    layout.tsx            # fonts, metadata, JSON-LD, skip link, nav
    page.tsx              # section order
    globals.css           # Tailwind v4 @theme tokens, keyframes, .glass/.shell
    opengraph-image.tsx   # 1200x630 OG card rendered by next/og
    sitemap.ts robots.ts manifest.ts icon.svg
  components/
    Hero.tsx              # copy + background stack + floating proof card
    Nav.tsx LogoMarquee.tsx Features.tsx Stats.tsx
    Workflows.tsx Pricing.tsx CTA.tsx Footer.tsx Icons.tsx
    three/
      ClusterScene.tsx    # the R3F scene (shards, materials, lights, rig)
      HeroCanvas.tsx      # client wrapper: WebGL probe, mobile tier, IO pause
  lib/site.ts             # ALL copy and brand strings — edit here to rebrand
tools/capture.mjs         # Playwright visual check (writes shots/*.png)
tools/verify.mjs          # pixel-level QA: render loop, motion, reduced-motion,
                          # no-WebGL fallback, overflow, anchors, mobile menu
```

## QA status

`npm run build` is clean (every route prerenders static) and `npm run verify`
passes 17/18 checks against `npm start`:

- canvas paints real geometry (sampled ~3k distinct colors in the 3D region)
- the scene animates; with `prefers-reduced-motion` the same region is
  pixel-identical across 1.1s
- with `getContext('webgl*')` stubbed to `null`, no canvas mounts and the
  pure-CSS cluster appears — no console errors in any of the three modes
- no horizontal overflow at 1440px or 390px, mobile menu opens, and the
  `pointer-events: none` canvas never swallows a tap

The one non-passing check is frame rate (~2 fps), which is an artifact of
headless Chrome falling back to **SwiftShader** (a CPU rasterizer) for
`MeshPhysicalMaterial` with clearcoat/iridescence. The scene itself is ~20
low-poly meshes with a single `useFrame`, so it is GPU-trivial on real
hardware; confirm on a device with a real GPU before treating it as a
performance number.

## How the 3D hero works

- **One canvas, full-bleed, `pointer-events: none`.** Hero copy stays
  selectable and the page still scrolls on top of it. Because the canvas ignores
  pointer events, parallax reads the cursor from a **window `pointermove`
  listener**, not from R3F's canvas events.
- **Rig** (`ClusterScene.tsx`): a single group does cursor parallax
  (`rotation.x/y`) plus scroll-linked drift (`position.y/z`, slight scale-down),
  all frame-rate independent via `THREE.MathUtils.damp`.
- **Shard belt**: 12 orbit groups animated inside **one** `useFrame` loop that
  writes to refs — no React re-render per frame.
- **Reflections without a network request**: `<Environment>` is generated from
  in-scene `<Lightformer>` panels (violet top, cyan left, lime right, pink ring)
  so metallic/clearcoat/iridescent materials have something to reflect even
  offline. Soft grounding comes from `<ContactShadows>` instead of shadow maps.
- **Materials** and geometries are created once in `useAssets()` and disposed on
  unmount.

## Performance & accessibility

- Mobile (`max-width: 768px`) gets 8 shards instead of 12, `dpr` capped at 1.5,
  and a 256px contact-shadow buffer; desktop `dpr` caps at 2.
- `IntersectionObserver` flips R3F's `frameloop` to `never` once the hero leaves
  the viewport (and `invalidate()` kicks it on the way back).
- `prefers-reduced-motion`: frameloop becomes `demand`, all `Float`/orbit/camera
  motion is disabled, and CSS animations are neutered in `globals.css`.
- No WebGL (or a lost GPU context) → a pure-CSS cluster fallback, so the hero is
  never empty.
- Skip link, `aria-hidden` on decorative layers, visible `:focus-visible` ring,
  `aria-expanded`/`aria-controls` on the mobile menu.

## SEO

Metadata API (title template, description, keywords, canonical), Open Graph +
Twitter card with a generated `opengraph-image`, `SoftwareApplication` JSON-LD,
`sitemap.xml`, `robots.txt`, and a PWA manifest. Swap `site.url` in
`src/lib/site.ts` before deploying so canonical/OG/sitemap URLs are real.

## Tweaking the scene

| Want to change            | Edit                                                        |
| ------------------------- | ----------------------------------------------------------- |
| Number/shape of shards    | `SHARDS` array in `ClusterScene.tsx`                        |
| Colors of the geometry    | `useAssets()` → `mats` (`plasma` / `volt` / `ion` / `frost`) |
| Parallax strength         | `Rig()` multipliers (`0.42`, `0.26`)                        |
| Camera framing            | `camera` prop on `<Canvas>` (`position`, `fov`)             |
| Hero↔3D balance on desktop | `md:translate-x-[14%] xl:translate-x-[19%]` in `Hero.tsx`   |
| Brand copy / links / tiers | `src/lib/site.ts`                                           |
