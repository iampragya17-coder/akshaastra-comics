// Sanity-backed content for the two "no data yet" page families:
// Episodes & Stories and Characters > Intros & Breakdowns.
//
// SCHEMA ASSUMPTIONS (unverified — the actual Sanity schema can't be
// inspected from this codebase). This mirrors the shape of the legacy
// Journal implementation in index.html (see loadJournalList/loadJournalPost,
// which queried `_type == "post"`), extended with a `world` field per the
// decision that Episodes & Stories and Intros & Breakdowns are per-world:
//
//   episode (or reused "post" type with a `kind` field):
//     _id, title, "slug": slug.current, excerpt, publishDate,
//     "coverUrl": coverImage.asset->url, body (Portable Text),
//     world: "warm" | "cold" | "border"
//
//   characterProfile (Intros & Breakdowns):
//     _id, title, "slug": slug.current, excerpt, publishDate,
//     "coverUrl": coverImage.asset->url, body (Portable Text),
//     world: "warm" | "cold" | "border",
//     "characterName": character->name   (optional reference)
//
// If the real schema differs (different type names, a reference to a
// world document instead of a plain string field, etc.) only the GROQ
// filters below need to change — the page components consume the same
// normalized `SanityListItem` / `SanityPost` shapes regardless.

import type { WorldKey } from "./types";

const SANITY_PROJECT_ID = "nfr0qo7f";
const SANITY_DATASET = "production";

export interface SanityListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishDate?: string;
  coverUrl?: string;
}

export interface SanityPost extends SanityListItem {
  body?: unknown;
}

async function sanityFetch<T>(query: string, params?: Record<string, string>): Promise<T | null> {
  const qs = [`query=${encodeURIComponent(query)}`];
  if (params) {
    for (const k of Object.keys(params)) {
      qs.push(`$${k}=${encodeURIComponent(JSON.stringify(params[k]))}`);
    }
  }
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?${qs.join("&")}`;
  try {
    // ISR: revalidate hourly so newly published Sanity content shows up
    // without a redeploy, per the requirement to fetch server-side with
    // Next.js revalidation rather than the old client-side polling.
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result as T;
  } catch {
    return null;
  }
}

export async function getEpisodesAndStories(world: WorldKey): Promise<SanityListItem[]> {
  const q = `*[_type == "post" && world == $world && defined(slug.current)] | order(publishDate desc){ _id, title, "slug": slug.current, excerpt, publishDate, "coverUrl": coverImage.asset->url }`;
  const result = await sanityFetch<SanityListItem[]>(q, { world });
  return result ?? [];
}

export async function getEpisodeOrStory(world: WorldKey, slug: string): Promise<SanityPost | null> {
  const q = `*[_type == "post" && world == $world && slug.current == $slug][0]{ _id, title, "slug": slug.current, excerpt, publishDate, body, "coverUrl": coverImage.asset->url }`;
  return sanityFetch<SanityPost>(q, { world, slug });
}

export async function getIntrosAndBreakdowns(world: WorldKey): Promise<SanityListItem[]> {
  const q = `*[_type == "characterProfile" && world == $world && defined(slug.current)] | order(publishDate desc){ _id, title, "slug": slug.current, excerpt, publishDate, "coverUrl": coverImage.asset->url }`;
  const result = await sanityFetch<SanityListItem[]>(q, { world });
  return result ?? [];
}

export async function getIntroOrBreakdown(world: WorldKey, slug: string): Promise<SanityPost | null> {
  const q = `*[_type == "characterProfile" && world == $world && slug.current == $slug][0]{ _id, title, "slug": slug.current, excerpt, publishDate, body, "coverUrl": coverImage.asset->url }`;
  return sanityFetch<SanityPost>(q, { world, slug });
}
