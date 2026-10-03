import type { ParticleFieldConfig } from '../../../utils/configManager';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFps: number;
  minFps: number;
  maxFps: number;
  particleCount: number;
  drawCalls: number;
  memoryUsage: number;
  renderTime?: number;
}

export interface ParticleFieldProps {
  config?: ParticleFieldConfig;
  className?: string;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
  onConfigChange?: (config: ParticleFieldConfig) => void;
  enableControls?: boolean;
  autoStart?: boolean;
  isPlaying?: boolean;
}
