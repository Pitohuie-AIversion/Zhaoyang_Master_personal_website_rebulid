import { Vector2 } from '../perlinNoise';

export interface Particle {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  life: number;
  maxLife: number;
  size: number;
  color: [number, number, number];
  mass: number;
  id: number;
}

export interface ParticlePerformanceMetrics {
  fps: number;
  frameTime: number;
  particleCount: number;
  drawCalls: number;
}
