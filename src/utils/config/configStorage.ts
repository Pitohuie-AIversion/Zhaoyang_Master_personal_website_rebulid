import { ParticleFieldConfig, ConfigPreset } from './types';
import { defaultConfig } from './defaultConfig';

export const STORAGE_KEY = 'particle-field-config';
export const PRESETS_KEY = 'particle-field-presets';

export function validateConfig(config: unknown): ParticleFieldConfig {
  const typedConfig = (config || {}) as Partial<ParticleFieldConfig>;
  return {
    particle: { ...defaultConfig.particle, ...(typedConfig.particle || {}) },
    postProcess: { ...defaultConfig.postProcess, ...(typedConfig.postProcess || {}) },
    interaction: { ...defaultConfig.interaction, ...(typedConfig.interaction || {}) },
    performance: { ...defaultConfig.performance, ...(typedConfig.performance || {}) },
    visual: { ...defaultConfig.visual, ...(typedConfig.visual || {}) }
  };
}

export function validatePreset(preset: unknown): boolean {
  const p = preset as Record<string, unknown> | null;
  return Boolean(
    p &&
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    p.config &&
    Array.isArray(p.tags)
  );
}

export function loadConfigFromStorage(storageKey: string = STORAGE_KEY): ParticleFieldConfig | null {
  try {
    const savedConfig = localStorage.getItem(storageKey);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      return validateConfig(config);
    }
  } catch (error) {
    console.warn('Failed to load config from localStorage:', error);
  }
  return null;
}

export function saveConfigToStorage(config: ParticleFieldConfig, storageKey: string = STORAGE_KEY): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save config to localStorage:', error);
  }
}

export function loadPresetsFromStorage(presetsKey: string = PRESETS_KEY): ConfigPreset[] {
  try {
    const savedPresets = localStorage.getItem(presetsKey);
    if (savedPresets) {
      const presets = JSON.parse(savedPresets);
      if (Array.isArray(presets)) {
        return presets.filter(validatePreset);
      }
    }
  } catch (error) {
    console.warn('Failed to load presets from localStorage:', error);
  }
  return [];
}

export function savePresetsToStorage(presets: ConfigPreset[], presetsKey: string = PRESETS_KEY): void {
  try {
    localStorage.setItem(presetsKey, JSON.stringify(presets));
  } catch (error) {
    console.warn('Failed to save presets to localStorage:', error);
  }
}
