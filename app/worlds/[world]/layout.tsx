import { notFound } from "next/navigation";
import Link from "next/link";
import { isWorldKey, getWorld } from "@/lib/data";
import { WORLD_KEYS } from "@/lib/types";
import BackNav from "./BackNav";

export function generateStaticParams() {
  return WORLD_KEYS.map((world) => ({ world }));
}

export default async function WorldLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ world: string }>;
}) {
  const { world } = await params;
  if (!isWorldKey(world)) notFound();
  const { meta } = getWorld(world);

  return (
    <div data-world={world} className="world-shell">
      <header
        className="flex items-center justify-between gap-4 px-6 py-5"
        style={{ borderBottom: `1.5px solid ${meta.border}` }}
      >
        <div className="flex items-center gap-3">
          <BackNav world={world} ink={meta.ink} border={meta.border} cardBg={meta.cardBg} />
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 44,
              fontFamily: "var(--font-alfa-slab), serif",
              fontSize: 18,
              color: meta.ink,
              textShadow: "2px 2px 0 #000",
            }}
          >
            AKSHA ASTRA
          </Link>
        </div>
        <div
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 10,
            letterSpacing: ".35em",
            color: meta.faint,
          }}
        >
          {meta.crumbBase}
        </div>
      </header>
      {children}
    </div>
  );
}
