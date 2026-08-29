"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Ported from the legacy index.html Component.trackPageview(): that runtime
 * faked a single-page router and pushed a synthetic pageview to `dataLayer`
 * on every view/world change so GTM's SPA triggers would fire. Real Next.js
 * routing means the browser URL already changes on navigation, but Next.js
 * client-side transitions don't trigger a full page load, so GTM still needs
 * an explicit pageview push per route change to keep pageview-based tags firing.
 */
export default function GtmPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    // The initial load is already covered by GTM's own gtm.js pageview.
    if (first.current) {
      first.current = false;
      return;
    }
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "pageview",
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
