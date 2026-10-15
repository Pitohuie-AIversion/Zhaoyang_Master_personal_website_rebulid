import { ParticleSystemConfig } from '../particleSystem';
import { PostProcessConfig } from '../postProcessor';
import { InteractionConfig } from '../interactionController';

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
