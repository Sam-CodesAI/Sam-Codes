"use client";

import React, { useEffect, useRef, useState } from "react";

interface VaniVoiceOrb3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  isCalling: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
}

export default function VaniVoiceOrb3D({
  isSpeaking,
  isListening,
  isCalling,
}: VaniVoiceOrb3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Mouse / Touch tilt parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 25;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -25;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0;
    let angleY = 0;
    const radius = 82;
    const focalLength = 280;

    // Generate 3D spherical point cloud (220 particles with Fibonacci sphere distribution)
    const numParticles = 220;
    const particles: Particle3D[] = [];
    const colors = ["#10b981", "#06b6d4", "#6366f1"];

    for (let i = 0; i < numParticles; i++) {
      const phi = Math.acos(-1 + (2 * i) / numParticles);
      const theta = Math.sqrt(numParticles * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: colors[i % colors.length],
        size: Math.random() * 1.6 + 1.0,
      });
    }

    let pulsePhase = 0;

    const render = () => {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const rotSpeed = isSpeaking ? 0.024 : isListening ? 0.018 : isCalling ? 0.01 : 0.005;
        angleX += rotSpeed;
        angleY += rotSpeed * 1.35;
        pulsePhase += isSpeaking ? 0.12 : isListening ? 0.08 : 0.03;

        const amp = isSpeaking
          ? Math.sin(pulsePhase) * 16
          : isListening
          ? Math.sin(pulsePhase) * 10
          : 2;

        // Draw ambient radial glow
        const glowGrad = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, 110);
        const glowColor = isSpeaking
          ? "rgba(16, 185, 129, 0.22)"
          : isListening
          ? "rgba(6, 182, 212, 0.20)"
          : isCalling
          ? "rgba(99, 102, 241, 0.15)"
          : "rgba(51, 65, 85, 0.12)";

        glowGrad.addColorStop(0, glowColor);
        glowGrad.addColorStop(1, "rgba(7, 11, 18, 0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Rotate and project particles in 3D
        const projected: Array<{
          px: number;
          py: number;
          scale: number;
          color: string;
          size: number;
          z: number;
        }> = [];

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const currentRadius = radius + amp + Math.sin(pulsePhase + p.baseX * 0.05) * 5;
          const norm = Math.sqrt(p.baseX * p.baseX + p.baseY * p.baseY + p.baseZ * p.baseZ) || 1;
          const targetX = (p.baseX / norm) * currentRadius;
          const targetY = (p.baseY / norm) * currentRadius;
          const targetZ = (p.baseZ / norm) * currentRadius;

          // 3D Rotation Matrix around Y axis
          const cosY = Math.cos(angleY);
          const sinY = Math.sin(angleY);
          const x1 = targetX * cosY - targetZ * sinY;
          const z1 = targetZ * cosY + targetX * sinY;

          // 3D Rotation Matrix around X axis
          const cosX = Math.cos(angleX);
          const sinX = Math.sin(angleX);
          const y2 = targetY * cosX - z1 * sinX;
          const z2 = z1 * cosX + targetY * sinX;

          // Perspective projection
          const scale = focalLength / (focalLength + z2);
          const px = centerX + x1 * scale;
          const py = centerY + y2 * scale;

          projected.push({
            px,
            py,
            scale,
            color: isSpeaking ? "#34d399" : isListening ? "#38bdf8" : p.color,
            size: p.size * scale * (isSpeaking ? 1.3 : 1.0),
            z: z2,
          });
        }

        // Sort by Z for depth rendering
        projected.sort((a, b) => a.z - b.z);

        // Render connective dynamic wireframe lines between nearest neighbors
        ctx.lineWidth = 0.6;
        for (let i = 0; i < projected.length; i += 4) {
          const p1 = projected[i];
          for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
            const p2 = projected[j];
            const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
            if (dist < 36) {
              const alpha = Math.max(0.05, Math.min(0.35, (1 - dist / 36) * 0.35));
              ctx.strokeStyle = isSpeaking
                ? `rgba(16, 185, 129, ${alpha})`
                : isListening
                ? `rgba(6, 182, 212, ${alpha})`
                : `rgba(148, 163, 184, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }

        // Render 3D particles
        for (const p of projected) {
          const alpha = Math.max(0.25, Math.min(1.0, (p.scale - 0.4) * 1.3));
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(p.px, p.py, Math.max(0.8, p.size), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Draw counter-rotating equatorial 3D gyroscope rings
        ctx.lineWidth = 1.5;
        const ringRadius = radius * 1.1 + amp * 0.6;
        ctx.strokeStyle = isSpeaking
          ? "rgba(16, 185, 129, 0.4)"
          : isListening
          ? "rgba(6, 182, 212, 0.35)"
          : "rgba(99, 102, 241, 0.22)";

        // Ring 1 (Equatorial)
        ctx.beginPath();
        for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
          const rx = ringRadius * Math.cos(theta);
          const ry = 0;
          const rz = ringRadius * Math.sin(theta);

          const cosY = Math.cos(-angleY * 1.5);
          const sinY = Math.sin(-angleY * 1.5);
          const rx1 = rx * cosY - rz * sinY;
          const rz1 = rz * cosY + rx * sinY;

          const cosX = Math.cos(angleX * 0.8);
          const sinX = Math.sin(angleX * 0.8);
          const ry2 = ry * cosX - rz1 * sinX;
          const rz2 = rz1 * cosX + ry * sinX;

          const scale = focalLength / (focalLength + rz2);
          const px = centerX + rx1 * scale;
          const py = centerY + ry2 * scale;

          if (theta === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      } catch {
        // Safe canvas fallback
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isSpeaking, isListening, isCalling]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center p-1 select-none"
      style={{
        perspective: "1000px",
      }}
    >
      {/* 3D Container with Mouse Parallax Tilt */}
      <div
        className="relative flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic Ambient Glow Layers */}
        <div
          className={`absolute w-44 h-44 rounded-full blur-2xl -z-10 transition-all duration-500 ${
            isSpeaking
              ? "bg-emerald-500/25 scale-110"
              : isListening
              ? "bg-cyan-500/20 scale-105"
              : "bg-indigo-500/15 scale-95"
          }`}
        />

        {/* 3D Canvas Sphere */}
        <canvas
          ref={canvasRef}
          width={240}
          height={240}
          className="w-44 h-44 sm:w-48 sm:h-48 cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  );
}
