'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cloudinaryVideoPoster } from '@/lib/media';
import type { CharacterReveals } from '@/lib/types';

/**
 * Two-track (POWERS / ORDINARY LIFE) video spotlight for a character's
 * detail page. A track without a video yet stays visible but disabled,
 * showing the character's portrait as a frozen frame behind a "coming soon"
 * note rather than hiding the tab or leaving a blank box.
 */
export default function RevealsPanel({
  reveals,
  characterName,
  characterImageUrl,
}: {
  reveals: CharacterReveals;
  characterName: string;
  characterImageUrl: string;
}) {
  const [tab, setTab] = useState<'powers' | 'ordinaryLife'>('powers');
  const track = reveals[tab];
  const ready = track.status === 'ready' && !!track.video;
  const humanReady = reveals.ordinaryLife.status === 'ready' && !!reveals.ordinaryLife.video;

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 640 }}>
      <div className="flex gap-5" style={{ borderBottom: '1.5px solid var(--w-border)' }}>
        <button
          type="button"
          onClick={() => setTab('powers')}
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: 11,
            letterSpacing: '.28em',
            padding: '10px 2px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            color: 'var(--w-ink)',
            borderBottom: `2px solid ${tab === 'powers' ? 'var(--w-accent)' : 'var(--w-border)'}`,
            marginBottom: -1.5,
          }}
        >
          POWERS
        </button>
        <button
          type="button"
          onClick={() => humanReady && setTab('ordinaryLife')}
          disabled={!humanReady}
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: 11,
            letterSpacing: '.28em',
            padding: '10px 2px',
            cursor: humanReady ? 'pointer' : 'default',
            background: 'none',
            border: 'none',
            whiteSpace: 'nowrap',
            color: humanReady ? 'var(--w-ink)' : 'var(--w-sub)',
            borderBottom: `2px solid ${tab === 'ordinaryLife' ? 'var(--w-accent)' : 'var(--w-border)'}`,
            marginBottom: -1.5,
          }}
        >
          ORDINARY&nbsp;LIFE
          {!humanReady ? (
            <span style={{ fontSize: 8, letterSpacing: '.15em', color: 'var(--w-sub)', marginLeft: 8 }}>
              · COMING SOON
            </span>
          ) : null}
        </button>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          border: '2px solid var(--w-border)',
          overflow: 'hidden',
        }}
      >
        {ready ? (
          <video
            key={track.video}
            src={track.video!}
            poster={cloudinaryVideoPoster(track.video!)}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <Image
              src={characterImageUrl}
              alt={characterName}
              fill
              className="object-cover"
              style={{ filter: 'grayscale(.3) brightness(.55)' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8vw',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: 13,
                  letterSpacing: '.1em',
                  lineHeight: 1.8,
                  color: 'var(--w-ink)',
                  textAlign: 'center',
                  textShadow: '2px 2px 0 #000',
                  maxWidth: 520,
                }}
              >
                {characterName}&rsquo;s {tab === 'powers' ? 'powers' : 'ordinary-life'} reveal is still in production —
                check back soon.
              </div>
            </div>
          </>
        )}
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--w-sub)' }}>{track.lore}</p>
    </div>
  );
}
