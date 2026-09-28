import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

// GitHub Pages builds with `output: export`, where every route must be static.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#04050c",
    theme_color: "#04050c",
    icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
