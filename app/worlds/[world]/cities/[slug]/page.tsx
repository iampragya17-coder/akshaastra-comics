import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld, findOrgsForCity } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { JsonLd, placeJsonLd } from "@/lib/jsonld";
import { heroImageSizes } from "@/lib/images";
import TapLink from "@/components/TapLink";

export function generateStaticParams() {
  return WORLD_KEYS.flatMap((world) => getWorld(world).cities.map((c) => ({ world, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}): Promise<Metadata> {
  const { world, slug } = await params;
  if (!isWorldKey(world)) return {};
  const city = getWorld(world).cities.find((c) => c.slug === slug);
  if (!city) return {};
  return { title: city.n, description: city.d };
}

export default async function CityDetail({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}) {
  const { world, slug } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const city = getWorld(world).cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const relatedOrgs = findOrgsForCity(world, city.n);

  return (
    <article className="flex flex-col gap-8 px-6 py-16 md:px-16">
      <JsonLd
        data={placeJsonLd({
          name: city.n,
          url: `${SITE_URL}/worlds/${world}/cities/${city.slug}`,
          description: city.d,
          image: city.imageUrl || undefined,
          isPartOf: { name: "AkshaAstra Comics", url: SITE_URL },
        })}
      />
      <TapLink href={`/worlds/${world}/cities`} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
        ← {meta.citiesCrumb}
      </TapLink>
      {city.imageUrl ? (
        <div className="relative h-64 w-full max-w-2xl overflow-hidden">
          <Image src={city.imageUrl} alt={city.n} fill sizes={heroImageSizes(700)} className="object-cover" preload />
        </div>
      ) : null}
      <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".4em", color: meta.accent }}>
        {city.t} · {city.type}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(36px,5vw,64px)",
          color: meta.title,
          textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
        }}
      >
        {city.n}
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.9, color: meta.sub, maxWidth: 640 }}>{city.d}</p>

      {relatedOrgs.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".3em", color: meta.accent }}>
            ORGANIZATIONS HERE
          </h2>
          <ul className="flex flex-col">
            {relatedOrgs.map((o) => (
              <li key={o.slug}>
                <TapLink href={`/worlds/${world}/organizations/${o.slug}`} style={{ color: meta.ink, fontSize: 15 }}>
                  {o.n} →
                </TapLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
