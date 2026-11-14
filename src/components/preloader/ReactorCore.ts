import * as THREE from "three";

export class ReactorCore {
  public group: THREE.Group;
  private plasmaCore: THREE.Mesh;
  private innerAura: THREE.Mesh;
  private housingCage: THREE.Mesh;
  private outerFrame: THREE.LineSegments;
  private ring1: THREE.Mesh;
  private ring2: THREE.Mesh;
  private ring3: THREE.Mesh;
  private coreLight: THREE.PointLight;
  private rimLight: THREE.PointLight;
  private pulseClock: number = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Central Plasma Energy Sphere (Primary Accent: #4D7CFE)
    const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x4d7cfe,
      wireframe: false,
      transparent: true,
      opacity: 0.95,
    });
    this.plasmaCore = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.plasmaCore);

    // 1b. Atmospheric Plasma Aura (Additive Glow)
    const auraGeo = new THREE.SphereGeometry(0.92, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x6990ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    this.innerAura = new THREE.Mesh(auraGeo, auraMat);
    this.group.add(this.innerAura);

    // 2. Metallic Geometric Housing Cage (Icosahedron with Dark Metallic Graphite #20252E)
    const housingGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const housingMat = new THREE.MeshStandardMaterial({
      color: 0x1a1d24,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
      transparent: true,
      opacity: 0.75,
    });
    this.housingCage = new THREE.Mesh(housingGeo, housingMat);
    this.group.add(this.housingCage);

    // 2b. Fine Metallic Wireframe Struts (#4D7CFE)
    const wireframeEdges = new THREE.EdgesGeometry(housingGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x4d7cfe,
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    });
    this.outerFrame = new THREE.LineSegments(wireframeEdges, wireframeMat);
    this.group.add(this.outerFrame);

    // 3. Precision Orbital Gimbal Rings
    // Ring 1: Primary Equatorial Ring
    const ring1Geo = new THREE.TorusGeometry(1.85, 0.022, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x6990ff,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x203580,
      emissiveIntensity: 0.4,
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI * 0.25;
    this.group.add(this.ring1);

    // Ring 2: Polar Orbital Ring
    const ring2Geo = new THREE.TorusGeometry(2.15, 0.018, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x4d7cfe,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x182860,
      emissiveIntensity: 0.3,
    });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.y = Math.PI * 0.33;
    this.group.add(this.ring2);

    // Ring 3: Tilted Precession Outer Ring
    const ring3Geo = new THREE.TorusGeometry(2.45, 0.015, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x292e38,
      transparent: true,
      opacity: 0.85,
    });
    this.ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    this.ring3.rotation.z = Math.PI * 0.15;
    this.group.add(this.ring3);

    // 4. Controlled Point Illumination
    this.coreLight = new THREE.PointLight(0x4d7cfe, 2.8, 12);
    this.group.add(this.coreLight);

    this.rimLight = new THREE.PointLight(0x6990ff, 1.2, 8);
    this.rimLight.position.set(2, 3, 2);
    this.group.add(this.rimLight);
  }

  public update(delta: number, progressFactor: number) {
    this.pulseClock += delta;

    // Smooth Multi-Axis Rotations
    const baseSpeed = 0.5 + progressFactor * 0.8;
    this.plasmaCore.rotation.y += delta * 0.6 * baseSpeed;
    this.plasmaCore.rotation.x += delta * 0.3 * baseSpeed;

    this.housingCage.rotation.x += delta * 0.22 * baseSpeed;
    this.housingCage.rotation.y -= delta * 0.35 * baseSpeed;
    this.outerFrame.rotation.copy(this.housingCage.rotation);

    // Orbital ring counter-rotations
    this.ring1.rotation.x += delta * 0.45 * baseSpeed;
    this.ring1.rotation.y += delta * 0.3 * baseSpeed;

    this.ring2.rotation.y -= delta * 0.55 * baseSpeed;
    this.ring2.rotation.z += delta * 0.25 * baseSpeed;

    this.ring3.rotation.z += delta * 0.2 * baseSpeed;
    this.ring3.rotation.x -= delta * 0.15 * baseSpeed;

    // Subtle Core Plasma Breathing Pulse
    const pulse = Math.sin(this.pulseClock * 3.5) * 0.05 + 1.0;
    const activePulse = pulse * (0.9 + progressFactor * 0.15);
    this.plasmaCore.scale.set(activePulse, activePulse, activePulse);

    const auraPulse = Math.sin(this.pulseClock * 2.8) * 0.08 + 1.0;
    this.innerAura.scale.set(auraPulse, auraPulse, auraPulse);

    // Dynamic Illumination Intensity
    this.coreLight.intensity = (2.2 + Math.sin(this.pulseClock * 4.0) * 0.6) * (0.8 + progressFactor * 0.4);
  }

  public setIntensity(val: number) {
    this.coreLight.intensity = val * 3.0;
    (this.plasmaCore.material as THREE.MeshBasicMaterial).opacity = Math.min(1, val * 0.95);
  }

  public dispose() {
    this.plasmaCore.geometry.dispose();
    (this.plasmaCore.material as THREE.Material).dispose();

    this.innerAura.geometry.dispose();
    (this.innerAura.material as THREE.Material).dispose();

    this.housingCage.geometry.dispose();
    (this.housingCage.material as THREE.Material).dispose();

    this.outerFrame.geometry.dispose();
    (this.outerFrame.material as THREE.Material).dispose();

    this.ring1.geometry.dispose();
    (this.ring1.material as THREE.Material).dispose();

    this.ring2.geometry.dispose();
    (this.ring2.material as THREE.Material).dispose();

    this.ring3.geometry.dispose();
    (this.ring3.material as THREE.Material).dispose();
  }
}
