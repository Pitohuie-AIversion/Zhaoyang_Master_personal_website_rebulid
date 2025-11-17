/**
 * Perlin Noise 算法实现
 * 用于生成自然的粒子运动模式
 */

export class PerlinNoise {
  private permutation: number[];
  private gradients: number[][];

  constructor(seed?: number) {
    this.permutation = this.generatePermutation(seed);
    this.gradients = this.generateGradients();
  }

  /**
   * 生成置换表
   */
  private generatePermutation(seed?: number): number[] {
    const p = [];
    
    // 使用种子初始化随机数生成器
    const random = seed ? this.seededRandom(seed) : Math.random;
    
    // 生成0-255的数组
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    
    // Fisher-Yates 洗牌算法
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    
    // 复制一份以避免边界检查
    return [...p, ...p];
  }

  /**
   * 种子随机数生成器
   */
  private seededRandom(seed: number): () => number {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  }

  /**
   * 生成梯度向量
   */
  private generateGradients(): number[][] {
    const gradients = [];
    
    // 12个梯度向量（立方体的边）
    const grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];
    
    for (let i = 0; i < 512; i++) {
      gradients[i] = grad3[this.permutation[i % 256] % 12];
    }
    
    return gradients;
  }

  /**
   * 淡化函数 (fade function)
   */
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * 线性插值
   */
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  /**
   * 梯度点积
   */
  private grad(hash: number, x: number, y: number, z: number = 0): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * 2D Perlin Noise
   */
  noise2D(x: number, y: number): number {
    // 找到单位立方体中的点
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    // 找到相对位置
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    // 计算淡化曲线
    const u = this.fade(x);
    const v = this.fade(y);
    
    // 哈希坐标
    const A = this.permutation[X] + Y;
    const AA = this.permutation[A];
    const AB = this.permutation[A + 1];
    const B = this.permutation[X + 1] + Y;
    const BA = this.permutation[B];
    const BB = this.permutation[B + 1];
    
    // 插值结果
    return this.lerp(
      this.lerp(
        this.grad(this.permutation[AA], x, y),
        this.grad(this.permutation[BA], x - 1, y),
        u
      ),
      this.lerp(
        this.grad(this.permutation[AB], x, y - 1),
        this.grad(this.permutation[BB], x - 1, y - 1),
        u
      ),
      v
    );
  }

  /**
   * 3D Perlin Noise
   */
  noise3D(x: number, y: number, z: number): number {
    // 找到单位立方体中的点
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    // 找到相对位置
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    // 计算淡化曲线
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);
    
    // 哈希坐标
    const A = this.permutation[X] + Y;
    const AA = this.permutation[A] + Z;
    const AB = this.permutation[A + 1] + Z;
    const B = this.permutation[X + 1] + Y;
    const BA = this.permutation[B] + Z;
    const BB = this.permutation[B + 1] + Z;
    
    // 插值结果
    return this.lerp(
      this.lerp(
        this.lerp(
          this.grad(this.permutation[AA], x, y, z),
          this.grad(this.permutation[BA], x - 1, y, z),
          u
        ),
        this.lerp(
          this.grad(this.permutation[AB], x, y - 1, z),
          this.grad(this.permutation[BB], x - 1, y - 1, z),
          u
        ),
        v
      ),
      this.lerp(
        this.lerp(
          this.grad(this.permutation[AA + 1], x, y, z - 1),
          this.grad(this.permutation[BA + 1], x - 1, y, z - 1),
          u
        ),
        this.lerp(
          this.grad(this.permutation[AB + 1], x, y - 1, z - 1),
          this.grad(this.permutation[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }

  /**
   * 分形噪声 (Fractal Noise)
   * 通过叠加多个八度的噪声来创建更复杂的模式
   */
  fractalNoise2D(
    x: number, 
    y: number, 
    octaves: number = 4, 
    persistence: number = 0.5, 
    lacunarity: number = 2.0
  ): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    
    return value / maxValue;
  }

  /**
   * 湍流噪声 (Turbulence)
   * 使用噪声的绝对值创建湍流效果
   */
  turbulence2D(
    x: number, 
    y: number, 
    octaves: number = 4, 
    persistence: number = 0.5
  ): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += Math.abs(this.noise2D(x * frequency, y * frequency)) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    
    return value / maxValue;
  }

  /**
   * 脊状噪声 (Ridge Noise)
   * 创建山脊状的噪声模式
   */
  ridgeNoise2D(
    x: number, 
    y: number, 
    octaves: number = 4, 
    persistence: number = 0.5
  ): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      const n = Math.abs(this.noise2D(x * frequency, y * frequency));
      value += (1 - n) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    
    return value / maxValue;
  }
}

/**
 * 全局 Perlin Noise 实例
 */
export const perlinNoise = new PerlinNoise(12345);

/**
 * 便捷函数
 */
export const noise2D = (x: number, y: number): number => perlinNoise.noise2D(x, y);
export const noise3D = (x: number, y: number, z: number): number => perlinNoise.noise3D(x, y, z);
export const fractalNoise2D = (
  x: number, 
  y: number, 
  octaves?: number, 
  persistence?: number, 
  lacunarity?: number
): number => perlinNoise.fractalNoise2D(x, y, octaves, persistence, lacunarity);

/**
 * 向量数学工具
 */
export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  static fromAngle(angle: number, magnitude: number = 1): Vector2 {
    return new Vector2(
      Math.cos(angle) * magnitude,
      Math.sin(angle) * magnitude
    );
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    return mag > 0 ? this.divide(mag) : new Vector2(0, 0);
  }

  distance(v: Vector2): number {
    return this.subtract(v).magnitude();
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  lerp(v: Vector2, t: number): Vector2 {
    return new Vector2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    );
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  toArray(): [number, number] {
    return [this.x, this.y];
  }
}