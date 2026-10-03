import { PerformanceMetrics, DeviceCapabilities } from './types';

export interface PerformanceAnalysisResult {
  isStable: boolean;
  bottleneck: 'cpu' | 'gpu' | 'memory' | 'none';
  recommendation: string;
}

export const analyzePerformance = (
  metrics: PerformanceMetrics,
  minFps: number
): PerformanceAnalysisResult => {
  const { averageFps, frameTime, memoryUsage } = metrics;

  let bottleneck: 'cpu' | 'gpu' | 'memory' | 'none' = 'none';
  let recommendation = 'Performance is optimal';
  let isStable = true;

  if (averageFps < minFps) {
    isStable = false;

    if (memoryUsage > 100) {
      bottleneck = 'memory';
      recommendation = 'High memory usage detected. Consider reducing particle count or optimizing memory usage.';
    } else if (frameTime > 20) {
      bottleneck = 'cpu';
      recommendation = 'High CPU usage detected. Consider reducing particle count or computation complexity.';
    } else {
      bottleneck = 'gpu';
      recommendation = 'GPU bottleneck detected. Consider reducing visual effects or particle count.';
    }
  }

  return {
    isStable,
    bottleneck,
    recommendation
  };
};

export const exportPerformanceReport = (
  metrics: PerformanceMetrics,
  analysis: PerformanceAnalysisResult,
  deviceCapabilities: DeviceCapabilities | null,
  fpsHistory: number[],
  frameTimeHistory: number[]
): string => {
  const report = {
    timestamp: new Date().toISOString(),
    metrics,
    analysis,
    deviceCapabilities,
    frameHistory: {
      fps: fpsHistory.slice(-30),
      frameTime: frameTimeHistory.slice(-30)
    }
  };

  return JSON.stringify(report, null, 2);
};
