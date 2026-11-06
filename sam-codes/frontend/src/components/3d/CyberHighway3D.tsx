"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CyberHighway3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030509, 0.08);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5);
    camera.rotation.x = -0.15;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for Highway elements
    const highwayGroup = new THREE.Group();
    scene.add(highwayGroup);

    // 1. Perspective Highway Grid Lines (Electric Cobalt)
    const laneCount = 8;
    const laneWidth = 1.2;
    const lineLength = 40;
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.5,
    });

    const laneGeometries: THREE.BufferGeometry[] = [];
    for (let i = -laneCount / 2; i <= laneCount / 2; i++) {
      const points = [];
      points.push(new THREE.Vector3(i * laneWidth, 0, -lineLength));
      points.push(new THREE.Vector3(i * laneWidth, 0, 5));
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      laneGeometries.push(geom);
      const line = new THREE.Line(geom, linesMaterial);
      highwayGroup.add(line);
    }

    // 2. Transverse Highway Sleepers / Rungs
    const rungCount = 30;
    const rungGeometry = new THREE.BufferGeometry();
    const rungPositions = [];

    for (let i = 0; i < rungCount; i++) {
      const z = -i * (lineLength / rungCount);
      rungPositions.push(-laneCount * 0.6, 0, z);
      rungPositions.push(laneCount * 0.6, 0, z);
    }
    rungGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(rungPositions, 3)
    );
    const rungLineMaterial = new THREE.LineBasicMaterial({
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.35,
    });
    const rungLines = new THREE.LineSegments(rungGeometry, rungLineMaterial);
    highwayGroup.add(rungLines);

    // 3. High-Speed Acid Lime Pulses Traveling Along Lanes
    const pulseCount = 36;
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseSpeeds: number[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const laneIndex = Math.floor(Math.random() * (laneCount + 1)) - laneCount / 2;
      pulsePositions[i * 3] = laneIndex * laneWidth;
      pulsePositions[i * 3 + 1] = 0.05 + Math.random() * 0.1;
      pulsePositions[i * 3 + 2] = -Math.random() * lineLength;
      pulseSpeeds.push(12 + Math.random() * 18);
    }

    const pulseGeometry = new THREE.BufferGeometry();
    pulseGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(pulsePositions, 3)
    );

    const pulseMaterial = new THREE.PointsMaterial({
      color: 0xccff00,
      size: 0.12,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const pulseSystem = new THREE.Points(pulseGeometry, pulseMaterial);
    highwayGroup.add(pulseSystem);

    // 4. Volumetric Ambient Cobalt Nodes Floating in Air
    const ambientCount = 80;
    const ambientPositions = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 16;
      ambientPositions[i * 3 + 1] = 0.5 + Math.random() * 4;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    const ambientGeometry = new THREE.BufferGeometry();
    ambientGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(ambientPositions, 3)
    );
    const ambientMaterial = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const ambientSystem = new THREE.Points(ambientGeometry, ambientMaterial);
    highwayGroup.add(ambientSystem);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Advance Acid Lime high-speed pulses along data lanes
      const positions = pulseGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pulseCount; i++) {
        positions[i * 3 + 2] += pulseSpeeds[i] * delta;
        if (positions[i * 3 + 2] > 5) {
          positions[i * 3 + 2] = -lineLength;
          const laneIndex = Math.floor(Math.random() * (laneCount + 1)) - laneCount / 2;
          positions[i * 3] = laneIndex * laneWidth;
        }
      }
      pulseGeometry.attributes.position.needsUpdate = true;

      // Subtle ambient drift
      ambientSystem.rotation.y += delta * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      laneGeometries.forEach((g) => g.dispose());
      linesMaterial.dispose();
      rungGeometry.dispose();
      rungLineMaterial.dispose();
      pulseGeometry.dispose();
      pulseMaterial.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-label="3D Cyber Data Highway WebGL Canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
