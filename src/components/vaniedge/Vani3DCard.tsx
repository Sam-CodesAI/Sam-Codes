"use client";

import React, { useRef, useState } from "react";

interface Vani3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "emerald" | "cyan" | "indigo" | "amber" | "rose";
}

export default function Vani3DCard({
  children,
  className = "",
  glowColor = "emerald",
}: Vani3DCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const glowBorder = {
    emerald: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    cyan: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
    indigo: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    amber: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    rose: "hover:border-rose-500/40 hover:shadow-rose-500/10",
  }[glowColor];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl border border-slate-800/80 bg-[#0c121d] transition-all duration-200 ease-out overflow-hidden shadow-xl ${glowBorder} ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(1.01, 1.01, 1.01)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Specular 3D Glare Light Reflection */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 280px at ${transform.glareX}% ${transform.glareY}%, rgba(255, 255, 255, 0.05), transparent 70%)`,
          }}
        />
      )}

      {/* Card Content with 3D Depth */}
      <div style={{ transform: "translateZ(10px)" }}>{children}</div>
    </div>
  );
}
