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
  return { title: meta.techTitle, description: `${meta.techTitle} of ${meta.displayName}, plus currency and street slang.` };
}

export default async function TechIndex({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta, tech, currency, slang } = getWorld(world);

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
        {meta.techTitle}
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tech.map((t) => (
          <Link key={t.slug} href={`/worlds/${world}/tech/${t.slug}`} className="world-card flex flex-col gap-2 overflow-hidden p-5">
            {t.imageUrl ? (
              <div className="relative h-36 w-full overflow-hidden">
                <Image src={t.imageUrl} alt={t.n} fill sizes={IMAGE_SIZES_GRID_CARD} className="object-cover" />
              </div>
            ) : null}
            <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 17, color: meta.ink }}>{t.n}</div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: meta.sub }}>{t.d}</div>
          </Link>
        ))}
      </div>

      {currency.length > 0 ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
            CURRENCY
          </h2>
          <ul className="flex flex-col gap-3">
            {currency.map((c) => (
              <li key={c.slug} className="world-card flex items-center gap-4 overflow-hidden p-4">
                {c.imageUrl ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                    <Image src={c.imageUrl} alt={c.n} fill sizes="64px" className="object-cover" />
                  </div>
                ) : null}
                <div>
                  <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 16, color: meta.ink }}>{c.n}</div>
                  <div style={{ fontSize: 12, color: meta.sub }}>{c.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {slang.length > 0 ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
            STREET SLANG
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
