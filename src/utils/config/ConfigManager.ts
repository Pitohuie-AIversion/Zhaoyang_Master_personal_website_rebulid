import { ParticleSystemConfig } from '../particleSystem';
import { PostProcessConfig } from '../postProcessor';
import { InteractionConfig } from '../interactionController';
import { PerformancePreset } from '../performanceMonitor';
import { ParticleFieldConfig, ConfigPreset } from './types';
import { defaultConfig } from './defaultConfig';
import { builtinPresets } from './builtinPresets';
import {
  STORAGE_KEY,
  PRESETS_KEY,
  validateConfig,
  validatePreset,
  loadConfigFromStorage,
  saveConfigToStorage,
  loadPresetsFromStorage,
  savePresetsToStorage
} from './configStorage';

export class ConfigManager {
  private currentConfig: ParticleFieldConfig;
  private customPresets: ConfigPreset[] = [];
  private storageKey = STORAGE_KEY;
  private presetsKey = PRESETS_KEY;

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
    const builtinPreset = builtinPresets.find(p => p.id === presetId);
    if (builtinPreset) return builtinPreset;

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
        this.currentConfig = validateConfig(data.config);
      }

      if (data.customPresets && Array.isArray(data.customPresets)) {
        this.customPresets = data.customPresets.filter(validatePreset);
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

  private saveToStorage(): void {
    saveConfigToStorage(this.currentConfig, this.storageKey);
  }

  private savePresetsToStorage(): void {
    savePresetsToStorage(this.customPresets, this.presetsKey);
  }

  private loadFromStorage(): void {
    const loadedConfig = loadConfigFromStorage(this.storageKey);
    if (loadedConfig) {
      this.currentConfig = loadedConfig;
    }

    const loadedPresets = loadPresetsFromStorage(this.presetsKey);
    if (loadedPresets.length > 0) {
      this.customPresets = loadedPresets;
    }
  }
}
