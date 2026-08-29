'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGE_SIZES_GRID_CARD } from '@/lib/images';
import { cloudinaryVideoPoster } from '@/lib/media';
import type { Character } from '@/lib/types';

/**
 * Cast-grid card. Adds a "REVEALS" badge and a hover-preview of the
 * character's POWERS video for characters that have one — the underlying
 * image is unchanged for characters without a `reveals` entry.
 */
export default function CharacterCard({
  world,
  character,
}: {
  world: string;
  character: Character;
}) {
  const [hover, setHover] = useState(false);
  const powers = character.reveals?.powers;
  const powersReady = powers?.status === 'ready' && !!powers.video;
  const showVideo = hover && powersReady;

  return (
    <Link
      href={`/worlds/${world}/characters/${character.slug}`}
      className="world-card flex flex-col gap-2 overflow-hidden p-5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {character.imageUrl ? (
        <div className="relative h-40 w-full overflow-hidden">
          <Image src={character.imageUrl} alt={character.n} fill sizes={IMAGE_SIZES_GRID_CARD} className="object-cover" />
          {showVideo ? (
            <video
              src={powers!.video!}
              poster={cloudinaryVideoPoster(powers!.video!)}
              muted
              loop
              playsInline
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          {character.reveals ? (
            <span
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: 9,
                letterSpacing: '.22em',
                color: powersReady ? 'var(--w-accent)' : 'var(--w-sub)',
                background: 'rgba(0,0,0,.6)',
                border: '1px solid rgba(255,255,255,.25)',
                padding: '5px 10px',
                opacity: powersReady ? (hover ? 1 : 0.5) : 0.75,
                transition: 'opacity .3s ease',
                pointerEvents: 'none',
              }}
            >
              {powersReady ? 'REVEALS →' : 'COMING SOON'}
            </span>
          ) : null}
        </div>
      ) : null}
      <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: 10, letterSpacing: '.25em', color: 'var(--w-accent)' }}>
        {character.r}
      </div>
      <div style={{ fontFamily: 'var(--font-alfa-slab), serif', fontSize: 18, color: 'var(--w-ink)' }}>{character.n}</div>
    </Link>
  );
}
