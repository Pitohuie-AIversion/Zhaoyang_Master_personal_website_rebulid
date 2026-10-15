import type { Particle } from './types';

/**
 * 序列化为 WebGL 顶点的平铺 Float32Array (每个粒子 9 个浮点数: x, y, vx, vy, life, size, r, g, b)
 */
export function serializeParticlesToBuffer(particles: Particle[]): Float32Array {
  const data = new Float32Array(particles.length * 9);

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
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
