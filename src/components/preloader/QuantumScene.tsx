"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ReactorCore } from "./ReactorCore";
import { ParticleField } from "./ParticleField";

interface QuantumSceneProps {
  progress: number;
  onFpsUpdate: (fps: number) => void;
  onRendererReady: (rendererName: string) => void;
  onWebGLFail: () => void;
}

export default function QuantumScene({
  progress,
  onFpsUpdate,
  onRendererReady,
  onWebGLFail,
}: QuantumSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check for WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      onWebGLFail();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 640;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101216); // Obsidian #101216

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 55 : 45,
      width / height,
      0.1,
      100
    );
    camera.position.z = isMobile ? 6.5 : 5.4;

    // 2. High-Performance WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: "high-performance",
        alpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const gl = renderer.getContext();
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const gpuName = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : "WebGL2 Hardware";
      const shortGpu = gpuName.split("/")[0].slice(0, 22);
      onRendererReady(shortGpu || "Three.js WebGL2");
    } catch {
      onWebGLFail();
      return;
    }

    // 3. Ambient Baseline Illumination
    const ambientLight = new THREE.AmbientLight(0x1a1d24, 0.9);
    scene.add(ambientLight);

    // 4. Instantiate Quantum Reactor & Particle Field
    const reactor = new ReactorCore();
    scene.add(reactor.group);

    const particles = new ParticleField(isMobile);
    scene.add(particles.points);

    // 5. Animation Loop with FPS & Progress Tracking
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Track FPS
      frameCount++;
      if (currentTime - lastFpsTime >= 1000) {
        onFpsUpdate(frameCount);
        frameCount = 0;
        lastFpsTime = currentTime;
      }

      // Update Subsystems
      const factor = progressRef.current / 100;
      reactor.update(delta, factor);
      particles.update(delta, factor);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.fov = w < 640 ? 55 : 45;
      camera.position.z = w < 640 ? 6.5 : 5.4;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 7. Strict Memory & WebGL Disposal Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      reactor.dispose();
      particles.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onFpsUpdate, onRendererReady, onWebGLFail]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden" />;
}
