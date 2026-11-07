---
name: gsap-animation
description: >-
  Advanced GreenSock Animation Platform (GSAP 3) and @gsap/react engineering standard.
  Enforces declarative useGSAP scoping, ScrollTrigger pinning & scrub workflows, Flip layout
  animations, Lenis momentum scroll synchronization, and memory-safe React 19 lifecycles.
  Activate when implementing high-fidelity web animations, scroll-driven narratives,
  timeline choreography, or kinetic typography.
---

# GSAP 3 & @gsap/react Creative Engineering Playbook

This skill defines strict production standards for implementing performance-critical web animations using GSAP 3 in React 19 and Next.js 16.

---

## 1. Core Lifecycle & The `useGSAP` Invariant

In Next.js 16 and React 19, **never** use standard `useEffect` for GSAP tweens without manual `context` revert. Always use `@gsap/react`:

```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once outside render loop or in safe browser boundary
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function KineticHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // All selectors are automatically scoped to containerRef
      gsap.from(".hero-headline span", {
        y: 80,
        opacity: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
      });

      gsap.to(".hero-glow", {
        scale: 1.25,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef } // Mandatory: Guarantees 100% garbage collection on unmount
  );

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div className="hero-glow absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <h1 className="hero-headline text-5xl font-bold">
        <span>Architectural</span> <span>Precision</span>
      </h1>
    </div>
  );
}
```

---

## 2. ScrollTrigger & Scrub Master Patterns

### Scrub & Pinning Standard
When pinning elements or scrubbing timelines:
1. Set `pin: true` with explicit `pinSpacing: true` (or `false` for layered sticky panels).
2. Use relative viewport triggers (`"top top"`, `"top 80%"`, `"bottom top"`).
3. Always kill or refresh ScrollTriggers when asynchronous content loads.

```tsx
useGSAP(
  () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pinned-stage",
        start: "top top",
        end: "+=200%", // 2x viewport height scroll length
        scrub: 1,      // 1-second smooth catch-up smoothing
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to(".stage-card-1", { scale: 0.85, opacity: 0, filter: "blur(10px)" })
      .from(".stage-card-2", { y: 150, opacity: 0, scale: 0.95 }, "<0.2")
      .to(".stage-card-2", { scale: 0.85, opacity: 0, filter: "blur(10px)" }, "+=0.5")
      .from(".stage-card-3", { y: 150, opacity: 0, scale: 0.95 }, "<0.2");
  },
  { scope: containerRef }
);
```

---

## 3. Lenis Smooth Scrolling & GSAP Ticker Synchronization

For smooth momentum scrolling without jitter, bind Lenis directly to the `gsap.ticker`:

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Sync Lenis scroll updates with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis directly via GSAP's optimized requestAnimationFrame ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0); // Eliminate lag jumps during tab-switches

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);
}
```

---

## 4. Flip Plugin for Layout & State Swaps

For animating layout changes (e.g. grid to list, expanding detail panels):

```tsx
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

function toggleLayout() {
  const state = Flip.getState(".gallery-card");
  
  // Mutate React state or CSS class
  setGridView((prev) => !prev);

  // In Next render frame:
  requestAnimationFrame(() => {
    Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      stagger: 0.04,
      absolute: true,
    });
  });
}
```

---

## 5. Anti-Rationalization Table

| Rationalization / Shortcut | Operational Reality & Enforcement |
| :--- | :--- |
| "I'll use `useEffect` and let GSAP manage elements globally." | Global queries leak DOM listeners and create phantom ghost tweens on route change. Always use `useGSAP` with `{ scope: ref }`. |
| "I will animate CSS properties like `left`, `top`, `width`." | Mutating layout triggers continuous browser recalculations and dropped frames. Always animate hardware-accelerated transforms (`x`, `y`, `scale`, `rotation`, `opacity`). |
| "ScrollTrigger doesn't line up on mobile; I'll hardcode offsets." | Viewport height changes when mobile URL bars collapse. Call `ScrollTrigger.refresh()` or use `ignoreMobileResize: true`. |
| "I'll mix CSS transitions and GSAP on the same element." | CSS transitions fight GSAP property updates every frame, causing stutter. Never apply `transition: all` to elements driven by GSAP. |
