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
  return { title: "Infrastructure", description: `Keeps, transit, and infrastructure of ${meta.displayName}, plus street-slang glossary.` };
}

export default async function InfrastructureIndex({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta, infrastructure, slang } = getWorld(world);

  if (infrastructure.length === 0 && slang.length === 0) {
    return (
      <section className="flex flex-col gap-6 px-6 py-16 md:px-16">
        <h1 style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: "clamp(34px,4.6vw,60px)", color: meta.title }}>
          INFRASTRUCTURE
        </h1>
        <p style={{ color: meta.sub }}>No infrastructure has been catalogued for this world yet.</p>
      </section>
    );
  }

  const keeps = infrastructure.filter((i) => i.kind === "infrastructure");
  const transit = infrastructure.filter((i) => i.kind === "transit");

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
        INFRASTRUCTURE
      </h1>

      {keeps.length > 0 ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
            KEEPS & FACILITIES
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {keeps.map((i) => (
              <Link key={i.slug} href={`/worlds/${world}/infrastructure/${i.slug}`} className="world-card flex flex-col gap-2 overflow-hidden p-5">
                {i.imageUrl ? (
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image src={i.imageUrl} alt={i.n} fill sizes={IMAGE_SIZES_GRID_CARD} className="object-cover" />
                  </div>
                ) : null}
                <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 17, color: meta.ink }}>{i.n}</div>
                <div style={{ fontSize: 12, color: meta.sub }}>{i.d}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {transit.length > 0 ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
            TRANSIT
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {transit.map((i) => (
              <Link key={i.slug} href={`/worlds/${world}/infrastructure/${i.slug}`} className="world-card flex flex-col gap-2 overflow-hidden p-5">
                {i.imageUrl ? (
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image src={i.imageUrl} alt={i.n} fill sizes={IMAGE_SIZES_GRID_CARD} className="object-cover" />
                  </div>
                ) : null}
                <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 17, color: meta.ink }}>{i.n}</div>
                <div style={{ fontSize: 12, color: meta.sub }}>{i.d}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {slang.length > 0 ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
            STREET SLANG GLOSSARY
          </h2>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {slang.map((s) => (
              <div key={s.slug} className="world-card p-4">
                <dt style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".1em", color: meta.accent }}>{s.n}</dt>
                <dd style={{ fontSize: 12, color: meta.sub, marginTop: 4 }}>{s.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}
