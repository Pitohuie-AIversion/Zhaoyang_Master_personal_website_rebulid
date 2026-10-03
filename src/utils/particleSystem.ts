/**
 * 粒子系统管理器
 * 负责粒子的生成、更新、对象池和状态同步
 */

import { Vector2 } from './perlinNoise';
import {
  type ParticleSystemConfig,
  type ColorScheme,
  defaultParticleConfig,
  performancePresets,
  themePresets,
} from './particlePresets';
import {
  computeNoiseForce,
  computeMouseForce,
  computeTurbulenceForce,
  wrapBoundaries,
} from './particlePhysics';
import {
  type Particle,
  type ParticlePerformanceMetrics,
  createEmptyParticle,
  spawnParticleFromPool,
  serializeParticlesToBuffer,
} from './particle-system-core';

export type { ParticleSystemConfig, ColorScheme, Particle, ParticlePerformanceMetrics };
export { defaultParticleConfig, performancePresets, themePresets };

export class ParticleSystem {
  private particles: Particle[] = [];
  private config: ParticleSystemConfig;
  private time: number = 0;
  private mousePosition: Vector2 = new Vector2(0, 0);
  private bounds: { width: number; height: number };
  private particlePool: Particle[] = [];
  private nextParticleId: number = 0;
  private isPaused: boolean = false;

  // 性能监控指标
  private performanceMetrics: ParticlePerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    particleCount: 0,
    drawCalls: 0,
  };

  constructor(config: ParticleSystemConfig, bounds: { width: number; height: number }) {
    this.config = { ...config };
    this.bounds = bounds;
    this.initializeParticles();
  }

  /**
   * 初始化粒子系统与粒子对象池
   */
  private initializeParticles(): void {
    this.particles = [];
    this.particlePool = [];

    // 预分配粒子池
    for (let i = 0; i < this.config.particleCount * 1.5; i++) {
      this.particlePool.push(createEmptyParticle(this.nextParticleId++));
    }

    // 创建初始活跃粒子
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.spawnParticle());
    }
  }

  private spawnParticle(): Particle {
    return spawnParticleFromPool(
      this.particlePool,
      this.bounds,
      this.time,
      this.config,
      () => this.nextParticleId++
    );
  }

  /**
   * 更新粒子物理系统
   */
  update(deltaTime: number): void {
    if (this.isPaused) return;

    this.time += deltaTime;
    const startTime = performance.now();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      if (!this.updateParticle(particle, deltaTime)) {
        this.particles.splice(i, 1);
        this.particlePool.push(particle);

        if (this.particles.length < this.config.particleCount) {
          this.particles.push(this.spawnParticle());
        }
      }
    }

    const endTime = performance.now();
    this.performanceMetrics.frameTime = endTime - startTime;
    this.performanceMetrics.particleCount = this.particles.length;
  }

  /**
   * 更新单个粒子的物理学属性
   */
  private updateParticle(particle: Particle, deltaTime: number): boolean {
    particle.life -= deltaTime / particle.maxLife;
    if (particle.life <= 0) {
      return false;
    }

    particle.acceleration = new Vector2(0, 0);

    // 重力
    particle.acceleration.y += this.config.physics.gravity;

    // 噪声场力
    const noiseForce = computeNoiseForce(particle.position, this.time, this.config.noiseScale);
    particle.acceleration = particle.acceleration.add(noiseForce);

    // 鼠标交互力
    const mouseForce = computeMouseForce(
      particle.position,
      this.mousePosition,
      this.config.physics.mouseInfluence
    );
    particle.acceleration = particle.acceleration.add(mouseForce);

    // 湍流力
    const turbulenceForce = computeTurbulenceForce(
      particle.position,
      this.time,
      this.config.physics.turbulence
    );
    particle.acceleration = particle.acceleration.add(turbulenceForce);

    // 速度与位置积分
    particle.velocity = particle.velocity.add(
      particle.acceleration.multiply(deltaTime / particle.mass)
    );

    // 阻尼
    particle.velocity = particle.velocity.multiply(1 - this.config.physics.damping * deltaTime);

    // 限速
    const maxSpeed = this.config.visual.speed;
    if (particle.velocity.magnitude() > maxSpeed) {
      particle.velocity = particle.velocity.normalize().multiply(maxSpeed);
    }

    particle.position = particle.position.add(particle.velocity.multiply(deltaTime));

    // 边界检测换行
    wrapBoundaries(particle.position, this.bounds);

    return true;
  }

  setMousePosition(x: number, y: number): void {
    this.mousePosition = new Vector2(x, y);
  }

  updateConfig(newConfig: Partial<ParticleSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.particleCount && newConfig.particleCount !== this.particles.length) {
      this.initializeParticles();
    }
  }

  resize(width: number, height: number): void {
    this.bounds = { width, height };
  }

  getParticleData(): Float32Array {
    return serializeParticlesToBuffer(this.particles);
  }

  getPerformanceMetrics(): ParticlePerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  getConfig(): ParticleSystemConfig {
    return { ...this.config };
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  isPausedState(): boolean {
    return this.isPaused;
  }

  reset(): void {
    this.time = 0;
    this.initializeParticles();
  }

  render(renderer: Record<string, unknown>): void {
    const particleData = this.getParticleData();
    if (particleData.length === 0) return;

    if (renderer && typeof renderer.renderParticles === 'function') {
      renderer.renderParticles(particleData, this.particles.length);
    }
  }

  dispose(): void {
    this.particles = [];
    this.particlePool = [];
  }
}