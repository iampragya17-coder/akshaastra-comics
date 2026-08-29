import type { MetadataRoute } from "next";
import { getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
  ];

  for (const world of WORLD_KEYS) {
    const { cities, organizations, characters, tech, infrastructure } = getWorld(world);
    const base = `${BASE_URL}/worlds/${world}`;

    entries.push(
      { url: base, changeFrequency: "monthly", priority: 0.9 },
      { url: `${base}/cities`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/characters`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/characters/intros-and-breakdowns`, changeFrequency: "weekly", priority: 0.6 },
      { url: `${base}/tech`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${base}/infrastructure`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${base}/episodes-and-stories`, changeFrequency: "weekly", priority: 0.7 }
    );

    for (const c of cities) entries.push({ url: `${base}/cities/${c.slug}`, changeFrequency: "yearly", priority: 0.6 });
    for (const o of organizations) entries.push({ url: `${base}/organizations/${o.slug}`, changeFrequency: "yearly", priority: 0.6 });
    for (const c of characters) entries.push({ url: `${base}/characters/${c.slug}`, changeFrequency: "yearly", priority: 0.6 });
    for (const t of tech) entries.push({ url: `${base}/tech/${t.slug}`, changeFrequency: "yearly", priority: 0.5 });
    for (const i of infrastructure) entries.push({ url: `${base}/infrastructure/${i.slug}`, changeFrequency: "yearly", priority: 0.5 });
  }

  return entries;
}
