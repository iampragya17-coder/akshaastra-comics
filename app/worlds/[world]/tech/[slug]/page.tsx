import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { JsonLd, creativeWorkJsonLd } from "@/lib/jsonld";
import { heroImageSizes } from "@/lib/images";
import TapLink from "@/components/TapLink";

export function generateStaticParams() {
  return WORLD_KEYS.flatMap((world) => getWorld(world).tech.map((t) => ({ world, slug: t.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}): Promise<Metadata> {
  const { world, slug } = await params;
  if (!isWorldKey(world)) return {};
  const item = getWorld(world).tech.find((t) => t.slug === slug);
  if (!item) return {};
  return { title: item.n, description: item.d };
}

export default async function TechDetail({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}) {
  const { world, slug } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const item = getWorld(world).tech.find((t) => t.slug === slug);
  if (!item) notFound();

  return (
    <article className="flex flex-col gap-8 px-6 py-16 md:px-16">
      <JsonLd
        data={creativeWorkJsonLd({
          name: item.n,
          description: item.d,
          url: `${SITE_URL}/worlds/${world}/tech/${item.slug}`,
          genre: "Technology",
          image: item.imageUrl || undefined,
        })}
      />
      <TapLink href={`/worlds/${world}/tech`} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
        ← {meta.techTitle}
      </TapLink>
      {item.imageUrl ? (
        <div className="relative h-64 w-full max-w-2xl overflow-hidden">
          <Image src={item.imageUrl} alt={item.n} fill sizes={heroImageSizes(700)} className="object-cover" preload />
        </div>
      ) : null}
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(30px,4.2vw,52px)",
          color: meta.title,
          textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
        }}
      >
        {item.n}
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.9, color: meta.sub, maxWidth: 640 }}>{item.d}</p>
    </article>
  );
}
