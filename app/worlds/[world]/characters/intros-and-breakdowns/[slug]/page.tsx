import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { getIntroOrBreakdown } from "@/lib/sanity";
import { JsonLd, articleJsonLd } from "@/lib/jsonld";
import TapLink from "@/components/TapLink";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}): Promise<Metadata> {
  const { world, slug } = await params;
  if (!isWorldKey(world)) return {};
  const post = await getIntroOrBreakdown(world, slug);
  if (!post) return { title: "Intro / Breakdown" };
  return { title: post.title, description: post.excerpt };
}

export default async function IntroOrBreakdownDetail({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}) {
  const { world, slug } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const post = await getIntroOrBreakdown(world, slug);

  return (
    <article className="flex flex-col gap-8 px-6 py-16 md:px-16">
      <TapLink href={`/worlds/${world}/characters/intros-and-breakdowns`} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
        ← INTROS & BREAKDOWNS
      </TapLink>

      {!post ? (
        <>
          <h1 style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: "clamp(30px,4.2vw,52px)", color: meta.title }}>
            This profile hasn’t been written yet
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
              url: `${SITE_URL}/worlds/${world}/characters/intros-and-breakdowns/${post.slug}`,
              datePublished: post.publishDate,
              image: post.coverUrl,
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
          {post.excerpt ? <p style={{ fontSize: 16, lineHeight: 1.9, color: meta.sub, maxWidth: 640 }}>{post.excerpt}</p> : null}
        </>
      )}
    </article>
  );
}
