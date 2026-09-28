/**
 * Single source of truth for copy + brand tokens.
 * Rebrand the whole page by editing this file.
 */

export const site = {
  name: "Helio",
  tagline: "The AI ops copilot for modern teams",
  url: "https://larrybuckalew.github.io/hero3d-landing",
  // `metadataBase` must be the bare ORIGIN: Next.js appends `basePath` to
  // metadata URLs itself, so putting the sub-path in here would double it up
  // (…/hero3d-landing/hero3d-landing/opengraph-image.png).
  origin: "https://larrybuckalew.github.io",
  description:
    "Helio watches every signal across your stack, writes the runbook, and runs the fix — so your team ships instead of firefighting.",
  primaryCta: { label: "Start free trial", href: "#cta" },
  secondaryCta: { label: "See it in action", href: "#workflows" },
} as const;

export const nav = [
  { label: "Platform", href: "#platform" },
  { label: "Workflows", href: "#workflows" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#resources" },
] as const;

export const hero = {
  eyebrow: "Public beta — 4 regions live",
  titleLead: "Ship at the speed of",
  titleAccent: "your best engineer",
  body: "Helio ingests logs, traces, and tickets, then drafts the fix and opens the PR. Fewer 3am pages, more shipped features.",
  bullets: ["SOC 2 Type II", "14-day trial", "No credit card"],
} as const;

export const logos = [
  "Northwind",
  "Lumen Grid",
  "Aperture",
  "Ridgeline",
  "Corely",
  "Vantage 9",
  "Bluepeak",
] as const;

export const stats = [
  { value: "72%", label: "fewer escalations" },
  { value: "4.1min", label: "median time-to-fix" },
  { value: "38k", label: "runbooks auto-written" },
  { value: "99.98%", label: "control-plane uptime" },
] as const;

export const features = [
  {
    title: "Signal-aware copilot",
    body: "Every alert arrives with the trace, the deploy, and the customer already summarised. Zero tab-hopping.",
    icon: "radar",
    accent: "plasma",
  },
  {
    title: "Runbooks that write themselves",
    body: "Helio turns each resolved incident into a reusable, reviewable runbook your whole org can trust.",
    icon: "spark",
    accent: "volt",
  },
  {
    title: "Guardrailed automations",
    body: "Approve-on-merge remediation with blast-radius limits, dry-runs, and a full audit trail from day one.",
    icon: "shield",
    accent: "ion",
  },
  {
    title: "Deploys that self-heal",
    body: "Canary analysis wired to your metrics. Bad release? Helio rolls it back before your users notice.",
    icon: "loop",
    accent: "magenta",
  },
] as const;

export const cta = {
  title: "Put your on-call rotation on autopilot",
  body: "Spin up Helio in a single command, point it at one service, and watch the first runbook land in review tonight.",
  primary: "Create workspace",
  secondary: "Talk to an engineer",
  hint: "Free for 3 seats, forever.",
} as const;

export const footer = {
  blurb: "Helio is an AI operations copilot for teams who would rather build than babysit.",
  columns: [
    { title: "Product", links: ["Platform", "Workflows", "Integrations", "Changelog"] },
    { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
    { title: "Resources", links: ["Docs", "API status", "Security", "Trust center"] },
  ],
} as const;
