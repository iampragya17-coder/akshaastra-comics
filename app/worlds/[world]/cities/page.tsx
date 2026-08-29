import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { IMAGE_SIZES_GRID_CARD } from "@/lib/images";

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
    title: meta.citiesTitle,
    description: `${meta.citiesCrumb} of ${meta.displayName}: ${meta.crumbBase} and the organizations that run them.`,
  };
}

export default async function CitiesIndex({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta, cities, organizations } = getWorld(world);

  return (
    <section className="flex flex-col gap-10 px-6 py-16 md:px-16">
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(34px,4.6vw,60px)",
          color: meta.title,
          textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
        }}
      >
        {meta.citiesTitle}
      </h1>

      <div>
        <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
          CITIES
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <Link key={c.slug} href={`/worlds/${world}/cities/${c.slug}`} className="world-card flex flex-col gap-2 overflow-hidden p-5">
              {c.imageUrl ? (
                <div className="relative h-36 w-full overflow-hidden">
                  <Image src={c.imageUrl} alt={c.n} fill sizes={IMAGE_SIZES_GRID_CARD} className="object-cover" />
                </div>
              ) : null}
              <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 10, letterSpacing: ".3em", color: meta.accent }}>
                {c.t}
              </div>
              <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 20, color: meta.ink }}>{c.n}</div>
              <div style={{ fontSize: 12, color: meta.sub }}>{c.type}</div>
            </Link>
          ))}
        </div>
      </div>

      {organizations.length > 0 ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
            {meta.cxOrgHead}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((o) => (
              <Link key={o.slug} href={`/worlds/${world}/organizations/${o.slug}`} className="world-card flex flex-col gap-2 overflow-hidden p-5">
                {o.imageUrl ? (
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image src={o.imageUrl} alt={o.n} fill sizes={IMAGE_SIZES_GRID_CARD} className="object-cover" />
                  </div>
                ) : null}
                <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 10, letterSpacing: ".3em", color: meta.accent }}>
                  {o.s}
                </div>
                <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 18, color: meta.ink }}>{o.n}</div>
                <div style={{ fontSize: 12, lineHeight: 1.6, color: meta.sub }}>{o.d}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
