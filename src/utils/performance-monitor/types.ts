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

export interface PerformancePreset {
  name: string;
  particleCount: number;
  maxParticles: number;
  quality: 'low' | 'medium' | 'high';
  postProcessing: boolean;
  bloomEnabled: boolean;
  noiseComplexity: number;
  updateFrequency: number;
}

export const performancePresets: Record<string, PerformancePreset> = {
  low: {
    name: 'Low',
    particleCount: 1000,
    maxParticles: 1000,
    quality: 'low',
    postProcessing: false,
    bloomEnabled: false,
    noiseComplexity: 1,
    updateFrequency: 30
  },
  medium: {
    name: 'Medium',
    particleCount: 5000,
    maxParticles: 5000,
    quality: 'medium',
    postProcessing: true,
    bloomEnabled: false,
    noiseComplexity: 2,
    updateFrequency: 60
  },
  high: {
    name: 'High',
    particleCount: 10000,
    maxParticles: 10000,
    quality: 'high',
    postProcessing: true,
    bloomEnabled: true,
    noiseComplexity: 3,
    updateFrequency: 60
  },
  ultra: {
    name: 'Ultra',
    particleCount: 20000,
    maxParticles: 20000,
    quality: 'high',
    postProcessing: true,
    bloomEnabled: true,
    noiseComplexity: 4,
    updateFrequency: 60
  }
};
