export type ColorScheme =
  | 'ocean'
  | 'fire'
  | 'electric'
  | 'cosmic'
  | 'storm'
  | 'abyss'
  | 'aurora'
  | 'monochrome';

export interface ParticleSystemConfig {
  particleCount: number;
  noiseScale: number;
  colorScheme: ColorScheme;
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

/**
 * 粒子色彩生成策略
 */
export const getParticleColor = (colorScheme: ColorScheme): [number, number, number] => {
  switch (colorScheme) {
    case 'ocean':
      return [
        0.0 + Math.random() * 0.3,
        0.4 + Math.random() * 0.6,
        0.8 + Math.random() * 0.2,
      ];
    case 'fire':
      return [
        0.8 + Math.random() * 0.2,
        0.2 + Math.random() * 0.6,
        0.0 + Math.random() * 0.3,
      ];
    case 'electric':
      return [
        0.6 + Math.random() * 0.4,
        0.0 + Math.random() * 0.4,
        0.8 + Math.random() * 0.2,
      ];
    case 'cosmic':
      return [
        0.4 + Math.random() * 0.6,
        0.2 + Math.random() * 0.4,
        0.6 + Math.random() * 0.4,
      ];
    case 'storm':
      return [
        0.3 + Math.random() * 0.4,
        0.3 + Math.random() * 0.4,
        0.4 + Math.random() * 0.5,
      ];
    case 'abyss':
      return [
        0.0 + Math.random() * 0.2,
        0.0 + Math.random() * 0.2,
        0.2 + Math.random() * 0.3,
      ];
    case 'aurora':
      return [
        0.2 + Math.random() * 0.6,
        0.6 + Math.random() * 0.4,
        0.3 + Math.random() * 0.5,
      ];
    case 'monochrome': {
      const gray = Math.random();
      return [gray, gray, gray];
    }
    default:
      return [0.5, 0.8, 1.0];
  }
};

/**
 * 默认粒子系统配置
 */
export const defaultParticleConfig: ParticleSystemConfig = {
  particleCount: 10000,
  noiseScale: 0.005,
  colorScheme: 'ocean',
  performanceLevel: 'medium',
  effects: {
    bloom: true,
    blur: 0.8,
    contrast: 1.2,
  },
  physics: {
    gravity: 0.0,
    damping: 0.1,
    turbulence: 0.5,
    mouseInfluence: 1.0,
  },
  visual: {
    minSize: 1.0,
    maxSize: 4.0,
    opacity: 0.8,
    speed: 100.0,
  },
};

/**
 * 性能分级预设
 */
export const performancePresets: Record<string, Partial<ParticleSystemConfig>> = {
  low: {
    particleCount: 5000,
    effects: { bloom: false, blur: 0.3, contrast: 0.8 },
    physics: {
      gravity: 0.0,
      damping: 0.1,
      turbulence: 0.2,
      mouseInfluence: 1.0,
    },
  },
  medium: {
    particleCount: 15000,
    effects: { bloom: true, blur: 0.6, contrast: 1.0 },
    physics: {
      gravity: 0.0,
      damping: 0.1,
      turbulence: 0.5,
      mouseInfluence: 1.0,
    },
  },
  high: {
    particleCount: 30000,
    effects: { bloom: true, blur: 0.8, contrast: 1.2 },
    physics: {
      gravity: 0.0,
      damping: 0.1,
      turbulence: 0.8,
      mouseInfluence: 1.0,
    },
  },
};

/**
 * 主题视觉风格预设
 */
export const themePresets: Record<string, Partial<ParticleSystemConfig>> = {
  ocean: {
    particleCount: 2000,
    colorScheme: 'ocean',
    physics: {
      gravity: 0.1,
      damping: 0.98,
      turbulence: 0.3,
      mouseInfluence: 1.0,
    },
  },
  galaxy: {
    particleCount: 3000,
    colorScheme: 'cosmic',
    physics: {
      gravity: 0.05,
      damping: 0.99,
      turbulence: 0.5,
      mouseInfluence: 1.2,
    },
  },
  aurora: {
    particleCount: 1500,
    colorScheme: 'electric',
    physics: {
      gravity: 0.02,
      damping: 0.95,
      turbulence: 0.8,
      mouseInfluence: 1.5,
    },
  },
};
