export function creativeWorkJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  genre?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.genre ? { genre: opts.genre } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "AkshaAstra",
    },
  };
}

export function articleJsonLd(opts: {
  headline: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  author?: { name: string; url?: string; jobTitle?: string; sameAs?: string[] };
  publisher?: { name: string; logoUrl?: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description || "",
    url: opts.url,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.author
      ? {
          author: {
            "@type": "Person",
            name: opts.author.name,
            ...(opts.author.url ? { url: opts.author.url } : {}),
            ...(opts.author.jobTitle ? { jobTitle: opts.author.jobTitle } : {}),
            ...(opts.author.sameAs ? { sameAs: opts.author.sameAs } : {}),
          },
        }
      : {}),
    ...(opts.publisher
      ? {
          publisher: {
            "@type": "Organization",
            name: opts.publisher.name,
            ...(opts.publisher.logoUrl
              ? { logo: { "@type": "ImageObject", url: opts.publisher.logoUrl } }
              : {}),
          },
        }
      : {}),
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "AkshaAstra",
    },
  };
}

export function organizationJsonLd(opts: {
  name: string;
  alternateName?: string;
  url: string;
  logo?: string;
  description?: string;
  founder?: { name: string; jobTitle?: string; url?: string; sameAs?: string[] };
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: opts.name,
    ...(opts.alternateName ? { alternateName: opts.alternateName } : {}),
    url: opts.url,
    ...(opts.logo ? { logo: opts.logo } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.founder
      ? {
          founder: {
            "@type": "Person",
            name: opts.founder.name,
            ...(opts.founder.jobTitle ? { jobTitle: opts.founder.jobTitle } : {}),
            ...(opts.founder.url ? { url: opts.founder.url } : {}),
            ...(opts.founder.sameAs ? { sameAs: opts.founder.sameAs } : {}),
          },
        }
      : {}),
    ...(opts.sameAs ? { sameAs: opts.sameAs } : {}),
  };
}

export function websiteJsonLd(opts: { name: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: opts.name,
    url: opts.url,
  };
}

export function personJsonLd(opts: {
  name: string;
  url: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  sameAs?: string[];
  worksFor?: { name: string };
  alumniOf?: { name: string }[];
  isPartOf?: { name: string; url: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    url: opts.url,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.jobTitle ? { jobTitle: opts.jobTitle } : {}),
    ...(opts.sameAs ? { sameAs: opts.sameAs } : {}),
    ...(opts.worksFor ? { worksFor: { "@type": "Organization", name: opts.worksFor.name } } : {}),
    ...(opts.alumniOf
      ? { alumniOf: opts.alumniOf.map((a) => ({ "@type": "CollegeOrUniversity", name: a.name })) }
      : {}),
    ...(opts.isPartOf
      ? { isPartOf: { "@type": "CreativeWorkSeries", name: opts.isPartOf.name, url: opts.isPartOf.url } }
      : {}),
  };
}

export function placeJsonLd(opts: {
  name: string;
  url: string;
  description?: string;
  image?: string;
  isPartOf?: { name: string; url: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: opts.name,
    url: opts.url,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.isPartOf
      ? { isPartOf: { "@type": "CreativeWorkSeries", name: opts.isPartOf.name, url: opts.isPartOf.url } }
      : {}),
  };
}

export function creativeWorkSeriesJsonLd(opts: {
  name: string;
  url: string;
  description: string;
  genre?: string[];
  inLanguage?: string;
  isPartOf?: { name: string; url: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    name: opts.name,
    url: opts.url,
    description: opts.description,
    ...(opts.genre ? { genre: opts.genre } : {}),
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
    ...(opts.isPartOf
      ? { isPartOf: { "@type": "CreativeWorkSeries", name: opts.isPartOf.name, url: opts.isPartOf.url } }
      : {}),
  };
}

export function collectionPageJsonLd(opts: { name: string; url: string; description?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    url: opts.url,
    ...(opts.description ? { description: opts.description } : {}),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
