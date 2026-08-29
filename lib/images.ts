// Small helper mirroring the legacy index.html manifest-resolution logic.
// Data extraction (scripts/extract-data.js) already resolves each entity's
// imageUrl/imageKey once at build-data time, so most app code just reads
// `entity.imageUrl`. These helpers exist for any ad-hoc/manual lookups
// against the raw manifest (e.g. tooling, QA scripts) and to keep the
// slugify/prefix rules in one documented place.

/**
 * `sizes` for next/image `fill` cards in the `grid-cols-1 sm:grid-cols-2
 * lg:grid-cols-3` card grids (world hub tiles, characters/cities/tech/
 * infrastructure indexes). Matches the grid's actual rendered width at each
 * breakpoint so mobile doesn't fetch the same source as a 3-up desktop card.
 */
export const IMAGE_SIZES_GRID_CARD =
  "(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(50vw - 56px), calc(33vw - 64px)";

/**
 * `sizes` for the full-width hero image on detail pages (`w-full max-w-2xl`
 * / `max-w-md` inside a `px-6 md:px-16` article). Below the `md` breakpoint
 * the image is edge-to-edge (minus the 24px gutters); above it, it's capped
 * by its max-width.
 */
export function heroImageSizes(maxWidthPx: number): string {
  return `(max-width: 767px) calc(100vw - 48px), ${maxWidthPx}px`;
}

export interface ManifestEntry {
  url?: string;
  thumb?: string;
  crop?: string;
}

export interface ImageManifest {
  _p?: Record<string, string>;
  [slug: string]: ManifestEntry | Record<string, string> | undefined;
}

/** Strips leading "the", apostrophes, and hyphenates — matches index.html's slugify(). */
export function slugify(input: string): string {
  return String(input ?? '')
    .replace(/[‘’']/g, '')
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Known renamed entities whose manifest slug still uses a previous spelling. */
export const SLUG_ALIAS: Record<string, string> = {
  'tamasa-andhakara': 'tamas-andhakara',
};

/** Expands a "<prefixKey>|<rest>" manifest value against the `_p` prefix table. */
export function resolveManifestUrl(value: string, manifest: ImageManifest): string {
  const i = value.indexOf('|');
  if (i < 0) return value;
  const key = value.slice(0, i);
  const prefix = manifest._p?.[key];
  return prefix ? prefix + value.slice(i + 1) : value;
}

/**
 * Finds a manifest entry for `name` by trying each category prefix in turn
 * (e.g. ['city'], ['corp','char','tech']) against the slugified name, falling
 * back to a known alias. Returns the resolved URL (thumb preferred unless
 * `kind === 'hero'`) or empty string if nothing matches.
 */
export function imgFor(
  name: string,
  prefixes: string[],
  manifest: ImageManifest,
  kind?: 'hero'
): { imageKey: string; url: string } {
  const s = slugify(name);
  const alt = SLUG_ALIAS[s];
  for (const p of prefixes) {
    const key = `${p}-${s}`;
    const altKey = alt ? `${p}-${alt}` : undefined;
    const entry = (manifest[key] as ManifestEntry | undefined) ?? (altKey ? (manifest[altKey] as ManifestEntry | undefined) : undefined);
    if (entry && typeof entry === 'object') {
      const raw = kind === 'hero' ? entry.url || entry.thumb : entry.thumb || entry.url;
      if (raw) return { imageKey: manifest[key] ? key : altKey || '', url: resolveManifestUrl(raw, manifest) };
    }
  }
  return { imageKey: '', url: '' };
}
