/**
 * 粒子系统管理器
 * 负责粒子的生成、更新、对象池和状态同步
 */

import { Vector2, perlinNoise } from './perlinNoise';
import {
  type ParticleSystemConfig,
  type ColorScheme,
  defaultParticleConfig,
  performancePresets,
  themePresets,
  getParticleColor,
} from './particlePresets';
import {
  computeNoiseForce,
  computeMouseForce,
  computeTurbulenceForce,
  wrapBoundaries,
} from './particlePhysics';

export type { ParticleSystemConfig, ColorScheme };
export { defaultParticleConfig, performancePresets, themePresets };

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
  private performanceMetrics = {
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
      this.particlePool.push(this.createParticle());
    }

    // 创建初始活跃粒子
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.spawnParticle());
    }
  }

  /**
   * 创建新粒子对象
   */
  private createParticle(): Particle {
    return {
      position: new Vector2(),
      velocity: new Vector2(),
      acceleration: new Vector2(),
      life: 1.0,
      maxLife: 1.0,
      size: 1.0,
      color: [1, 1, 1],
      mass: 1.0,
      id: this.nextParticleId++,
    };
  }

  /**
   * 从对象池取出并重新生成粒子属性
   */
  private spawnParticle(): Particle {
    const particle = this.particlePool.pop() || this.createParticle();

    particle.position = new Vector2(
      Math.random() * this.bounds.width,
      Math.random() * this.bounds.height
    );

    const noiseX = perlinNoise.noise2D(particle.position.x * 0.01, this.time * 0.1);
    const noiseY = perlinNoise.noise2D(particle.position.y * 0.01, this.time * 0.1 + 100);

    particle.velocity = new Vector2(noiseX * 2, noiseY * 2);
    particle.acceleration = new Vector2(0, 0);

    particle.life = 1.0;
    particle.maxLife = 0.5 + Math.random() * 1.5;

    const { minSize, maxSize } = this.config.visual;
    particle.size = minSize + Math.random() * (maxSize - minSize);
    particle.mass = 0.5 + Math.random() * 1.5;
    particle.color = getParticleColor(this.config.colorScheme);

    return particle;
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

  /**
   * 序列化为 WebGL 顶点的平铺 Float32Array (每个粒子 9 个浮点数: x, y, vx, vy, life, size, r, g, b)
   */
  getParticleData(): Float32Array {
    const data = new Float32Array(this.particles.length * 9);

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const offset = i * 9;

      data[offset] = particle.position.x;
      data[offset + 1] = particle.position.y;
      data[offset + 2] = particle.velocity.x;
      data[offset + 3] = particle.velocity.y;
      data[offset + 4] = particle.life;
      data[offset + 5] = particle.size;
      data[offset + 6] = particle.color[0];
      data[offset + 7] = particle.color[1];
      data[offset + 8] = particle.color[2];
    }

    return data;
  }

  getPerformanceMetrics() {
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