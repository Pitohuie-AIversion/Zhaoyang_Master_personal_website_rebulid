import { Vector2, perlinNoise } from './perlinNoise';

export interface BoundaryBox {
  width: number;
  height: number;
}

/**
 * 计算柏林噪声场施加给粒子的矢量力
 */
export const computeNoiseForce = (
  position: Vector2,
  time: number,
  noiseScale: number,
  forceMultiplier: number = 50.0
): Vector2 => {
  const noiseX = position.x * noiseScale + time * 0.1;
  const noiseY = position.y * noiseScale + time * 0.1;

  const forceX = perlinNoise.fractalNoise2D(noiseX, noiseY, 3, 0.5, 2.0);
  const forceY = perlinNoise.fractalNoise2D(noiseX + 100, noiseY + 100, 3, 0.5, 2.0);

  return new Vector2(forceX, forceY).multiply(forceMultiplier);
};

/**
 * 计算鼠标交互力 (斥力/引力)
 */
export const computeMouseForce = (
  position: Vector2,
  mousePosition: Vector2,
  mouseInfluence: number,
  radius: number = 200
): Vector2 => {
  if (mouseInfluence === 0) return new Vector2(0, 0);

  const mouseDir = position.subtract(mousePosition);
  const distance = mouseDir.magnitude();

  if (distance < radius) {
    return mouseDir.normalize().multiply((radius - distance) * mouseInfluence * 0.1);
  }
  return new Vector2(0, 0);
};

/**
 * 计算湍流摄动力
 */
export const computeTurbulenceForce = (
  position: Vector2,
  time: number,
  turbulence: number
): Vector2 => {
  if (turbulence === 0) return new Vector2(0, 0);

  const turbulenceX = perlinNoise.turbulence2D(
    position.x * 0.01 + time * 0.2,
    position.y * 0.01 + time * 0.2,
    4,
    0.6
  );

  const turbulenceY = perlinNoise.turbulence2D(
    position.x * 0.01 + time * 0.2 + 50,
    position.y * 0.01 + time * 0.2 + 50,
    4,
    0.6
  );

  return new Vector2(turbulenceX, turbulenceY).multiply(turbulence * 20);
};

/**
 * 视口循环边界换行处理
 */
export const wrapBoundaries = (
  position: Vector2,
  bounds: BoundaryBox,
  margin: number = 50
): void => {
  if (position.x < -margin) {
    position.x = bounds.width + margin;
  } else if (position.x > bounds.width + margin) {
    position.x = -margin;
  }

  if (position.y < -margin) {
    position.y = bounds.height + margin;
  } else if (position.y > bounds.height + margin) {
    position.y = -margin;
  }
};
