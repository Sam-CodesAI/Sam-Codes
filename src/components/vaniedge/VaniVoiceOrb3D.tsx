"use client";

import React, { useEffect, useRef, useState } from "react";
import { VANI_THEMES, VaniTheme } from "@/lib/vaniedge/theme-config";

interface VaniVoiceOrb3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  isCalling: boolean;
  stateText: string;
  theme?: VaniTheme;
  audioSpectrum?: Uint8Array | null;
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
  speed: number;
}

export default function VaniVoiceOrb3D({
  isSpeaking,
  isListening,
  isCalling,
  stateText,
  theme = "emerald",
  audioSpectrum,
}: VaniVoiceOrb3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const activeThemeConfig = VANI_THEMES[theme] || VANI_THEMES.emerald;

  // Mouse / Touch tilt parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 28;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -28;
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
    const radius = 105;
    const focalLength = 320;

    // Generate 3D spherical point cloud (240 particles with Fibonacci sphere distribution)
    const numParticles = 240;
    const particles: Particle3D[] = [];
    const colors = activeThemeConfig.particleColors;

    for (let i = 0; i < numParticles; i++) {
      const phi = Math.acos(-1 + (2 * i) / numParticles);
      const theta = Math.sqrt(numParticles * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const color = colors[i % colors.length];

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color,
        size: Math.random() * 2 + 1.2,
        speed: Math.random() * 0.015 + 0.005,
      });
    }

    let pulsePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Real audio amplitude computation if spectrum is provided
      let audioAmp = 0;
      if (audioSpectrum && audioSpectrum.length > 0) {
        let sum = 0;
        const len = Math.min(audioSpectrum.length, 64);
        for (let i = 0; i < len; i++) {
          sum += audioSpectrum[i];
        }
        audioAmp = (sum / len / 255) * 45; // scale to 0-45px expansion
      }

      // Rotation speed based on voice activity
      const baseRot = isSpeaking ? 0.024 : isListening ? 0.018 : isCalling ? 0.01 : 0.005;
      const rotSpeed = audioAmp > 0 ? baseRot + (audioAmp / 45) * 0.02 : baseRot;
      angleX += rotSpeed;
      angleY += rotSpeed * 1.35;
      pulsePhase += isSpeaking ? 0.12 : isListening ? 0.08 : 0.03;

      // Dynamic amplitude: use real audio FFT if present, else smooth mathematical harmonic
      const syntheticAmp = isSpeaking
        ? Math.sin(pulsePhase) * 22
        : isListening
        ? Math.sin(pulsePhase) * 12
        : 2;
      const effectiveAmp = audioAmp > 0 ? audioAmp : syntheticAmp;

      // Draw subtle background radial glow with theme reactive tint
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 140);
      const glowColor =
        isSpeaking
          ? activeThemeConfig.primaryHex
          : isListening
          ? activeThemeConfig.secondaryHex
          : isCalling
          ? activeThemeConfig.particleColors[2]
          : "rgba(100, 116, 139, 0.15)";

      glowGrad.addColorStop(0, glowColor + "33"); // ~20% alpha
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
        // Dynamic frequency modulation per particle
        const freqMod =
          audioSpectrum && audioSpectrum.length > 0
            ? (audioSpectrum[i % audioSpectrum.length] / 255) * 16
            : 0;

        const currentRadius = radius + effectiveAmp + freqMod + Math.sin(pulsePhase + p.baseX * 0.05) * 5;
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
          color: isSpeaking
            ? activeThemeConfig.primaryHex
            : isListening
            ? activeThemeConfig.secondaryHex
            : p.color,
          size: p.size * scale * (isSpeaking ? 1.4 : 1.0),
          z: z2,
        });
      }

      // Sort by Z for depth rendering
      projected.sort((a, b) => a.z - b.z);

      // Render connective dynamic wireframe lines between nearest neighbors
      ctx.lineWidth = 0.65;
      for (let i = 0; i < projected.length; i += 4) {
        const p1 = projected[i];
        for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < 44) {
            const alpha = (1 - dist / 44) * 0.38 * Math.max(0.1, p1.scale);
            ctx.strokeStyle =
              isSpeaking || isListening
                ? `${activeThemeConfig.primaryHex}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`
                : `rgba(148, 163, 184, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Render 3D particles with specular depth highlights
      for (const p of projected) {
        const alpha = Math.max(0.25, (p.scale - 0.4) * 1.35);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw counter-rotating equatorial 3D gyroscope rings
      ctx.lineWidth = 1.6;
      const ringRadius = radius * 1.1 + effectiveAmp * 0.6;
      ctx.strokeStyle = isSpeaking || isListening
        ? `${activeThemeConfig.primaryHex}77`
        : `${activeThemeConfig.secondaryHex}44`;

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

      // Ring 2 (Polar Orbit)
      ctx.beginPath();
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
        const rx = 0;
        const ry = ringRadius * 1.04 * Math.cos(theta);
        const rz = ringRadius * 1.04 * Math.sin(theta);

        const cosY = Math.cos(angleY * 1.2);
        const sinY = Math.sin(angleY * 1.2);
        const rx1 = rx * cosY - rz * sinY;
        const rz1 = rz * cosY + rx * sinY;

        const cosX = Math.cos(-angleX * 1.1);
        const sinX = Math.sin(-angleX * 1.1);
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

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isSpeaking, isListening, isCalling, activeThemeConfig, audioSpectrum]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center p-6 select-none"
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
          className={`absolute w-64 h-64 rounded-full blur-3xl -z-10 transition-all duration-500 ${
            isSpeaking
              ? "scale-110 opacity-70"
              : isListening
              ? "scale-105 opacity-60"
              : "scale-95 opacity-30"
          }`}
          style={{
            backgroundColor: isSpeaking
              ? activeThemeConfig.primaryHex
              : isListening
              ? activeThemeConfig.secondaryHex
              : activeThemeConfig.particleColors[1],
          }}
        />

        {/* 3D Canvas Sphere */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="w-64 h-64 sm:w-72 sm:h-72 cursor-grab active:cursor-grabbing"
        />

        {/* Center Floating Core Badge */}
        <div
          className="absolute pointer-events-none px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-2xl transition-transform duration-300"
          style={{ transform: "translateZ(32px)" }}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isSpeaking
                ? "animate-ping"
                : isListening
                ? "animate-pulse"
                : ""
            }`}
            style={{
              backgroundColor: isSpeaking
                ? activeThemeConfig.primaryHex
                : isListening
                ? activeThemeConfig.secondaryHex
                : isCalling
                ? activeThemeConfig.particleColors[2]
                : "#64748b",
            }}
          />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-200 font-semibold">
            {stateText}
          </span>
        </div>
      </div>
    </div>
  );
}
