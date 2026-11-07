"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useLoaderStore } from "@/store/useLoaderStore";

export function QuantumNucleus() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerLatticeRef = useRef<THREE.Mesh>(null!);
  const progress = useLoaderStore((s) => s.progress);
  const phase = useLoaderStore((s) => s.phase);

  // Speed factor accelerates dynamically as progress reaches 100%
  const speed = 1 + (progress / 100) * 2.2;
  const isWarping = phase === "warp" || phase === "ready";

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Quantum core rotation & pulsation
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5 * speed;
      coreRef.current.rotation.x += delta * 0.3 * speed;

      if (isWarping) {
        // Core expands during aperture burst
        coreRef.current.scale.lerp(new THREE.Vector3(2.2, 2.2, 2.2), 0.1);
      } else {
        const pulse = 1 + Math.sin(elapsed * 3) * 0.05 * (1 + progress / 100);
        coreRef.current.scale.setScalar(pulse);
      }
    }

    // 2. Geodesic outer crystalline lattice
    if (outerLatticeRef.current) {
      outerLatticeRef.current.rotation.y -= delta * 0.25 * speed;
      outerLatticeRef.current.rotation.z += delta * 0.18 * speed;

      if (isWarping) {
        outerLatticeRef.current.scale.lerp(new THREE.Vector3(3.5, 3.5, 3.5), 0.08);
      } else {
        const latticePulse = 1 + Math.sin(elapsed * 2 + 1) * 0.04;
        outerLatticeRef.current.scale.setScalar(latticePulse);
      }
    }
  });

  return (
    <group>
      {/* Dynamic Fluid Distorted Energy Core */}
      <Float speed={2.8} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[1.05, 64, 64]} />
          <MeshDistortMaterial
            color="#4D7CFE"
            emissive="#1A3B8B"
            emissiveIntensity={0.4 + (progress / 100) * 0.8}
            roughness={0.12}
            metalness={0.85}
            distort={0.28 + (progress / 100) * 0.32}
            speed={2.2 * speed}
          />
        </mesh>
      </Float>

      {/* Geodesic Crystalline Wireframe Enclosure */}
      <mesh ref={outerLatticeRef}>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshStandardMaterial
          color="#85A6FF"
          wireframe
          transparent
          opacity={0.3 + (progress / 100) * 0.45}
          emissive="#4D7CFE"
          emissiveIntensity={0.2 + (progress / 100) * 0.5}
        />
      </mesh>
    </group>
  );
}
