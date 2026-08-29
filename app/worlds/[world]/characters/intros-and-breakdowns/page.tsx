import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { getIntrosAndBreakdowns } from "@/lib/sanity";
import TapLink from "@/components/TapLink";

export const revalidate = 3600;

export function generateStaticParams() {
  return WORLD_KEYS.map((world) => ({ world }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string }>;
}): Promise<Metadata> {
  const { world } = await params;
  if (!isWorldKey(world)) return {};
  const { meta } = getWorld(world);
  return {
    title: "Intros & Breakdowns",
    description: `Character intros and breakdowns for ${meta.displayName} — new profiles are on the way.`,
  };
}

export default async function IntrosAndBreakdownsIndex({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const posts = await getIntrosAndBreakdowns(world);

  return (
    <section className="flex flex-col gap-10 px-6 py-16 md:px-16">
      <TapLink href={`/worlds/${world}/characters`} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
        ← {meta.charsTitle}
      </TapLink>
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(34px,4.6vw,60px)",
          color: meta.title,
          textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
        }}
      >
        INTROS & BREAKDOWNS
      </h1>

      {posts.length === 0 ? (
        <p style={{ fontSize: 16, color: meta.sub, maxWidth: 480 }}>
          New chapters are being written — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p._id} href={`/worlds/${world}/characters/intros-and-breakdowns/${p.slug}`} className="world-card flex flex-col gap-2 p-5">
              <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 18, color: meta.ink }}>{p.title}</div>
              {p.excerpt ? <div style={{ fontSize: 12, color: meta.sub }}>{p.excerpt}</div> : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
