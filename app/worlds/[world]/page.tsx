import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { JsonLd, creativeWorkSeriesJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return WORLD_KEYS.map((world) => ({ world }));
}

const HUB_METADATA: Record<string, { title: string; description: string }> = {
  warm: {
    title: "Rudrakshi & The Warm World — Neelavalley | AkshaAstra",
    description:
      "Explore Neelavalley, the warm world of AkshaAstra — Rudrakshi's coastborn cities, healing mythic-tech, and the full Warm Cast.",
  },
  cold: {
    title: "Tamasa Andhakara & The Cold World — Sthavantum | AkshaAstra",
    description:
      "Enter Sthavantum, the cold world of AkshaAstra ruled by Tamasa Andhakara and the Sthiti Nexus — where nothing moves unmeasured.",
  },
  border: {
    title: "Vaitarandor — The City Between | AkshaAstra",
    description:
      "Cross the Vaitarani into Vaitarandor, the liminal border city between AkshaAstra's warm and cold worlds — rooted in Shiva Purana mythology.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string }>;
}): Promise<Metadata> {
  const { world } = await params;
  if (!isWorldKey(world)) return {};
  const override = HUB_METADATA[world];
  if (override) return { title: { absolute: override.title }, description: override.description };
  const { meta } = getWorld(world);
  return {
    title: meta.displayName,
    description: meta.tag,
  };
}

const TILES: Record<string, { nav: string; label: string; kicker: string; sub: string }[]> = {
  warm: [
    { nav: "cities", kicker: "EXPLORE", label: "CITIES & CORPORATIONS", sub: "Six warm cities and the circles, academies, and markets they organise into." },
    { nav: "characters", kicker: "MEET", label: "CHARACTERS", sub: "Rudrakshi and the coastborn — the marked, the loud, the impossible to hold still." },
    { nav: "tech", kicker: "WALK-THROUGH", label: "TECH, WEAPONS & VESSELS", sub: "Scanners, circuits, sacred vessels, and the elixirs that carry a heal." },
    { nav: "infrastructure", kicker: "WALK-THROUGH", label: "INFRASTRUCTURE", sub: "Keeps, docks, skyports, coin — and how the streets talk." },
    { nav: "episodes-and-stories", kicker: "READ", label: "EPISODES & STORIES", sub: "Dispatches and chapters from the warm world." },
  ],
  cold: [
    { nav: "cities", kicker: "EXPLORE", label: "CITIES & CORPORATIONS", sub: "Six cold cities and the orders, systems, and holdings that run them." },
    { nav: "characters", kicker: "MEET", label: "CHARACTERS", sub: "Tamasa and the measured — the still, the patient, the already-decided." },
    { nav: "tech", kicker: "WALK-THROUGH", label: "TECH, WEAPONS & VESSELS", sub: "Binding-code, counterfeit sight, poison-science, and the sedatives that hold." },
    { nav: "infrastructure", kicker: "WALK-THROUGH", label: "INFRASTRUCTURE", sub: "Keeps, kiosks, airgrids, coin — and the language of the stilled." },
    { nav: "episodes-and-stories", kicker: "READ", label: "EPISODES & STORIES", sub: "Dispatches and chapters from the cold world." },
  ],
  border: [
    { nav: "cities", kicker: "EXPLORE", label: "ZONES", sub: "Six border environments — the crossing-city and the five liminal zones around it." },
    { nav: "characters", kicker: "MEET", label: "CAST", sub: "The underworld — world-agnostic, morally grey, native to the seam." },
    { nav: "tech", kicker: "WALK-THROUGH", label: "THE SYSTEM", sub: "One weapon, one coin, and the trade-tongue of Vaitarandor." },
    { nav: "episodes-and-stories", kicker: "READ", label: "EPISODES & STORIES", sub: "Crossings between the two worlds' stories." },
  ],
};

export default async function WorldHub({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const tiles = TILES[world];

  return (
    <section className="flex flex-col gap-10 px-6 py-16 md:px-16">
      <JsonLd
        data={creativeWorkSeriesJsonLd({
          name: meta.displayName,
          description: meta.tag,
          url: `${SITE_URL}/worlds/${world}`,
          genre: ["Mythology", "Science Fiction", "Noir", "Webcomic"],
          inLanguage: "en",
          isPartOf: { name: "AkshaAstra Comics", url: SITE_URL },
        })}
      />
      <div className="flex flex-col gap-3">
        <h1
          style={{
            fontFamily: "var(--font-alfa-slab), serif",
            fontSize: "clamp(40px,5.6vw,80px)",
            lineHeight: 0.95,
            color: meta.title,
            textShadow: `4px 4px 0 #000, 0 0 44px ${meta.glow}`,
          }}
        >
          {meta.name}
        </h1>
        <p style={{ fontSize: 13, letterSpacing: ".14em", lineHeight: 1.9, color: meta.sub, maxWidth: 520 }}>
          {meta.tag}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t, i) => (
          <Link
            key={t.nav}
            href={`/worlds/${world}/${t.nav}`}
            className="world-card relative flex min-h-[200px] flex-col gap-3 p-6"
          >
            <div
              className="pointer-events-none absolute bottom-0 right-0 p-2"
              style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 52, color: meta.num }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".4em", color: meta.accent }}>
              {t.kicker}
            </div>
            <div style={{ fontFamily: "var(--font-alfa-slab), serif", fontSize: 22, color: meta.ink, textShadow: "2px 2px 0 #000" }}>
              {t.label}
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: meta.sub }}>{t.sub}</div>
            <div style={{ marginTop: "auto", fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
              OPEN →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
