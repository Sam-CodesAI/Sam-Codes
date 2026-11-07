"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLoaderStore } from "@/store/useLoaderStore";

// Custom GLSL Shader for Electric Plasma with crackling energy filaments
const PlasmaShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color("#00e5ff") },
    uColorGlow: { value: new THREE.Color("#0051ff") },
    uProgress: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uProgress;

    // Simplex Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      float speed = 1.5 + (uProgress / 100.0) * 2.5;
      float noise = snoise(position * 2.2 + uTime * speed);
      vec3 newPosition = position + normal * (noise * 0.08);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColorCore;
    uniform vec3 uColorGlow;

    void main() {
      // Fresnel rim lighting for electric glow edge
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

      // Crackling lightning filament pulses
      float speed = 2.0 + (uProgress / 100.0) * 3.0;
      float electricPulsing = sin(vPosition.y * 12.0 + uTime * speed * 4.0) *
                              cos(vPosition.x * 12.0 - uTime * speed * 3.0);
      float filament = step(0.65, abs(electricPulsing));

      // Color composition matching reference image
      vec3 baseColor = mix(uColorGlow, uColorCore, fresnel * 0.85);
      vec3 finalColor = mix(baseColor, vec3(1.0, 1.0, 1.0), filament * 0.7);

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `,
};

export function QuantumPlasmaSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const progress = useLoaderStore((s) => s.progress);

  const shaderData = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(PlasmaShaderMaterial.uniforms),
      vertexShader: PlasmaShaderMaterial.vertexShader,
      fragmentShader: PlasmaShaderMaterial.fragmentShader,
      transparent: true,
    });
  }, []);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed;
      materialRef.current.uniforms.uProgress.value = progress;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }

    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(elapsed * 4) * 0.06 * (1 + progress / 100);
      innerCoreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* 1. Ultra-Bright Inner Plasma Core Nucleus */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 2. Outer Electric Plasma Filament Shell */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <primitive object={shaderData} ref={materialRef} attach="material" />
      </mesh>

      {/* 3. Radial Point Light radiating from core */}
      <pointLight color="#00e5ff" intensity={4.5} distance={8} />
      <pointLight color="#4D7CFE" intensity={3.0} distance={10} />
    </group>
  );
}
