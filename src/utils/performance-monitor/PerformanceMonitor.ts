import {
  DeviceCapabilities,
  PerformanceMetrics,
  PerformancePreset
} from './types';
import { detectDeviceCapabilities, getRecommendedPreset } from './deviceDetector';
import {
  analyzePerformance,
  exportPerformanceReport,
  PerformanceAnalysisResult
} from './performanceAnalyzer';

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private frameTimeHistory: number[] = [];
  private fpsHistory: number[] = [];
  private maxHistoryLength = 60;

  private currentMetrics: PerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    averageFps: 0,
    minFps: Infinity,
    maxFps: 0,
    particleCount: 0,
    drawCalls: 0,
    memoryUsage: 0
  };

  private deviceCapabilities: DeviceCapabilities | null = null;
  private adaptiveQuality = true;
  private targetFps = 60;
  private minFps = 30;
  private qualityAdjustmentCooldown = 0;
  private lastQualityAdjustment = 0;

  constructor() {
    this.lastTime = performance.now();
  }

  detectDeviceCapabilities(gl: WebGL2RenderingContext): DeviceCapabilities {
    this.deviceCapabilities = detectDeviceCapabilities(gl);
    return this.deviceCapabilities;
  }

  getRecommendedPreset(): PerformancePreset {
    return getRecommendedPreset(this.deviceCapabilities);
  }

  update(deltaTime: number, particleCount: number, drawCalls: number): void {
    const currentTime = performance.now();
    this.frameCount++;

    // 计算帧时间和 FPS
    const frameTime = deltaTime;
    const fps = 1000 / frameTime;

    // 更新历史记录
    this.frameTimeHistory.push(frameTime);
    this.fpsHistory.push(fps);

    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift();
      this.fpsHistory.shift();
    }

    // 计算统计数据
    const averageFps =
      this.fpsHistory.reduce((sum, f) => sum + f, 0) / this.fpsHistory.length;
    const minFps = Math.min(...this.fpsHistory);
    const maxFps = Math.max(...this.fpsHistory);

    // 更新内存使用情况
    const memoryUsage = this.getMemoryUsage();

    this.currentMetrics = {
      fps,
      frameTime,
      averageFps,
      minFps,
      maxFps,
      particleCount,
      drawCalls,
      memoryUsage
    };

    // 自适应质量调整
    if (this.adaptiveQuality) {
      this.adjustQualityIfNeeded(currentTime);
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      return memory?.usedJSHeapSize / (1024 * 1024) || 0; // MB
    }
    return 0;
  }

  private adjustQualityIfNeeded(currentTime: number): void {
    if (currentTime - this.lastQualityAdjustment < this.qualityAdjustmentCooldown) {
      return;
    }

    const { averageFps, minFps } = this.currentMetrics;

    if (averageFps < this.minFps || minFps < this.minFps * 0.8) {
      this.onQualityAdjustmentNeeded('decrease');
      this.lastQualityAdjustment = currentTime;
      this.qualityAdjustmentCooldown = 3000;
    } else if (averageFps > this.targetFps * 1.2 && minFps > this.targetFps) {
      this.onQualityAdjustmentNeeded('increase');
      this.lastQualityAdjustment = currentTime;
      this.qualityAdjustmentCooldown = 5000;
    }
  }

  private onQualityAdjustmentNeeded: (direction: 'increase' | 'decrease') => void = () => {};

  setQualityAdjustmentCallback(callback: (direction: 'increase' | 'decrease') => void): void {
    this.onQualityAdjustmentNeeded = callback;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.currentMetrics };
  }

  getDeviceCapabilities(): DeviceCapabilities | null {
    return this.deviceCapabilities;
  }

  setAdaptiveQuality(enabled: boolean): void {
    this.adaptiveQuality = enabled;
  }

  setTargetFps(fps: number): void {
    this.targetFps = fps;
    this.minFps = fps * 0.5;
  }

  reset(): void {
    this.frameCount = 0;
    this.frameTimeHistory = [];
    this.fpsHistory = [];
    this.lastTime = performance.now();
    this.currentMetrics = {
      fps: 0,
      frameTime: 0,
      averageFps: 0,
      minFps: Infinity,
      maxFps: 0,
      particleCount: 0,
      drawCalls: 0,
      memoryUsage: 0
    };
  }

  analyzePerformance(): PerformanceAnalysisResult {
    return analyzePerformance(this.currentMetrics, this.minFps);
  }

  exportReport(): string {
    return exportPerformanceReport(
      this.currentMetrics,
      this.analyzePerformance(),
      this.deviceCapabilities,
      this.fpsHistory,
      this.frameTimeHistory
    );
  }
}
