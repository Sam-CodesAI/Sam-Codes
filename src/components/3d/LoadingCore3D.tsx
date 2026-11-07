"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface LoadingCoreSceneProps {
  progress: number;
}

function QuantumNucleus({ progress }: { progress: number }) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerLatticeRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  // Progress acceleration factor (spins faster as it nears 100%)
  const speedFactor = 1 + (progress / 100) * 1.5;

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // Rotate core
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4 * speedFactor;
      coreRef.current.rotation.x += delta * 0.25 * speedFactor;
    }

    // Counter-rotate lattice
    if (outerLatticeRef.current) {
      outerLatticeRef.current.rotation.y -= delta * 0.2 * speedFactor;
      outerLatticeRef.current.rotation.z += delta * 0.15 * speedFactor;
      const pulseScale = 1 + Math.sin(elapsed * 2) * 0.04;
      outerLatticeRef.current.scale.setScalar(pulseScale);
    }

    // Gyro gimbal rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.5 * speedFactor;
      ring1Ref.current.rotation.y += delta * 0.3 * speedFactor;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.4 * speedFactor;
      ring2Ref.current.rotation.z += delta * 0.6 * speedFactor;
    }
  });

  return (
    <group>
      {/* 1. Inner Quantum Energy Nucleus with Chromatic Distortion */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[1.1, 48, 48]} />
          <MeshDistortMaterial
            color="#4D7CFE"
            roughness={0.15}
            metalness={0.85}
            distort={0.3 + (progress / 100) * 0.25}
            speed={2 * speedFactor}
          />
        </mesh>
      </Float>

      {/* 2. Outer Geodesic Icosahedron Wireframe */}
      <mesh ref={outerLatticeRef}>
        <icosahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial
          color="#85A6FF"
          wireframe
          transparent
          opacity={0.35 + (progress / 100) * 0.3}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* 3. Gyroscopic Gimbal Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.75, 0.02, 16, 80]} />
        <meshStandardMaterial
          color="#4D7CFE"
          wireframe
          transparent
          opacity={0.6}
          emissive="#4D7CFE"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 4. Gyroscopic Gimbal Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 80]} />
        <meshStandardMaterial
          color="#85A6FF"
          wireframe
          transparent
          opacity={0.5}
          emissive="#85A6FF"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

function OrbitalParticleField({ count = 220 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color("#4D7CFE");
    const color2 = new THREE.Color("#85A6FF");

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution across sphere
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.4 + Math.random() * 0.8;

      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = color1.clone().lerp(color2, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function LoadingCore3D({ progress }: LoadingCoreSceneProps) {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-4, -4, -3]} intensity={2.5} color="#4D7CFE" />
        <pointLight position={[4, 4, 3]} intensity={2.0} color="#85A6FF" />

        <QuantumNucleus progress={progress} />
        <OrbitalParticleField />
      </Canvas>
    </div>
  );
}
