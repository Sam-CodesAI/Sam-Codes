import * as THREE from "three";

interface ParticleMeta {
  radius: number;
  theta: number;
  phi: number;
  speed: number;
  convergeSpeed: number;
  mode: "orbit" | "converge";
  initialRadius: number;
}

export class ParticleField {
  public points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private positions: Float32Array;
  private colors: Float32Array;
  private meta: ParticleMeta[] = [];
  private count: number;

  constructor(isMobile: boolean = false) {
    this.count = isMobile ? 240 : 540;
    this.positions = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 3);

    const primaryColor = new THREE.Color(0x4d7cfe); // #4D7CFE
    const accentHoverColor = new THREE.Color(0x6990ff); // #6990FF
    const mutedColor = new THREE.Color(0x292e38); // #292E38

    for (let i = 0; i < this.count; i++) {
      const isOrbiting = i % 3 === 0;
      const initialRadius = isOrbiting ? 1.6 + Math.random() * 1.8 : 3.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      this.meta.push({
        radius: initialRadius,
        theta,
        phi,
        speed: 0.3 + Math.random() * 0.7,
        convergeSpeed: 0.4 + Math.random() * 0.6,
        mode: isOrbiting ? "orbit" : "converge",
        initialRadius,
      });

      // Initial Cartesian Position
      this.positions[i * 3] = initialRadius * Math.sin(phi) * Math.cos(theta);
      this.positions[i * 3 + 1] = initialRadius * Math.sin(phi) * Math.sin(theta);
      this.positions[i * 3 + 2] = initialRadius * Math.cos(phi);

      // Color Palette Distribution
      const rand = Math.random();
      const col = rand > 0.65 ? accentHoverColor : rand > 0.25 ? primaryColor : mutedColor;
      this.colors[i * 3] = col.r;
      this.colors[i * 3 + 1] = col.g;
      this.colors[i * 3 + 2] = col.b;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, material);
  }

  public update(delta: number, progressFactor: number) {
    const pos = this.positions;

    for (let i = 0; i < this.count; i++) {
      const p = this.meta[i];

      // Update angular movement
      p.theta += delta * p.speed * (0.8 + progressFactor * 0.5);

      if (p.mode === "converge") {
        // Converge toward the reactor center
        p.radius -= delta * p.convergeSpeed * (1.0 + progressFactor * 0.8);
        if (p.radius < 1.1) {
          // Re-emerge from deep environment
          p.radius = p.initialRadius;
          p.theta = Math.random() * Math.PI * 2;
          p.phi = Math.acos(2 * Math.random() - 1);
        }
      } else {
        // Subtle orbital precession
        p.phi += Math.sin(p.theta * 0.5) * 0.005;
      }

      // Convert Spherical to Cartesian coordinates
      pos[i * 3] = p.radius * Math.sin(p.phi) * Math.cos(p.theta);
      pos[i * 3 + 1] = p.radius * Math.sin(p.phi) * Math.sin(p.theta);
      pos[i * 3 + 2] = p.radius * Math.cos(p.phi);
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  public dispose() {
    this.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
