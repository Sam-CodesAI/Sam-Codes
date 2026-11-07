"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { useLoaderStore } from "@/store/useLoaderStore";

export function MagneticParticles({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const progress = useLoaderStore((s) => s.progress);
  const phase = useLoaderStore((s) => s.phase);

  const noise3D = useMemo(() => createNoise3D(), []);

  // Initial spherical distribution
  const { originalPositions, currentPositions, colors } = useMemo(() => {
    const orig = new Float32Array(count * 3);
    const curr = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color("#4D7CFE");
    const c2 = new THREE.Color("#85A6FF");
    const c3 = new THREE.Color("#E8EAF0");

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.8 + Math.random() * 1.6;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      curr[i * 3] = x;
      curr[i * 3 + 1] = y;
      curr[i * 3 + 2] = z;

      // Color gradation
      const mixRatio = Math.random();
      const mixed = mixRatio < 0.6 ? c1.clone().lerp(c2, mixRatio / 0.6) : c2.clone().lerp(c3, (mixRatio - 0.6) / 0.4);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    return { originalPositions: orig, currentPositions: curr, colors: col };
  }, [count]);

  const isWarping = phase === "warp" || phase === "ready";

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    // Magnetic contraction factor: contracts from 1.0 down to 0.48 as progress approaches 100%
    const contraction = isWarping
      ? 1 + (time * 1.8) // Explode outward on warp
      : 1.0 - (progress / 100) * 0.48;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];
      const oz = originalPositions[idx + 2];

      // Organic noise turbulence
      const noise = noise3D(ox * 0.4 + time * 0.2, oy * 0.4 + time * 0.2, oz * 0.4 + time * 0.2) * 0.18;

      if (isWarping) {
        // Disperse radially outward
        currentPositions[idx] += ox * delta * 4;
        currentPositions[idx + 1] += oy * delta * 4;
        currentPositions[idx + 2] += oz * delta * 4;
      } else {
        currentPositions[idx] = (ox + noise) * contraction;
        currentPositions[idx + 1] = (oy + noise) * contraction;
        currentPositions[idx + 2] = (oz + noise) * contraction;
      }
    }

    positionAttr.needsUpdate = true;

    // Slow ambient rotation of the entire particle cloud
    pointsRef.current.rotation.y += delta * 0.12 * (1 + progress / 100);
    pointsRef.current.rotation.x += delta * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
