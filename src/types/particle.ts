/**
 * 粒子场与图形渲染领域类型定义
 */

export type ParticleColorScheme = 
  | 'ocean' 
  | 'fire' 
  | 'electric' 
  | 'cosmic' 
  | 'storm' 
  | 'abyss' 
  | 'aurora' 
  | 'monochrome';

export type ParticlePerformanceLevel = 'low' | 'medium' | 'high';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFps: number;
  minFps: number;
  maxFps: number;
  particleCount: number;
  drawCalls: number;
  memoryUsage: number;
  gpuMemoryUsage?: number;
}

export interface DeviceCapabilities {
  webgl2Supported: boolean;
  maxTextureSize: number;
  maxVertexAttributes: number;
  maxFragmentUniforms: number;
  maxVertexUniforms: number;
  maxVaryingVectors: number;
  maxRenderBufferSize: number;
  extensions: string[];
  vendor: string;
  renderer: string;
  version: string;
  shadingLanguageVersion: string;
}
