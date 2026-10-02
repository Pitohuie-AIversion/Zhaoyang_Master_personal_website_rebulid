import { PerlinNoise } from './PerlinNoise';

export { PerlinNoise };

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
