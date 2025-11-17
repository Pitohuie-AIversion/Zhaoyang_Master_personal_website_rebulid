import { ParticleSystemConfig } from './particleSystem';
import { PostProcessConfig } from './postProcessor';
import { InteractionConfig } from './interactionController';
import { PerformancePreset } from './performanceMonitor';

export interface ParticleFieldConfig {
  particle: ParticleSystemConfig;
  postProcess: PostProcessConfig;
  interaction: InteractionConfig;
  performance: {
    preset: string;
    adaptiveQuality: boolean;
    targetFps: number;
  };
  visual: {
    backgroundColor: [number, number, number, number];
    cameraDistance: number;
    fieldOfView: number;
    enableStats: boolean;
  };
}

export interface ConfigPreset {
  id: string;
  name: string;
  description: string;
  config: ParticleFieldConfig;
  thumbnail?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isCustom?: boolean;
}

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

export class ConfigManager {
  private currentConfig: ParticleFieldConfig;
  private customPresets: ConfigPreset[] = [];
  private storageKey = 'particle-field-config';
  private presetsKey = 'particle-field-presets';
  
  constructor(initialConfig: ParticleFieldConfig = defaultConfig) {
    this.currentConfig = { ...initialConfig };
    this.loadFromStorage();
  }
  
  getCurrentConfig(): ParticleFieldConfig {
    return { ...this.currentConfig };
  }
  
  updateConfig(updates: Partial<ParticleFieldConfig>): void {
    this.currentConfig = {
      ...this.currentConfig,
      ...updates,
      particle: { ...this.currentConfig.particle, ...updates.particle },
      postProcess: { ...this.currentConfig.postProcess, ...updates.postProcess },
      interaction: { ...this.currentConfig.interaction, ...updates.interaction },
      performance: { ...this.currentConfig.performance, ...updates.performance },
      visual: { ...this.currentConfig.visual, ...updates.visual }
    };
    this.saveToStorage();
  }
  
  updateParticleConfig(updates: Partial<ParticleSystemConfig>): void {
    this.currentConfig.particle = { ...this.currentConfig.particle, ...updates };
    this.saveToStorage();
  }
  
  updatePostProcessConfig(updates: Partial<PostProcessConfig>): void {
    this.currentConfig.postProcess = { ...this.currentConfig.postProcess, ...updates };
    this.saveToStorage();
  }
  
  updateInteractionConfig(updates: Partial<InteractionConfig>): void {
    this.currentConfig.interaction = { ...this.currentConfig.interaction, ...updates };
    this.saveToStorage();
  }
  
  applyPreset(presetId: string): boolean {
    const preset = this.getPreset(presetId);
    if (preset) {
      this.currentConfig = { ...preset.config };
      this.saveToStorage();
      return true;
    }
    return false;
  }
  
  applyPerformancePreset(preset: PerformancePreset): void {
    const updates: Partial<ParticleFieldConfig> = {
      particle: {
        ...this.currentConfig.particle,
        particleCount: preset.particleCount
      },
      postProcess: {
        ...this.currentConfig.postProcess,
        bloomEnabled: preset.bloomEnabled
      },
      performance: {
        ...this.currentConfig.performance,
        preset: preset.name.toLowerCase()
      }
    };
    
    this.updateConfig(updates);
  }
  
  createPreset(name: string, description: string, tags: string[] = []): ConfigPreset {
    const preset: ConfigPreset = {
      id: `custom-${Date.now()}`,
      name,
      description,
      config: { ...this.currentConfig },
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    this.customPresets.push(preset);
    this.savePresetsToStorage();
    return preset;
  }
  
  saveCustomPreset(newPreset: ConfigPreset): void {
    this.customPresets.push(newPreset);
    this.savePresetsToStorage();
  }
  
  updatePreset(presetId: string, updates: Partial<Omit<ConfigPreset, 'id' | 'createdAt'>>): boolean {
    const index = this.customPresets.findIndex(p => p.id === presetId);
    if (index !== -1) {
      this.customPresets[index] = {
        ...this.customPresets[index],
        ...updates,
        updatedAt: Date.now()
      };
      this.savePresetsToStorage();
      return true;
    }
    return false;
  }

  updateCustomPreset(presetId: string, preset: ConfigPreset): boolean {
    return this.updatePreset(presetId, preset);
  }

  deleteCustomPreset(presetId: string): boolean {
    return this.deletePreset(presetId);
  }
  
  deletePreset(presetId: string): boolean {
    const index = this.customPresets.findIndex(p => p.id === presetId);
    if (index !== -1) {
      this.customPresets.splice(index, 1);
      this.savePresetsToStorage();
      return true;
    }
    return false;
  }
  
  getPreset(presetId: string): ConfigPreset | null {
    // 先查找内置预设
    const builtinPreset = builtinPresets.find(p => p.id === presetId);
    if (builtinPreset) return builtinPreset;
    
    // 再查找自定义预设
    const customPreset = this.customPresets.find(p => p.id === presetId);
    return customPreset || null;
  }
  
  getAllPresets(): ConfigPreset[] {
    return [...builtinPresets, ...this.customPresets];
  }
  
  getCustomPresets(): ConfigPreset[] {
    return [...this.customPresets];
  }
  
  getBuiltinPresets(): ConfigPreset[] {
    return [...builtinPresets];
  }
  
  searchPresets(query: string, tags?: string[]): ConfigPreset[] {
    const allPresets = this.getAllPresets();
    const queryLower = query.toLowerCase();
    
    return allPresets.filter(preset => {
      const matchesQuery = !query || 
        preset.name.toLowerCase().includes(queryLower) ||
        preset.description.toLowerCase().includes(queryLower);
      
      const matchesTags = !tags || tags.length === 0 ||
        tags.some(tag => preset.tags.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  }
  
  exportConfig(): string {
    return JSON.stringify({
      config: this.currentConfig,
      customPresets: this.customPresets,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }
  
  importConfig(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.config) {
        this.currentConfig = this.validateConfig(data.config);
      }
      
      if (data.customPresets && Array.isArray(data.customPresets)) {
        this.customPresets = data.customPresets.filter(this.validatePreset);
      }
      
      this.saveToStorage();
      this.savePresetsToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }
  
  resetToDefault(): void {
    this.currentConfig = { ...defaultConfig };
    this.saveToStorage();
  }
  
  private validateConfig(config: unknown): ParticleFieldConfig {
    const typedConfig = config as ParticleFieldConfig;
    // 简单的配置验证，确保必要的字段存在
    return {
      particle: { ...defaultConfig.particle, ...(typedConfig.particle || {}) },
      postProcess: { ...defaultConfig.postProcess, ...(typedConfig.postProcess || {}) },
      interaction: { ...defaultConfig.interaction, ...(typedConfig.interaction || {}) },
      performance: { ...defaultConfig.performance, ...(typedConfig.performance || {}) },
      visual: { ...defaultConfig.visual, ...(typedConfig.visual || {}) }
    };
  }
  
  private validatePreset(preset: Record<string, unknown>): boolean {
    return preset && 
           typeof preset.id === 'string' &&
           typeof preset.name === 'string' &&
           preset.config &&
           Array.isArray(preset.tags);
  }
  
  private deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge((target[key] as Record<string, unknown>) || {}, source[key] as Record<string, unknown>);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentConfig));
    } catch (error) {
      console.warn('Failed to save config to localStorage:', error);
    }
  }
  
  private savePresetsToStorage(): void {
    try {
      localStorage.setItem(this.presetsKey, JSON.stringify(this.customPresets));
    } catch (error) {
      console.warn('Failed to save presets to localStorage:', error);
    }
  }
  
  private loadFromStorage(): void {
    try {
      const savedConfig = localStorage.getItem(this.storageKey);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.currentConfig = this.validateConfig(config);
      }
      
      const savedPresets = localStorage.getItem(this.presetsKey);
      if (savedPresets) {
        const presets = JSON.parse(savedPresets);
        if (Array.isArray(presets)) {
          this.customPresets = presets.filter(this.validatePreset);
        }
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error);
    }
  }
}