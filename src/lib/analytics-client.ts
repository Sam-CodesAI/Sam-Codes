"use client";

// Session token generated once per browser tab/session
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("sam_codes_sid");
  if (!sid) {
    sid = "s-" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    sessionStorage.setItem("sam_codes_sid", sid);
  }
  return sid;
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const utms: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((param) => {
    const val = url.searchParams.get(param);
    if (val) utms[param] = val;
  });
  return utms;
}

export function trackEvent(eventName: string, section?: string, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const utms = getUtmParams();
  const payload = {
    eventName,
    path: window.location.pathname,
    section,
    metadata,
    sessionId: getSessionId(),
    referrer: document.referrer || undefined,
    utmSource: utms.utm_source,
    utmMedium: utms.utm_medium,
    utmCampaign: utms.utm_campaign,
    deviceType: getDeviceType(),
  };

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/event", JSON.stringify(payload));
    } else {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently in browser
  }
}
