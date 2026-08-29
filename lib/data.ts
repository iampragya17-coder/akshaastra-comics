import type {
  WorldKey, WorldMeta, City, Organization, Character, TechItem,
  CurrencyItem, InfraItem, SlangItem,
} from './types';

import warmMeta from '@/data/worlds/warm/meta.json';
import warmCities from '@/data/worlds/warm/cities.json';
import warmOrgs from '@/data/worlds/warm/organizations.json';
import warmChars from '@/data/worlds/warm/characters.json';
import warmTech from '@/data/worlds/warm/tech.json';
import warmCurrency from '@/data/worlds/warm/currency.json';
import warmInfra from '@/data/worlds/warm/infrastructure.json';
import warmSlang from '@/data/worlds/warm/slang.json';

import coldMeta from '@/data/worlds/cold/meta.json';
import coldCities from '@/data/worlds/cold/cities.json';
import coldOrgs from '@/data/worlds/cold/organizations.json';
import coldChars from '@/data/worlds/cold/characters.json';
import coldTech from '@/data/worlds/cold/tech.json';
import coldCurrency from '@/data/worlds/cold/currency.json';
import coldInfra from '@/data/worlds/cold/infrastructure.json';
import coldSlang from '@/data/worlds/cold/slang.json';

import borderMeta from '@/data/worlds/border/meta.json';
import borderCities from '@/data/worlds/border/cities.json';
import borderOrgs from '@/data/worlds/border/organizations.json';
import borderChars from '@/data/worlds/border/characters.json';
import borderTech from '@/data/worlds/border/tech.json';
import borderCurrency from '@/data/worlds/border/currency.json';
import borderInfra from '@/data/worlds/border/infrastructure.json';
import borderSlang from '@/data/worlds/border/slang.json';

const WORLD_DATA: Record<WorldKey, {
  meta: WorldMeta;
  cities: City[];
  organizations: Organization[];
  characters: Character[];
  tech: TechItem[];
  currency: CurrencyItem[];
  infrastructure: InfraItem[];
  slang: SlangItem[];
}> = {
  warm: {
    meta: warmMeta as WorldMeta,
    cities: warmCities as City[],
    organizations: warmOrgs as Organization[],
    characters: warmChars as Character[],
    tech: warmTech as TechItem[],
    currency: warmCurrency as CurrencyItem[],
    infrastructure: warmInfra as InfraItem[],
    slang: warmSlang as SlangItem[],
  },
  cold: {
    meta: coldMeta as WorldMeta,
    cities: coldCities as City[],
    organizations: coldOrgs as Organization[],
    characters: coldChars as Character[],
    tech: coldTech as TechItem[],
    currency: coldCurrency as CurrencyItem[],
    infrastructure: coldInfra as InfraItem[],
    slang: coldSlang as SlangItem[],
  },
  border: {
    meta: borderMeta as WorldMeta,
    cities: borderCities as City[],
    organizations: borderOrgs as Organization[],
    characters: borderChars as Character[],
    tech: borderTech as TechItem[],
    currency: borderCurrency as CurrencyItem[],
    infrastructure: borderInfra as InfraItem[],
    slang: borderSlang as SlangItem[],
  },
};

export function isWorldKey(v: string): v is WorldKey {
  return v === 'warm' || v === 'cold' || v === 'border';
}

export function getWorld(world: WorldKey) {
  return WORLD_DATA[world];
}

export function getAllWorldKeys(): WorldKey[] {
  return ['warm', 'cold', 'border'];
}

// --- Cross-entity link helpers -------------------------------------------

/** Finds cities whose name is referenced by an organization/character's kit or description text. */
export function findRelatedCities(world: WorldKey, text: string): City[] {
  const { cities } = getWorld(world);
  const lower = text.toLowerCase();
  return cities.filter((c) => lower.includes(c.n.toLowerCase()));
}

/** Finds tech items whose name appears in a character's kit description (rough name-match). */
export function findRelatedTech(world: WorldKey, kitText: string): TechItem[] {
  const { tech } = getWorld(world);
  const lower = (kitText || '').toLowerCase();
  return tech.filter((t) => lower.includes(t.n.toLowerCase()));
}

/** Finds organizations located in / associated with a given city by name mention. */
export function findOrgsForCity(world: WorldKey, cityName: string): Organization[] {
  const { organizations } = getWorld(world);
  const lower = cityName.toLowerCase();
  return organizations.filter((o) => (o.d || '').toLowerCase().includes(lower));
}
