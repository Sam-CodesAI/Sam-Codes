"use client";

import React, { useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { QuantumPlasmaSphere } from "./QuantumPlasmaSphere";
import { MechanicalGimbalRings } from "./MechanicalGimbalRings";
import { MagneticStabilizerCollars } from "./MagneticStabilizerCollars";
import { HelicalParticleRibbon } from "./HelicalParticleRibbon";
import { useLoaderStore } from "@/store/useLoaderStore";

function SceneRig() {
  const setCoords = useLoaderStore((s) => s.setCoords);
  const progress = useLoaderStore((s) => s.progress);
  const { pointer, camera } = useThree();

  useFrame(() => {
    // Track pointer coordinates for HUD
    setCoords({
      x: pointer.x,
      y: pointer.y,
      z: camera.position.z,
    });

    // Subtle responsive tilt matching user cursor
    const targetX = pointer.x * 0.35;
    const targetY = pointer.y * 0.25;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

    // Dynamic zoom based on progress
    const targetZ = 5.2 - (progress / 100) * 0.4;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function QuantumReactorScene() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[6, 10, 6]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-4, -2, -3]} intensity={3.5} color="#00e5ff" />
        <pointLight position={[4, 2, 3]} intensity={2.8} color="#4D7CFE" />

        <SceneRig />

        <group>
          {/* Central Electric Plasma Sphere */}
          <QuantumPlasmaSphere />

          {/* Segmented Chrome Gimbal Rings */}
          <MechanicalGimbalRings />

          {/* Top & Bottom Magnetic Stabilizer Collars */}
          <MagneticStabilizerCollars />

          {/* Orbital Helical Particle Ribbon */}
          <HelicalParticleRibbon count={1600} />
        </group>

        {/* High-Intensity Post-Processing Glow (Matching Reference Image) */}
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.25}
            luminanceSmoothing={0.85}
            intensity={1.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
