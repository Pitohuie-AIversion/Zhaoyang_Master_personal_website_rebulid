import { ParticleFieldConfig } from './types';

export const defaultConfig: ParticleFieldConfig = {
  particle: {
    particleCount: 5000,
    noiseScale: 0.01,
    colorScheme: 'ocean',
    performanceLevel: 'medium',
    effects: {
      bloom: true,
      blur: 1.0,
      contrast: 1.1
    },
    physics: {
      gravity: -0.1,
      damping: 0.98,
      turbulence: 0.5,
      mouseInfluence: 1.0
    },
    visual: {
      minSize: 1.0,
      maxSize: 3.0,
      opacity: 0.8,
      speed: 0.5
    }
  },
  postProcess: {
    blurAmount: 1.0,
    bloomIntensity: 0.8,
    bloomEnabled: true,
    contrast: 1.1,
    saturation: 1.2,
    colorTemperature: 6500,
    noiseIntensity: 0.02,
    noiseAmount: 0.01,
    vignetteStrength: 0.3
  },
  interaction: {
    mouseInfluence: 1.0,
    touchInfluence: 1.0,
    interactionRadius: 100,
    attractionStrength: 0.5,
    repulsionStrength: 0.3,
    dampingFactor: 0.95,
    enableMouse: true,
    enableTouch: true,
    enableKeyboard: false,
    maxTouches: 5,
    enabled: true
  },
  performance: {
    preset: 'medium',
    adaptiveQuality: true,
    targetFps: 60
  },
  visual: {
    backgroundColor: [0.05, 0.1, 0.2, 1.0],
    cameraDistance: 10.0,
    fieldOfView: 75.0,
    enableStats: false
  }
};
