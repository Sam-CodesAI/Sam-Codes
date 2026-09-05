"use client";

import React, { useEffect, useRef } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  pulsePhase: number;
}

export default function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Detect mobile or reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = width < 768;
    const nodeCount = prefersReducedMotion ? 16 : isMobile ? 26 : 54;
    const maxDistance = isMobile ? 95 : 140;

    let pointer = { x: width / 2, y: height / 2, active: false };
    let scrollY = window.scrollY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initialize nodes
    const nodes: NodePoint[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.65),
        vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.65),
        baseRadius: Math.random() * 1.6 + 0.8,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Scroll narrative evolution: calculate progression ratio (0 to 1)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollRatio = Math.min(1, Math.max(0, scrollY / docHeight));

      // Atmospheric gradient background shift
      const gradient = ctx.createRadialGradient(
        width * 0.5 + Math.sin(scrollRatio * Math.PI) * 100,
        height * 0.2 + scrollRatio * 200,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      gradient.addColorStop(0, "rgba(56, 189, 248, 0.04)");
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.02)");
      gradient.addColorStop(1, "rgba(7, 10, 18, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];

        // Move nodes
        if (!prefersReducedMotion) {
          nodeA.x += nodeA.vx;
          nodeA.y += nodeA.vy;

          // Boundary bounce with soft wrapping
          if (nodeA.x < 0) nodeA.x = width;
          if (nodeA.x > width) nodeA.x = 0;
          if (nodeA.y < 0) nodeA.y = height;
          if (nodeA.y > height) nodeA.y = 0;

          // Pointer interaction: subtle magnetic pull
          if (pointer.active) {
            const dx = pointer.x - nodeA.x;
            const dy = pointer.y - nodeA.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 0) {
              nodeA.x += (dx / dist) * 0.45;
              nodeA.y += (dy / dist) * 0.45;
            }
          }
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (0.16 + scrollRatio * 0.12);
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);

            // Subtle luminous pulse along lines
            const pulse = (Math.sin(frame * 0.03 + i + j) + 1) * 0.5;
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * (0.7 + pulse * 0.3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Occasional light traveling packet
            if (i % 4 === 0 && !prefersReducedMotion) {
              const packetPos = (frame * 0.015 + (i * 0.1)) % 1;
              const px = nodeA.x + dx * packetPos;
              const py = nodeA.y + dy * packetPos;
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 1.4})`;
              ctx.fill();
            }
          }
        }

        // Draw node points
        const pulseRadius = nodeA.baseRadius + Math.sin(frame * 0.04 + nodeA.pulsePhase) * 0.4;
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, Math.max(0.6, pulseRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 231, 255, ${0.4 + Math.sin(frame * 0.03 + i) * 0.2})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 transition-opacity duration-1000"
    />
  );
}
