"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLoaderStore } from "@/store/useLoaderStore";

interface SegmentedRingProps {
  radius: number;
  segments: number;
  segmentSize: [number, number, number];
  rotationAxis: "x" | "y" | "z";
  rotationSpeed: number;
  initialTilt: [number, number, number];
}

function SegmentedRing({
  radius,
  segments,
  segmentSize,
  rotationAxis,
  rotationSpeed,
  initialTilt,
}: SegmentedRingProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const progress = useLoaderStore((s) => s.progress);

  // Acceleration factor based on progress
  const speedMultiplier = 1 + (progress / 100) * 2.2;

  // Generate segmented blocks along circumference
  const blocks = useMemo(() => {
    const items = [];
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const rotY = -angle;
      items.push({ x, z, rotY });
    }
    return items;
  }, [radius, segments]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (rotationAxis === "y") {
      groupRef.current.rotation.y += delta * rotationSpeed * speedMultiplier;
    } else if (rotationAxis === "x") {
      groupRef.current.rotation.x += delta * rotationSpeed * speedMultiplier;
    } else {
      groupRef.current.rotation.z += delta * rotationSpeed * speedMultiplier;
    }
  });

  return (
    <group rotation={initialTilt}>
      <group ref={groupRef}>
        {/* Continuous Inner Support Rail */}
        <mesh>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Segmented Heavy Metallic Blocks */}
        {blocks.map((b, idx) => (
          <mesh key={idx} position={[b.x, 0, b.z]} rotation={[0, b.rotY, 0]}>
            <boxGeometry args={segmentSize} />
            <meshStandardMaterial
              color="#1e2430"
              roughness={0.25}
              metalness={0.95}
              envMapIntensity={1.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function MechanicalGimbalRings() {
  return (
    <group>
      {/* 1. Main Outer Tilted Segmented Gimbal Ring (Matching Reference Image) */}
      <SegmentedRing
        radius={1.75}
        segments={32}
        segmentSize={[0.12, 0.07, 0.16]}
        rotationAxis="y"
        rotationSpeed={0.5}
        initialTilt={[Math.PI / 4, 0, Math.PI / 8]}
      />

      {/* 2. Secondary Counter-Rotating Tilted Ring */}
      <SegmentedRing
        radius={1.55}
        segments={28}
        segmentSize={[0.11, 0.06, 0.14]}
        rotationAxis="y"
        rotationSpeed={-0.45}
        initialTilt={[-Math.PI / 3.5, 0, -Math.PI / 6]}
      />

      {/* 3. Horizontal Equatorial Stabilizer Ring */}
      <SegmentedRing
        radius={1.9}
        segments={36}
        segmentSize={[0.14, 0.05, 0.18]}
        rotationAxis="y"
        rotationSpeed={0.3}
        initialTilt={[0, 0, 0]}
      />
    </group>
  );
}
