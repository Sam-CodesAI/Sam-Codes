"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLoaderStore } from "@/store/useLoaderStore";

export function GyroGimbalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const progress = useLoaderStore((s) => s.progress);
  const phase = useLoaderStore((s) => s.phase);

  const speed = 1 + (progress / 100) * 2.8;
  const isWarping = phase === "warp" || phase === "ready";

  useFrame((state, delta) => {
    if (ring1Ref.current) {
      if (isWarping) {
        // Snap to flat camera alignment and expand into aperture iris
        ring1Ref.current.rotation.x = THREE.MathUtils.lerp(ring1Ref.current.rotation.x, 0, 0.15);
        ring1Ref.current.rotation.y = THREE.MathUtils.lerp(ring1Ref.current.rotation.y, 0, 0.15);
        ring1Ref.current.scale.lerp(new THREE.Vector3(4, 4, 4), 0.1);
      } else {
        ring1Ref.current.rotation.x += delta * 0.65 * speed;
        ring1Ref.current.rotation.y += delta * 0.45 * speed;
      }
    }

    if (ring2Ref.current) {
      if (isWarping) {
        ring2Ref.current.rotation.x = THREE.MathUtils.lerp(ring2Ref.current.rotation.x, 0, 0.15);
        ring2Ref.current.rotation.y = THREE.MathUtils.lerp(ring2Ref.current.rotation.y, 0, 0.15);
        ring2Ref.current.rotation.z = THREE.MathUtils.lerp(ring2Ref.current.rotation.z, 0, 0.15);
        ring2Ref.current.scale.lerp(new THREE.Vector3(3.2, 3.2, 3.2), 0.1);
      } else {
        ring2Ref.current.rotation.y -= delta * 0.55 * speed;
        ring2Ref.current.rotation.z += delta * 0.75 * speed;
      }
    }
  });

  return (
    <group>
      {/* Outer Gyro Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.65, 0.022, 16, 90]} />
        <meshStandardMaterial
          color="#4D7CFE"
          wireframe
          transparent
          opacity={0.65 + (progress / 100) * 0.35}
          emissive="#4D7CFE"
          emissiveIntensity={0.6 + (progress / 100) * 0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Tilted Gyro Ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.5, 0, 0]}>
        <torusGeometry args={[1.4, 0.018, 16, 80]} />
        <meshStandardMaterial
          color="#85A6FF"
          wireframe
          transparent
          opacity={0.55 + (progress / 100) * 0.4}
          emissive="#85A6FF"
          emissiveIntensity={0.5 + (progress / 100) * 0.7}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}
