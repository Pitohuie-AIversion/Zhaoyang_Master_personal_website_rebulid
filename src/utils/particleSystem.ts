/**
 * 粒子系统管理器
 * 负责粒子的生成、更新和管理
 */

import { Vector2, perlinNoise } from './perlinNoise';

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

export interface ParticleSystemConfig {
  particleCount: number;
  noiseScale: number;
  colorScheme: 'ocean' | 'fire' | 'electric' | 'cosmic' | 'storm' | 'abyss' | 'aurora' | 'monochrome';
  performanceLevel: 'low' | 'medium' | 'high';
  effects: {
    bloom: boolean;
    blur: number;
    contrast: number;
  };
  physics: {
    gravity: number;
    damping: number;
    turbulence: number;
    mouseInfluence: number;
  };
  visual: {
    minSize: number;
    maxSize: number;
    opacity: number;
    speed: number;
  };
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private config: ParticleSystemConfig;
  private time: number = 0;
  private mousePosition: Vector2 = new Vector2(0, 0);
  private bounds: { width: number; height: number };
  private particlePool: Particle[] = [];
  private nextParticleId: number = 0;

  // 性能监控
  private performanceMetrics = {
    fps: 0,
    frameTime: 0,
    particleCount: 0,
    drawCalls: 0
  };

  constructor(config: ParticleSystemConfig, bounds: { width: number; height: number }) {
    this.config = { ...config };
    this.bounds = bounds;
    this.initializeParticles();
  }

  /**
   * 初始化粒子系统
   */
  private initializeParticles(): void {
    this.particles = [];
    this.particlePool = [];
    
    // 预分配粒子池
    for (let i = 0; i < this.config.particleCount * 1.5; i++) {
      this.particlePool.push(this.createParticle());
    }
    
    // 创建初始粒子
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.spawnParticle());
    }
  }

  /**
   * 创建新粒子
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
      id: this.nextParticleId++
    };
  }

  /**
   * 生成粒子
   */
  private spawnParticle(): Particle {
    const particle = this.particlePool.pop() || this.createParticle();
    
    // 随机位置
    particle.position = new Vector2(
      Math.random() * this.bounds.width,
      Math.random() * this.bounds.height
    );
    
    // 基于噪声的初始速度
    const noiseX = perlinNoise.noise2D(particle.position.x * 0.01, this.time * 0.1);
    const noiseY = perlinNoise.noise2D(particle.position.y * 0.01, this.time * 0.1 + 100);
    
    particle.velocity = new Vector2(noiseX * 2, noiseY * 2);
    particle.acceleration = new Vector2(0, 0);
    
    // 生命值
    particle.life = 1.0;
    particle.maxLife = 0.5 + Math.random() * 1.5;
    
    // 大小
    const { minSize, maxSize } = this.config.visual;
    particle.size = minSize + Math.random() * (maxSize - minSize);
    
    // 质量
    particle.mass = 0.5 + Math.random() * 1.5;
    
    // 颜色
    particle.color = this.getParticleColor();
    
    return particle;
  }

  /**
   * 获取粒子颜色
   */
  private getParticleColor(): [number, number, number] {
    const { colorScheme } = this.config;
    
    switch (colorScheme) {
      case 'ocean':
        return [
          0.0 + Math.random() * 0.3,  // 深蓝到浅蓝
          0.4 + Math.random() * 0.6,  // 中等绿色
          0.8 + Math.random() * 0.2   // 高蓝色
        ];
      
      case 'fire':
        return [
          0.8 + Math.random() * 0.2,  // 高红色
          0.2 + Math.random() * 0.6,  // 中等绿色
          0.0 + Math.random() * 0.3   // 低蓝色
        ];
      
      case 'electric':
        return [
          0.6 + Math.random() * 0.4,  // 中高紫色
          0.0 + Math.random() * 0.4,  // 低绿色
          0.8 + Math.random() * 0.2   // 高蓝色
        ];
      
      case 'cosmic':
        return [
          0.4 + Math.random() * 0.6,  // 中等红色
          0.2 + Math.random() * 0.4,  // 低绿色
          0.6 + Math.random() * 0.4   // 中高蓝色
        ];
      
      case 'storm':
        return [
          0.3 + Math.random() * 0.4,  // 灰色调
          0.3 + Math.random() * 0.4,  // 灰色调
          0.4 + Math.random() * 0.5   // 偏蓝灰色
        ];
      
      case 'abyss':
        return [
          0.0 + Math.random() * 0.2,  // 深色
          0.0 + Math.random() * 0.2,  // 深色
          0.2 + Math.random() * 0.3   // 深蓝色
        ];
      
      case 'aurora':
        return [
          0.2 + Math.random() * 0.6,  // 绿色调
          0.6 + Math.random() * 0.4,  // 高绿色
          0.3 + Math.random() * 0.5   // 中等蓝色
        ];
      
      case 'monochrome': {
        const gray = Math.random();
        return [gray, gray, gray];
      }
      
      default:
        return [0.5, 0.8, 1.0];
    }
  }

  /**
   * 更新粒子系统
   */
  update(deltaTime: number): void {
    this.time += deltaTime;
    
    const startTime = performance.now();
    
    // 更新每个粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      if (!this.updateParticle(particle, deltaTime)) {
        // 粒子死亡，回收到池中
        this.particles.splice(i, 1);
        this.particlePool.push(particle);
        
        // 生成新粒子
        if (this.particles.length < this.config.particleCount) {
          this.particles.push(this.spawnParticle());
        }
      }
    }
    
    // 更新性能指标
    const endTime = performance.now();
    this.performanceMetrics.frameTime = endTime - startTime;
    this.performanceMetrics.particleCount = this.particles.length;
  }

  /**
   * 更新单个粒子
   */
  private updateParticle(particle: Particle, deltaTime: number): boolean {
    // 生命值衰减
    particle.life -= deltaTime / particle.maxLife;
    
    if (particle.life <= 0) {
      return false; // 粒子死亡
    }
    
    // 重置加速度
    particle.acceleration = new Vector2(0, 0);
    
    // 应用重力
    particle.acceleration.y += this.config.physics.gravity;
    
    // 应用噪声力
    this.applyNoiseForce(particle);
    
    // 应用鼠标交互
    this.applyMouseForce(particle);
    
    // 应用湍流
    this.applyTurbulence(particle);
    
    // 更新速度和位置
    particle.velocity = particle.velocity.add(
      particle.acceleration.multiply(deltaTime / particle.mass)
    );
    
    // 应用阻尼
    particle.velocity = particle.velocity.multiply(1 - this.config.physics.damping * deltaTime);
    
    // 限制速度
    const maxSpeed = this.config.visual.speed;
    if (particle.velocity.magnitude() > maxSpeed) {
      particle.velocity = particle.velocity.normalize().multiply(maxSpeed);
    }
    
    // 更新位置
    particle.position = particle.position.add(particle.velocity.multiply(deltaTime));
    
    // 边界处理
    this.handleBoundaries(particle);
    
    return true;
  }

  /**
   * 应用噪声力
   */
  private applyNoiseForce(particle: Particle): void {
    const { noiseScale } = this.config;
    const { position } = particle;
    
    // 计算噪声位置
    const noiseX = position.x * noiseScale + this.time * 0.1;
    const noiseY = position.y * noiseScale + this.time * 0.1;
    
    // 获取噪声值
    const forceX = perlinNoise.fractalNoise2D(noiseX, noiseY, 3, 0.5, 2.0);
    const forceY = perlinNoise.fractalNoise2D(noiseX + 100, noiseY + 100, 3, 0.5, 2.0);
    
    // 应用力
    const forceMultiplier = 50.0;
    particle.acceleration = particle.acceleration.add(
      new Vector2(forceX, forceY).multiply(forceMultiplier)
    );
  }

  /**
   * 应用鼠标交互力
   */
  private applyMouseForce(particle: Particle): void {
    const { mouseInfluence } = this.config.physics;
    
    if (mouseInfluence === 0) return;
    
    const mouseDir = particle.position.subtract(this.mousePosition);
    const distance = mouseDir.magnitude();
    
    if (distance < 200) {
      const force = mouseDir.normalize().multiply(
        (200 - distance) * mouseInfluence * 0.1
      );
      particle.acceleration = particle.acceleration.add(force);
    }
  }

  /**
   * 应用湍流效果
   */
  private applyTurbulence(particle: Particle): void {
    const { turbulence } = this.config.physics;
    
    if (turbulence === 0) return;
    
    const turbulenceX = perlinNoise.turbulence2D(
      particle.position.x * 0.01 + this.time * 0.2,
      particle.position.y * 0.01 + this.time * 0.2,
      4,
      0.6
    );
    
    const turbulenceY = perlinNoise.turbulence2D(
      particle.position.x * 0.01 + this.time * 0.2 + 50,
      particle.position.y * 0.01 + this.time * 0.2 + 50,
      4,
      0.6
    );
    
    const turbulenceForce = new Vector2(turbulenceX, turbulenceY)
      .multiply(turbulence * 20);
    
    particle.acceleration = particle.acceleration.add(turbulenceForce);
  }

  /**
   * 处理边界碰撞
   */
  private handleBoundaries(particle: Particle): void {
    const { width, height } = this.bounds;
    const margin = 50;
    
    // 水平边界
    if (particle.position.x < -margin) {
      particle.position.x = width + margin;
    } else if (particle.position.x > width + margin) {
      particle.position.x = -margin;
    }
    
    // 垂直边界
    if (particle.position.y < -margin) {
      particle.position.y = height + margin;
    } else if (particle.position.y > height + margin) {
      particle.position.y = -margin;
    }
  }

  /**
   * 设置鼠标位置
   */
  setMousePosition(x: number, y: number): void {
    this.mousePosition = new Vector2(x, y);
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<ParticleSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 如果粒子数量改变，重新初始化
    if (newConfig.particleCount && newConfig.particleCount !== this.particles.length) {
      this.initializeParticles();
    }
  }

  /**
   * 调整大小
   */
  resize(width: number, height: number): void {
    this.bounds = { width, height };
  }

  /**
   * 获取粒子数据（用于渲染）
   */
  getParticleData(): Float32Array {
    const data = new Float32Array(this.particles.length * 9); // 每个粒子9个浮点数
    
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const offset = i * 9;
      
      // 位置 (x, y)
      data[offset] = particle.position.x;
      data[offset + 1] = particle.position.y;
      
      // 速度 (vx, vy)
      data[offset + 2] = particle.velocity.x;
      data[offset + 3] = particle.velocity.y;
      
      // 生命值
      data[offset + 4] = particle.life;
      
      // 大小
      data[offset + 5] = particle.size;
      
      // 颜色 (r, g, b) - 分别存储
      data[offset + 6] = particle.color[0];
      data[offset + 7] = particle.color[1];
      data[offset + 8] = particle.color[2];
    }
    
    return data;
  }

  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * 获取粒子数量
   */
  getParticleCount(): number {
    return this.particles.length;
  }

  /**
   * 获取配置
   */
  getConfig(): ParticleSystemConfig {
    return { ...this.config };
  }

  /**
   * 暂停/恢复
   */
  private isPaused: boolean = false;
  
  pause(): void {
    this.isPaused = true;
  }
  
  resume(): void {
    this.isPaused = false;
  }
  
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * 重置粒子系统
   */
  reset(): void {
    this.time = 0;
    this.initializeParticles();
  }

  /**
   * 渲染粒子系统
   */
  render(renderer: Record<string, unknown>): void {
    // 获取粒子数据
    const particleData = this.getParticleData();
    
    if (particleData.length === 0) return;
    
    // 这里应该调用 WebGL 渲染器来渲染粒子
    // 由于 WebGL 渲染器的具体实现可能还在开发中，这里先做一个基础实现
    if (renderer && typeof renderer.renderParticles === 'function') {
      renderer.renderParticles(particleData, this.particles.length);
    }
  }

  /**
   * 销毁粒子系统
   */
  dispose(): void {
    this.particles = [];
    this.particlePool = [];
  }
}

/**
 * 默认配置
 */
export const defaultParticleConfig: ParticleSystemConfig = {
  particleCount: 10000,
  noiseScale: 0.005,
  colorScheme: 'ocean',
  performanceLevel: 'medium',
  effects: {
    bloom: true,
    blur: 0.8,
    contrast: 1.2
  },
  physics: {
    gravity: 0.0,
    damping: 0.1,
    turbulence: 0.5,
    mouseInfluence: 1.0
  },
  visual: {
    minSize: 1.0,
    maxSize: 4.0,
    opacity: 0.8,
    speed: 100.0
  }
};

/**
 * 性能级别预设
 */
export const performancePresets: Record<string, Partial<ParticleSystemConfig>> = {
  low: {
    particleCount: 5000,
    effects: { bloom: false, blur: 0.3, contrast: 0.8 },
    physics: { 
      gravity: 0.0,
      damping: 0.1,
      turbulence: 0.2,
      mouseInfluence: 1.0
    }
  },
  medium: {
    particleCount: 15000,
    effects: { bloom: true, blur: 0.6, contrast: 1.0 },
    physics: { 
      gravity: 0.0,
      damping: 0.1,
      turbulence: 0.5,
      mouseInfluence: 1.0
    }
  },
  high: {
    particleCount: 30000,
    effects: { bloom: true, blur: 0.8, contrast: 1.2 },
    physics: { 
      gravity: 0.0,
      damping: 0.1,
      turbulence: 0.8,
      mouseInfluence: 1.0
    }
  }
};

/**
 * 主题预设配置
 */
export const themePresets: Record<string, Partial<ParticleSystemConfig>> = {
  ocean: {
    particleCount: 2000,
    colorScheme: 'ocean',
    physics: { 
      gravity: 0.1,
      damping: 0.98,
      turbulence: 0.3,
      mouseInfluence: 1.0
    }
  },
  galaxy: {
    particleCount: 3000,
    colorScheme: 'cosmic',
    physics: { 
      gravity: 0.05,
      damping: 0.99,
      turbulence: 0.5,
      mouseInfluence: 1.2
    }
  },
  aurora: {
    particleCount: 1500,
    colorScheme: 'electric',
    physics: { 
      gravity: 0.02,
      damping: 0.95,
      turbulence: 0.8,
      mouseInfluence: 1.5
    }
  }
};