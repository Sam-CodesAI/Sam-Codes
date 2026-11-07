---
name: threejs-react-three-fiber
description: >-
  Production 3D graphics and WebGL engineering with Three.js, React Three Fiber (R3F v9),
  and @react-three/drei. Enforces declarative canvas architectures, 60fps render loop
  discipline, shader optimizations, memory leak elimination, and mobile DPR clamping.
  Activate when implementing 3D scenes, interactive models, particles, cyber grids,
  or WebGL visual effects.
---

# Three.js & React Three Fiber (R3F) Creative Engineering Playbook

This skill defines strict production standards for implementing 3D WebGL experiences using Three.js and React Three Fiber (v9) in Next.js 16 and React 19.

---

## 1. Canvas Invariants & Next.js RSC Boundaries

Three.js and R3F rely on the WebGL context and `window` APIs; therefore, every 3D component must reside strictly across a client boundary (`"use client"`). In parent layouts or pages, wrap the Canvas with dynamic imports (`ssr: false`):

```tsx
"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function CyberSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Critical Invariant: Mutate transforms directly on the ref, NEVER trigger React setState inside useFrame
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <MeshDistortMaterial
          color="#4D7CFE"
          roughness={0.15}
          metalness={0.8}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function InteractiveScene() {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Clamps device pixel ratio to 2 max to save GPU on 3x Retina displays
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#4D7CFE" />
        <CyberSphere />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  );
}
```

---

## 2. Rendering Discipline: `demand` vs `always`

- **Static / Scroll-Triggered Scenes:** Set `frameloop="demand"` on `<Canvas>`. The GPU idles until user interaction or state changes call `invalidate()`. This drops mobile battery consumption by 85%.
- **Continuous Physics / Fluid Animations:** Set `frameloop="always"`, but keep vertex counts and draw calls strictly budgeted (<50k triangles, <20 draw calls).

---

## 3. High-Performance Particle Systems (`InstancedMesh`)

Never render individual `<mesh>` nodes in a loop for hundreds of objects. Always use `<instancedMesh>`:

```tsx
function MatrixParticleField({ count = 1000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  React.useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      dummy.scale.setScalar(Math.random() * 0.1 + 0.05);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#4D7CFE" wireframe />
    </instancedMesh>
  );
}
```

---

## 4. Anti-Rationalization Table

| Rationalization / Shortcut | Operational Reality & Enforcement |
| :--- | :--- |
| "I'll update React state inside `useFrame` to rotate an object." | Triggering 60-120 React re-renders per second destroys the DOM thread. Mutate `ref.current.rotation` directly. |
| "I won't set `dpr={[1, 2]}` because default looks sharp." | Default `window.devicePixelRatio` on high-end phones is 3x or 4x (9-16x fragment fillrate), causing thermal throttling. Always clamp DPR. |
| "I'll create new Geometries or Materials inside the render body." | Instantiating `new THREE.SphereGeometry()` on each render leaks GPU memory and crashes the WebGL context. Declare them declaratively or memoize. |
| "I'll import standard Three.js canvas in SSR without `dynamic`." | Accessing `window`, WebGL, or Canvas during Next.js SSR crashes with `ReferenceError: window is not defined`. Always wrap with `dynamic(() => ..., { ssr: false })` or `'use client'`. |
