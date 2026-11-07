"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLoaderStore } from "@/store/useLoaderStore";

function StabilizerDisc({ position, isTop }: { position: [number, number, number]; isTop: boolean }) {
  const laserRingRef = useRef<THREE.Mesh>(null!);
  const progress = useLoaderStore((s) => s.progress);

  useFrame((state) => {
    if (laserRingRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(elapsed * 5) * 0.12 * (1 + progress / 100);
      laserRingRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position} rotation={[isTop ? Math.PI : 0, 0, 0]}>
      {/* Heavy Industrial Metallic Outer Casing */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.4, 48]} />
        <meshStandardMaterial
          color="#161b24"
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Stepped Metallic Collar Disc */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.35, 1.5, 0.15, 48]} />
        <meshStandardMaterial
          color="#222a38"
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>

      {/* Glowing Cyan/Blue Concentric Magnetic Laser Emitter Rings */}
      <mesh ref={laserRingRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.15, 64]} />
        <meshBasicMaterial
          color="#00e5ff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.75, 48]} />
        <meshBasicMaterial
          color="#4D7CFE"
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Stabilizer Laser Spot Light */}
      <spotLight
        position={[0, 0, 0]}
        target-position={[0, isTop ? -2.4 : 2.4, 0]}
        color="#00e5ff"
        intensity={3.5}
        angle={0.6}
        penumbra={0.5}
      />
    </group>
  );
}

export function MagneticStabilizerCollars() {
  return (
    <group>
      {/* Top Ceiling Magnetic Containment Stabilizer */}
      <StabilizerDisc position={[0, 2.35, 0]} isTop={true} />

      {/* Bottom Floor Magnetic Containment Stabilizer */}
      <StabilizerDisc position={[0, -2.35, 0]} isTop={false} />
    </group>
  );
}
