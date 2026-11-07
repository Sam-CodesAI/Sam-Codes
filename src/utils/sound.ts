/**
 * Web Audio API Synthesizer for 3D Quantum Reactor Experience
 * Zero external audio downloads, 100% synthetic browser audio.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Start low-frequency reactor ambient hum
   */
  public startReactorHum(isMuted: boolean) {
    if (isMuted || this.humOsc) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      this.humOsc = ctx.createOscillator();
      this.humGain = ctx.createGain();

      this.humOsc.type = "sine";
      this.humOsc.frequency.setValueAtTime(65, ctx.currentTime);

      this.humGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.humGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 1.2);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(ctx.destination);

      this.humOsc.start();
    } catch {}
  }

  /**
   * Modulate reactor frequency as progress rises
   */
  public updateReactorFrequency(progress: number, isMuted: boolean) {
    if (isMuted || !this.humOsc || !this.ctx) return;
    try {
      const targetFreq = 65 + (progress / 100) * 180; // 65Hz up to 245Hz
      this.humOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    } catch {}
  }

  /**
   * Stop reactor ambient hum
   */
  public stopReactorHum() {
    if (!this.humOsc || !this.humGain || !this.ctx) return;
    try {
      this.humGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      setTimeout(() => {
        try {
          this.humOsc?.stop();
          this.humOsc?.disconnect();
          this.humGain?.disconnect();
        } catch {}
        this.humOsc = null;
        this.humGain = null;
      }, 350);
    } catch {
      this.humOsc = null;
      this.humGain = null;
    }
  }

  /**
   * Play telemetry data tick
   */
  public playTelemetryTick(freq = 620, isMuted = false) {
    if (isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  /**
   * Play aperture warp portal burst chime
   */
  public playApertureWarp(isMuted = false) {
    if (isMuted) return;
    this.stopReactorHum();
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Primary rising wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);

      // Harmonizer crystal chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(520, ctx.currentTime + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.7);

      gain2.gain.setValueAtTime(0.04, ctx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.8);
    } catch {}
  }
}

export const sound = new SoundEngine();
