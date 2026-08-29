"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Ported from the legacy index.html Component.goBack(): at the world hub
 * itself the header offers "CHOOSE A WORLD" (back to the threshold); on
 * every nested list/detail page it instead goes up exactly one URL segment
 * ("BACK" — section -> world home, detail -> its list).
 */
export default function BackNav({
  world,
  ink,
  border,
  cardBg,
}: {
  world: string;
  ink: string;
  border: string;
  cardBg: string;
}) {
  const pathname = usePathname();
  const segments = (pathname || "").split("/").filter(Boolean);
  // segments look like: ["worlds", "warm", ...rest]
  const atHub = segments.length <= 2;

  const href = atHub ? "/" : "/" + segments.slice(0, -1).join("/");
  const label = atHub ? "CHOOSE A WORLD" : "BACK";

  return (
    <Link
      href={href}
      style={{
        fontFamily: "var(--font-cinzel), serif",
        fontSize: 11,
        letterSpacing: ".28em",
        color: ink,
        border: `1.5px solid ${border}`,
        background: cardBg,
        padding: "9px 16px",
      }}
    >
      ← {label}
    </Link>
  );
}
