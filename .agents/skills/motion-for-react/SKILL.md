---
name: motion-for-react
description: >-
  Advanced declarative UI animation and physics engineering with Motion (formerly Framer Motion)
  using modern motion/react v13+ in Next.js 16 and React 19. Enforces hardware-accelerated transforms,
  layoutId shared element transitions, spring physics, AnimatePresence lifecycle safety, and
  clean Leaf Client Component boundaries.
---

# Motion For React (motion/react v13+) Creative Engineering Playbook

This skill defines production standards for implementing physics-driven interactive UI animations using the official `motion` library in Next.js 16 and React 19.

---

## 1. Import Standard & Leaf Component Architecture

In modern versions of Motion, always import from `"motion/react"` rather than legacy `"framer-motion"`. Keep motion components at leaf nodes to protect Server Component render trees:

```tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function CyberModal({ isOpen, onClose, title }: ModalProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          {/* Backdrop Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Card with Physics Spring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="relative z-10 w-full max-w-lg p-6 rounded-2xl bg-[#1A1D24] border border-white/10 shadow-2xl text-[#E8EAF0]"
          >
            <h2 className="text-xl font-bold">{title}</h2>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

## 2. Shared Element Morphs (`layoutId`)

When expanding a card into a full modal or switching active tabs:

```tsx
"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

const TABS = ["Architecture", "Telemetry", "Security"];

export function TabSwitcher() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="flex gap-2 p-1.5 rounded-full bg-[#1A1D24] border border-white/10 w-fit">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-2 text-xs font-mono font-medium rounded-full transition-colors z-10"
            style={{ color: isActive ? "#E8EAF0" : "#9299A8" }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className="absolute inset-0 bg-[#4D7CFE] rounded-full -z-10 shadow-lg shadow-[#4D7CFE]/30"
              />
            )}
            {tab}
          </button>
        );
      })}
    </div>
  );
}
```

---

## 3. Scroll-Linked Progress & Parallax Transforms

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export function ScrollParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth raw scroll updates through a spring damper
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const yOffset = useTransform(smoothProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative py-32 overflow-hidden">
      <motion.div style={{ y: yOffset, opacity }} className="text-center">
        <h2 className="text-4xl font-black">Dynamic Depth Layer</h2>
      </motion.div>
    </div>
  );
}
```

---

## 4. Anti-Rationalization Table

| Rationalization / Shortcut | Operational Reality & Enforcement |
| :--- | :--- |
| "I'll import from `framer-motion`." | Legacy imports inflate bundle size and risk deprecation warnings. Always import from `"motion/react"`. |
| "I'll animate `height: auto` without `layout`." | Animating auto height forces expensive layout recalculations. Use `layout` or `motion.div` with CSS grid transition. |
| "I'll put `'use client'` on the entire page to use `motion.div`." | This strips away all Next.js React Server Component benefits. Extract animated widgets to leaf client components. |
| "I'll leave `AnimatePresence` without keys on dynamic children." | Motion cannot track items entering or exiting without unique `key` props, causing exit animations to be skipped entirely. |
