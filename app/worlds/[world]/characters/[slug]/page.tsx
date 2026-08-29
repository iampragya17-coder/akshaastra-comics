import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isWorldKey, getWorld, findRelatedCities, findRelatedTech } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import { JsonLd, personJsonLd } from "@/lib/jsonld";
import { heroImageSizes } from "@/lib/images";
import TapLink from "@/components/TapLink";
import RevealsPanel from "@/components/RevealsPanel";

export function generateStaticParams() {
  return WORLD_KEYS.flatMap((world) => getWorld(world).characters.map((c) => ({ world, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}): Promise<Metadata> {
  const { world, slug } = await params;
  if (!isWorldKey(world)) return {};
  const character = getWorld(world).characters.find((c) => c.slug === slug);
  if (!character) return {};
  return { title: character.n, description: character.d };
}

export default async function CharacterDetail({
  params,
}: {
  params: Promise<{ world: string; slug: string }>;
}) {
  const { world, slug } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);
  const character = getWorld(world).characters.find((c) => c.slug === slug);
  if (!character) notFound();

  // Home city inferred from a name mention in the character's own bio text
  // (the source data has no explicit character->city relation).
  const homeCities = findRelatedCities(world, character.d);
  const relatedTech = findRelatedTech(world, character.kit || "");

  return (
    <article className="flex flex-col gap-8 px-6 py-16 md:px-16">
      <JsonLd
        data={personJsonLd({
          name: character.n,
          url: `${SITE_URL}/worlds/${world}/characters/${character.slug}`,
          description: character.d,
          image: character.imageUrl || undefined,
          jobTitle: character.r || undefined,
          isPartOf: { name: "AkshaAstra Comics", url: SITE_URL },
        })}
      />
      <TapLink href={`/worlds/${world}/characters`} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 11, letterSpacing: ".3em", color: meta.accent }}>
        ← {meta.charsTitle}
      </TapLink>
      {character.imageUrl ? (
        <div className="relative h-72 w-full max-w-md overflow-hidden">
          <Image src={character.imageUrl} alt={character.n} fill sizes={heroImageSizes(480)} className="object-cover" preload />
        </div>
      ) : null}
      {character.r ? (
        <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".4em", color: meta.accent }}>
          {character.r}
        </div>
      ) : null}
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(32px,4.4vw,56px)",
          color: meta.title,
          textShadow: `3px 3px 0 #000, 0 0 30px ${meta.glow}`,
        }}
      >
        {character.n}
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.9, color: meta.sub, maxWidth: 640 }}>{character.d}</p>

      {character.reveals ? (
        <RevealsPanel
          key={character.slug}
          reveals={character.reveals}
          characterName={character.n}
          characterImageUrl={character.imageUrl}
        />
      ) : null}

      {character.kit ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".3em", color: meta.accent, marginBottom: 8 }}>
            KIT & ABILITIES
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: meta.ink, maxWidth: 640 }}>{character.kit}</p>
        </div>
      ) : null}

      {character.style ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".3em", color: meta.accent, marginBottom: 8 }}>
            STYLE
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: meta.ink, maxWidth: 640 }}>{character.style}</p>
        </div>
      ) : null}

      {character.root ? (
        <div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".3em", color: meta.accent, marginBottom: 8 }}>
            ROOT / ETYMOLOGY
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: meta.ink, maxWidth: 640 }}>{character.root}</p>
        </div>
      ) : null}

      {(homeCities.length > 0 || relatedTech.length > 0) && (
        <div className="flex flex-col gap-4">
          {homeCities.length > 0 ? (
            <div>
              <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".3em", color: meta.accent, marginBottom: 8 }}>
                ASSOCIATED WITH
              </h2>
              <ul className="flex flex-col">
                {homeCities.map((c) => (
                  <li key={c.slug}>
                    <TapLink href={`/worlds/${world}/cities/${c.slug}`} style={{ color: meta.ink, fontSize: 15 }}>
                      {c.n} →
                    </TapLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {relatedTech.length > 0 ? (
            <div>
              <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 12, letterSpacing: ".3em", color: meta.accent, marginBottom: 8 }}>
                USES
              </h2>
              <ul className="flex flex-col">
                {relatedTech.map((t) => (
                  <li key={t.slug}>
                    <TapLink href={`/worlds/${world}/tech/${t.slug}`} style={{ color: meta.ink, fontSize: 15 }}>
                      {t.n} →
                    </TapLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
