import { ConfigPreset } from './types';
import { defaultConfig } from './defaultConfig';

export const builtinPresets: ConfigPreset[] = [
  {
    id: 'ocean-calm',
    name: 'Ocean Calm',
    description: '平静的海洋效果，适合放松和冥想',
    config: {
      ...defaultConfig,
      particle: {
        ...defaultConfig.particle,
        particleCount: 3000,
        colorScheme: 'ocean'
      },
      postProcess: {
        ...defaultConfig.postProcess,
        bloomIntensity: 0.6,
        contrast: 1.0,
        saturation: 1.1
      }
    },
    tags: ['calm', 'ocean', 'relaxing'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'storm-surge',
    name: 'Storm Surge',
    description: '狂暴的风暴效果，充满动感和能量',
    config: {
      ...defaultConfig,
      particle: {
        ...defaultConfig.particle,
        particleCount: 8000,
        colorScheme: 'storm'
      },
      postProcess: {
        ...defaultConfig.postProcess,
        bloomIntensity: 1.2,
        contrast: 1.3,
        saturation: 1.4
      },
      interaction: {
        ...defaultConfig.interaction,
        mouseInfluence: 2.0,
        interactionRadius: 200
      }
    },
    tags: ['storm', 'dynamic', 'energetic'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'deep-abyss',
    name: 'Deep Abyss',
    description: '深海深渊效果，神秘而幽暗',
    config: {
      ...defaultConfig,
      particle: {
        ...defaultConfig.particle,
        particleCount: 4000,
        colorScheme: 'abyss'
      },
      postProcess: {
        ...defaultConfig.postProcess,
        bloomIntensity: 0.4,
        contrast: 0.9,
        saturation: 0.8,
        vignetteStrength: 0.5
      },
      visual: {
        ...defaultConfig.visual,
        backgroundColor: [0.02, 0.05, 0.1, 1.0]
      }
    },
    tags: ['deep', 'mysterious', 'dark'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'aurora-flow',
    name: 'Aurora Flow',
    description: '极光流动效果，绚丽多彩',
    config: {
      ...defaultConfig,
      particle: {
        ...defaultConfig.particle,
        particleCount: 6000,
        colorScheme: 'aurora'
      },
      postProcess: {
        ...defaultConfig.postProcess,
        bloomIntensity: 1.0,
        contrast: 1.2,
        saturation: 1.5,
        colorTemperature: 5500
      }
    },
    tags: ['aurora', 'colorful', 'flowing'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'minimal-zen',
    name: 'Minimal Zen',
    description: '极简禅意效果，简洁优雅',
    config: {
      ...defaultConfig,
      particle: {
        ...defaultConfig.particle,
        particleCount: 1500,
        colorScheme: 'monochrome'
      },
      postProcess: {
        ...defaultConfig.postProcess,
        bloomEnabled: false,
        contrast: 0.8,
        saturation: 0.5,
        vignetteStrength: 0.2
      },
      visual: {
        ...defaultConfig.visual,
        backgroundColor: [0.95, 0.95, 0.95, 1.0]
      }
    },
    tags: ['minimal', 'zen', 'simple'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
