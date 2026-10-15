import { Vector2, perlinNoise } from '../perlinNoise';
import { type ParticleSystemConfig, getParticleColor } from '../particlePresets';
import type { Particle } from './types';

export function createEmptyParticle(id: number): Particle {
  return {
    position: new Vector2(),
    velocity: new Vector2(),
    acceleration: new Vector2(),
    life: 1.0,
    maxLife: 1.0,
    size: 1.0,
    color: [1, 1, 1],
    mass: 1.0,
    id,
  };
}

export function spawnParticleFromPool(
  pool: Particle[],
  bounds: { width: number; height: number },
  time: number,
  config: ParticleSystemConfig,
  generateNextId: () => number
): Particle {
  const particle = pool.pop() || createEmptyParticle(generateNextId());

  particle.position = new Vector2(
    Math.random() * bounds.width,
    Math.random() * bounds.height
  );

  const noiseX = perlinNoise.noise2D(particle.position.x * 0.01, time * 0.1);
  const noiseY = perlinNoise.noise2D(particle.position.y * 0.01, time * 0.1 + 100);

  particle.velocity = new Vector2(noiseX * 2, noiseY * 2);
  particle.acceleration = new Vector2(0, 0);

  particle.life = 1.0;
  particle.maxLife = 0.5 + Math.random() * 1.5;

  const { minSize, maxSize } = config.visual;
  particle.size = minSize + Math.random() * (maxSize - minSize);
  particle.mass = 0.5 + Math.random() * 1.5;
  particle.color = getParticleColor(config.colorScheme);

  return particle;
}
