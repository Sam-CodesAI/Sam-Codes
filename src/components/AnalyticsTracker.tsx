"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics-client";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public visitor sessions, skip admin routes
    if (pathname && !pathname.startsWith("/admin")) {
      trackEvent("page_view");
    }
  }, [pathname]);

  return null;
}
