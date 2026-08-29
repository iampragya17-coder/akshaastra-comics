import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/**
 * Link wrapper that guarantees a ~44x44px tap target (WCAG 2.5.5 / mobile
 * a11y guidance) regardless of the font size the caller passes in. Used for
 * the small all-caps breadcrumb/back links and related-item list links that
 * would otherwise render as bare underlined text a few pixels tall.
 */
export default function TapLink({
  href,
  style,
  children,
}: {
  href: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 44,
        padding: "10px 4px",
        ...style,
      }}
    >
      {children}
    </Link>
  );
}
