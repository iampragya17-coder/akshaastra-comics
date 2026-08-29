import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld, findRelatedCities } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { JsonLd, creativeWorkJsonLd } from "@/lib/jsonld";
import { heroImageSizes } from "@/lib/images";
import TapLink from "@/components/TapLink";

export function generateStaticParams() {
  return WORLD_KEYS.flatMap((world) => getWorld(world).organizations.map((o) => ({ world, slug: o.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}): Promise<Metadata> {
  const { world, slug } = await params;
  if (!isWorldKey(world)) return {};
  const org = getWorld(world).organizations.find((o) => o.slug === slug);
  if (!org) return {};
  return { title: org.n, description: org.d };
}

export default async function OrganizationDetail({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}) {
  const { world, slug } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const org = getWorld(world).organizations.find((o) => o.slug === slug);
  if (!org) notFound();

  // City mentioned in the org's description is treated as its home city.
  const relatedCities = findRelatedCities(world, org.d);

  return (
    <article className="flex flex-col gap-8 px-6 py-16 md:px-16">
      <JsonLd
        data={creativeWorkJsonLd({
          name: org.n,
          description: org.d,
          url: `${SITE_URL}/worlds/${world}/organizations/${org.slug}`,
          genre: "Organization",
          image: org.imageUrl || undefined,
        })}
      />
      <TapLink href={`/worlds/${world}/cities`} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
        ← {meta.cxOrgHead}
      </TapLink>
      {org.imageUrl ? (
        <div className="relative h-64 w-full max-w-2xl overflow-hidden">
          <Image src={org.imageUrl} alt={org.n} fill sizes={heroImageSizes(700)} className="object-cover" preload />
        </div>
      ) : null}
      <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".4em", color: meta.accent }}>
        {org.s}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(32px,4.4vw,56px)",
          color: meta.title,
          textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
        }}
      >
        {org.n}
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.9, color: meta.sub, maxWidth: 640 }}>{org.d}</p>

      {relatedCities.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".3em", color: meta.accent }}>
            LOCATED IN
          </h2>
          <ul className="flex flex-col">
            {relatedCities.map((c) => (
              <li key={c.slug}>
                <TapLink href={`/worlds/${world}/cities/${c.slug}`} style={{ color: meta.ink, fontSize: 15 }}>
                  {c.n} →
                </TapLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
