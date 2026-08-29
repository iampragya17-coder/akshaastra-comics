export type WorldKey = 'warm' | 'cold' | 'border';

export const WORLD_KEYS: WorldKey[] = ['warm', 'cold', 'border'];

export interface WorldMeta {
  bg: string;
  accent: string;
  ink: string;
  sub: string;
  border: string;
  glow: string;
  cardBg: string;
  num: string;
  faint: string;
  title: string;
  kicker: string;
  name: string;
  tag: string;
  cur: string;
  crumbBase: string;
  techTitle: string;
  citiesTitle: string;
  citiesCrumb: string;
  charsTitle: string;
  cxOrgHead: string;
  worldName: string;
  displayName: string;
}

export interface City {
  n: string;
  t: string;
  type: string;
  d: string;
  slug: string;
  imageKey: string;
  imageUrl: string;
  thumbUrl: string;
}

export interface Organization {
  n: string;
  s: string;
  d: string;
  slug: string;
  imageKey: string;
  imageUrl: string;
  thumbUrl: string;
}

export type CharacterRole = 'principal' | 'cast' | 'informant';

export type RevealStatus = 'ready' | 'not-started';

export interface RevealTrack {
  video: string | null;
  status: RevealStatus;
  lore: string;
}

export interface CharacterReveals {
  powers: RevealTrack;
  ordinaryLife: RevealTrack;
}

export interface Character {
  n: string;
  r?: string;
  d: string;
  kit: string;
  style: string;
  root: string;
  slug: string;
  role: CharacterRole;
  imageKey: string;
  imageUrl: string;
  thumbUrl: string;
  reveals?: CharacterReveals;
}

export interface TechItem {
  n: string;
  d: string;
  slug: string;
  imageKey: string;
  imageUrl: string;
  thumbUrl: string;
}

export interface CurrencyItem {
  n: string;
  d: string;
  slug: string;
  imageKey: string;
  imageUrl: string;
  thumbUrl: string;
}

export type InfraKind = 'infrastructure' | 'transit';

export interface InfraItem {
  n: string;
  d: string;
  kind: InfraKind;
  slug: string;
  imageKey: string;
  imageUrl: string;
  thumbUrl: string;
}

export interface SlangItem {
  n: string;
  d: string;
  slug: string;
}
