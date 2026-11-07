import { create } from "zustand";

export type LoaderPhase = "boot" | "genesis" | "fusion" | "warp" | "ready";

export interface DiagnosticsState {
  coreReactor: boolean;
  particleEngine: boolean;
  renderPipeline: boolean;
  uiFramework: boolean;
  systemIntegrity: boolean;
}

interface LoaderState {
  progress: number;
  phase: LoaderPhase;
  phaseNumber: string;
  phaseLabel: string;
  isLoaded: boolean;
  isMuted: boolean;
  coords: { x: number; y: number; z: number };
  diagnostics: DiagnosticsState;
  setProgress: (progress: number) => void;
  setCoords: (coords: { x: number; y: number; z: number }) => void;
  toggleMute: () => void;
  completeLoading: () => void;
  resetLoading: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  progress: 0,
  phase: "boot",
  phaseNumber: "01 / 05",
  phaseLabel: "KERNEL BOOTLOADER",
  isLoaded: false,
  isMuted: false,
  coords: { x: 0.0, y: 0.0, z: 0.0 },
  diagnostics: {
    coreReactor: false,
    particleEngine: false,
    renderPipeline: false,
    uiFramework: false,
    systemIntegrity: false,
  },
  setProgress: (progress) =>
    set(() => {
      let phase: LoaderPhase = "boot";
      let phaseNumber = "01 / 05";
      let phaseLabel = "QUANTUM INITIALIZATION";

      if (progress < 25) {
        phase = "boot";
        phaseNumber = "01 / 05";
        phaseLabel = "QUANTUM INITIALIZATION";
      } else if (progress < 45) {
        phase = "genesis";
        phaseNumber = "02 / 05";
        phaseLabel = "PARTICLE ACCELERATION";
      } else if (progress < 70) {
        phase = "fusion";
        phaseNumber = "03 / 05";
        phaseLabel = "REACTOR ACTIVATION";
      } else if (progress < 90) {
        phase = "fusion";
        phaseNumber = "04 / 05";
        phaseLabel = "GIMBAL STABILIZATION";
      } else {
        phase = "warp";
        phaseNumber = "05 / 05";
        phaseLabel = "APERTURE PORTAL READY";
      }

      return {
        progress,
        phase,
        phaseNumber,
        phaseLabel,
        diagnostics: {
          coreReactor: progress >= 20,
          particleEngine: progress >= 40,
          renderPipeline: progress >= 60,
          uiFramework: progress >= 80,
          systemIntegrity: progress >= 95,
        },
      };
    }),
  setCoords: (coords) => set({ coords }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  completeLoading: () =>
    set({
      isLoaded: true,
      progress: 100,
      phase: "ready",
      phaseNumber: "05 / 05",
      phaseLabel: "SYSTEM ONLINE",
      diagnostics: {
        coreReactor: true,
        particleEngine: true,
        renderPipeline: true,
        uiFramework: true,
        systemIntegrity: true,
      },
    }),
  resetLoading: () =>
    set({
      progress: 0,
      phase: "boot",
      phaseNumber: "01 / 05",
      phaseLabel: "KERNEL BOOTLOADER",
      isLoaded: false,
      diagnostics: {
        coreReactor: false,
        particleEngine: false,
        renderPipeline: false,
        uiFramework: false,
        systemIntegrity: false,
      },
    }),
}));
