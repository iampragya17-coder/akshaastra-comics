import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { getEpisodesAndStories } from "@/lib/sanity";
import { SITE_URL } from "@/lib/site";
import { JsonLd, collectionPageJsonLd } from "@/lib/jsonld";

export const revalidate = 3600;

export function generateStaticParams() {
  return WORLD_KEYS.map((world) => ({ world }));
}

const STORIES_METADATA: Record<string, { title: string; description: string }> = {
  warm: {
    title: "Stories — Neelavalley Dispatches | AkshaAstra",
    description:
      "Chapters and dispatches from Rudrakshi's warm world of Neelavalley, part of the AkshaAstra mythology sci-fi noir universe.",
  },
  cold: {
    title: "Stories — Sthavantum Dispatches | AkshaAstra",
    description:
      "Chapters and dispatches from Tamasa Andhakara's cold world of Sthavantum, part of the AkshaAstra mythology sci-fi noir universe.",
  },
  border: {
    title: "Stories — Vaitarandor Dispatches | AkshaAstra",
    description:
      "Chapters and dispatches from the border city of Vaitarandor, where AkshaAstra's warm and cold worlds cross.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string }>;
}): Promise<Metadata> {
  const { world } = await params;
  if (!isWorldKey(world)) return {};
  const override = STORIES_METADATA[world];
  if (override) return { title: { absolute: override.title }, description: override.description };
  const { meta } = getWorld(world);
  return {
    title: "Episodes & Stories",
    description: `Episodes and stories from ${meta.displayName} — new chapters are being written.`,
  };
}

export default async function EpisodesAndStoriesIndex({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const posts = await getEpisodesAndStories(world);

  return (
    <section className="flex flex-col gap-10 px-6 py-16 md:px-16">
      <JsonLd
        data={collectionPageJsonLd({
          name: STORIES_METADATA[world]?.title ?? "Episodes & Stories",
          url: `${SITE_URL}/worlds/${world}/episodes-and-stories`,
          description: STORIES_METADATA[world]?.description,
        })}
      />
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(34px,4.6vw,60px)",
          color: meta.title,
          textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
        }}
      >
        EPISODES & STORIES
      </h1>

      {posts.length === 0 ? (
        <p style={{ fontSize: 16, color: meta.sub, maxWidth: 480 }}>
          New chapters are being written — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p._id} href={`/worlds/${world}/episodes-and-stories/${p.slug}`} className="world-card flex flex-col gap-2 p-5">
              <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 18, color: meta.ink }}>{p.title}</div>
              {p.excerpt ? <div style={{ fontSize: 12, color: meta.sub }}>{p.excerpt}</div> : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
