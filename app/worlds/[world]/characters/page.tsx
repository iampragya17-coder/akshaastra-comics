import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import CharacterCard from "@/components/CharacterCard";

export function generateStaticParams() {
  return WORLD_KEYS.map((world) => ({ world }));
}

const CHARACTERS_METADATA: Record<string, { title: string; description: string }> = {
  warm: {
    title: "Rudrakshi's Cast — Warm World Characters | AkshaAstra",
    description:
      "Meet Rudrakshi and the coastborn cast of Neelavalley — the marked, the loud, the impossible to hold still, from AkshaAstra's warm world.",
  },
  cold: {
    title: "Tamasa Andhakara's Cast — Cold World Characters | AkshaAstra",
    description:
      "Meet the cold cast of Sthavantum — Tamasa Andhakara and the Sthiti Nexus, from AkshaAstra's mythology sci-fi noir universe.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string }>;
}): Promise<Metadata> {
  const { world } = await params;
  if (!isWorldKey(world)) return {};
  const override = CHARACTERS_METADATA[world];
  if (override) return { title: { absolute: override.title }, description: override.description };
  const { meta } = getWorld(world);
  return { title: meta.charsTitle, description: `Meet the cast of ${meta.displayName}.` };
}

const ROLE_LABEL: Record<string, string> = {
  principal: "PRINCIPAL",
  cast: "CAST",
  informant: "INFORMANT",
};

export default async function CharactersIndex({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta, characters } = getWorld(world);

  const groups: Array<[string, typeof characters]> = [
    ["principal", characters.filter((c) => c.role === "principal")],
    ["cast", characters.filter((c) => c.role === "cast")],
    ["informant", characters.filter((c) => c.role === "informant")],
  ];

  return (
    <section className="flex flex-col gap-10 px-6 py-16 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1
          style={{
            fontFamily: "var(--font-alfa-slab), serif",
            fontSize: "clamp(34px,4.6vw,60px)",
            color: meta.title,
            textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
          }}
        >
          {meta.charsTitle}
        </h1>
        <Link
          href={`/worlds/${world}/characters/intros-and-breakdowns`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 44,
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 11,
            letterSpacing: ".3em",
            color: meta.accent,
            border: `1.5px solid ${meta.border}`,
            padding: "10px 18px",
          }}
        >
          INTROS & BREAKDOWNS →
        </Link>
      </div>

      {groups.map(([role, list]) =>
        list.length > 0 ? (
          <div key={role}>
            <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, letterSpacing: ".3em", color: meta.accent, marginBottom: 16 }}>
              {ROLE_LABEL[role]}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <CharacterCard key={c.slug} world={world} character={c} />
              ))}
            </div>
          </div>
        ) : null
      )}
    </section>
  );
}
