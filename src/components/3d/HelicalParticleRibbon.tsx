"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLoaderStore } from "@/store/useLoaderStore";

export function HelicalParticleRibbon({ count = 1600 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const progress = useLoaderStore((s) => s.progress);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const cCyan = new THREE.Color("#00e5ff");
    const cBlue = new THREE.Color("#4D7CFE");
    const cWhite = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      // Create an inclined elliptical ribbon / spiral band
      const angle = (i / count) * Math.PI * 4;
      const radius = 2.1 + (i / count) * 0.9 + (Math.random() - 0.5) * 0.35;
      const height = (Math.random() - 0.5) * 0.45 + Math.sin(angle) * 0.35;

      // Inclined elliptical plane
      pos[i * 3] = radius * Math.cos(angle);
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = radius * Math.sin(angle);

      // Color variation
      const mixRatio = Math.random();
      const mixed =
        mixRatio < 0.65
          ? cCyan.clone().lerp(cBlue, mixRatio / 0.65)
          : cCyan.clone().lerp(cWhite, (mixRatio - 0.65) / 0.35);

      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;

      sz[i] = Math.random() * 0.04 + 0.02;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const speed = 0.15 * (1 + (progress / 100) * 1.5);
    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x = Math.PI / 6; // Incline angle matching reference image
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
