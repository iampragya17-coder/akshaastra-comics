import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { getEpisodeOrStory } from "@/lib/sanity";
import { JsonLd, articleJsonLd } from "@/lib/jsonld";
import TapLink from "@/components/TapLink";

const LINKEDIN_URL = "https://www.linkedin.com/in/pragyan-sharma-b4665bb4/";

export const revalidate = 3600;

// Dynamic slugs are Sanity-backed and unknowable at build time, so this
// route is rendered on demand (ISR) rather than fully static.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}): Promise<Metadata> {
  const { world, slug } = await params;
  if (!isWorldKey(world)) return {};
  const post = await getEpisodeOrStory(world, slug);
  if (!post) return { title: "Episode / Story" };
  return { title: post.title, description: post.excerpt };
}

export default async function EpisodeOrStoryDetail({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}) {
  const { world, slug } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const post = await getEpisodeOrStory(world, slug);

  return (
    <article className="flex flex-col gap-8 px-6 py-16 md:px-16">
      <TapLink href={`/worlds/${world}/episodes-and-stories`} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
        ← EPISODES & STORIES
      </TapLink>

      {!post ? (
        <>
          <h1 style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: "clamp(30px,4.2vw,52px)", color: meta.title }}>
            This chapter hasn’t been written yet
          </h1>
          <p style={{ fontSize: 16, color: meta.sub, maxWidth: 480 }}>
            New chapters are being written — check back soon.
          </p>
        </>
      ) : (
        <>
          <JsonLd
            data={articleJsonLd({
              headline: post.title,
              description: post.excerpt,
              url: `${SITE_URL}/worlds/${world}/episodes-and-stories/${post.slug}`,
              datePublished: post.publishDate,
              image: post.coverUrl,
              author: {
                name: "Pragyan Sharma",
                url: `${SITE_URL}/about`,
                jobTitle: "Creative Director",
                sameAs: [LINKEDIN_URL],
              },
              publisher: {
                name: "AkshaAstra Comics",
                logoUrl: `${SITE_URL}/logo.png`,
              },
            })}
          />
          <h1
            style={{
              fontFamily: "var(--font-alfa-slab), serif",
              fontSize: "clamp(30px,4.2vw,52px)",
              color: meta.title,
              textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
            }}
          >
            {post.title}
          </h1>
          <TapLink
            href="/about"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 11,
              letterSpacing: ".2em",
              color: meta.accent,
              textDecoration: "underline",
            }}
          >
            Written by Pragyan Sharma, Creative Director
          </TapLink>
          {post.excerpt ? <p style={{ fontSize: 16, lineHeight: 1.9, color: meta.sub, maxWidth: 640 }}>{post.excerpt}</p> : null}
          {/* Full Portable Text rendering is intentionally omitted until the
              real Sanity schema for body content is confirmed. */}
        </>
      )}
    </article>
  );
}
