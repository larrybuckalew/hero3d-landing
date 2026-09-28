import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

// GitHub Pages builds with `output: export`, where every route must be static.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
