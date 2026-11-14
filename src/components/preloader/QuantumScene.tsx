"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ReactorCore } from "./ReactorCore";
import { ParticleField } from "./ParticleField";

interface QuantumSceneProps {
  progress: number;
  onFpsUpdate?: (fps: number) => void;
  onRendererReady?: (rendererName: string) => void;
  onWebGLFail?: () => void;
}

function QuantumSceneComponent({
  progress,
  onFpsUpdate,
  onRendererReady,
  onWebGLFail,
}: QuantumSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // 1. Stabilize callback identities using refs to eliminate effect churn
  const onFpsUpdateRef = useRef(onFpsUpdate);
  const onRendererReadyRef = useRef(onRendererReady);
  const onWebGLFailRef = useRef(onWebGLFail);

  useEffect(() => {
    onFpsUpdateRef.current = onFpsUpdate;
    onRendererReadyRef.current = onRendererReady;
    onWebGLFailRef.current = onWebGLFail;
  });

  // 2. Ensure Three.js renderer initializes exactly ONCE per scene lifecycle
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
      onWebGLFailRef.current?.();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 640;

    // A. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101216); // Obsidian #101216

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 55 : 45,
      width / height,
      0.1,
      100
    );
    camera.position.z = isMobile ? 6.5 : 5.4;

    // B. High-Performance WebGL Renderer
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
      onRendererReadyRef.current?.(shortGpu || "Three.js WebGL2");
    } catch {
      onWebGLFailRef.current?.();
      return;
    }

    // C. WebGL Context Failure Safe Handler
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onWebGLFailRef.current?.();
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);

    // D. Ambient Baseline Illumination
    const ambientLight = new THREE.AmbientLight(0x1a1d24, 0.9);
    scene.add(ambientLight);

    // E. Instantiate Quantum Reactor & Particle Field
    const reactor = new ReactorCore();
    scene.add(reactor.group);

    const particles = new ParticleField(isMobile);
    scene.add(particles.points);

    // F. Protected Animation Loop (prevents duplicate loops or post-cleanup frames)
    let isDestroyed = false;
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = (currentTime: number) => {
      if (isDestroyed) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Track authentic measured FPS
      frameCount++;
      if (currentTime - lastFpsTime >= 1000) {
        onFpsUpdateRef.current?.(frameCount);
        frameCount = 0;
        lastFpsTime = currentTime;
      }

      // Update Subsystems using stable progress ref (no re-renders triggered)
      const factor = progressRef.current / 100;
      reactor.update(delta, factor);
      particles.update(delta, factor);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // G. Responsive Resize Handling
    const handleResize = () => {
      if (isDestroyed || !container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.fov = w < 640 ? 55 : 45;
      camera.position.z = w < 640 ? 6.5 : 5.4;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // H. Strict Memory & WebGL Disposal Cleanup
    return () => {
      isDestroyed = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      renderer.domElement?.removeEventListener("webglcontextlost", handleContextLost);

      reactor.dispose();
      particles.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array ensures WebGL initializes ONCE per lifecycle

  return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden" />;
}

export default React.memo(QuantumSceneComponent);
