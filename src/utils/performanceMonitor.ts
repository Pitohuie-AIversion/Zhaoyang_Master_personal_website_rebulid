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
    const capabilities: DeviceCapabilities = {
      webgl2Supported: true,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
      maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
      maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      extensions: gl.getSupportedExtensions() || [],
      vendor: gl.getParameter(gl.VENDOR) || 'Unknown',
      renderer: gl.getParameter(gl.RENDERER) || 'Unknown',
      version: gl.getParameter(gl.VERSION) || 'Unknown',
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || 'Unknown'
    };
    
    this.deviceCapabilities = capabilities;
    return capabilities;
  }
  
  getRecommendedPreset(): PerformancePreset {
    if (!this.deviceCapabilities) {
      return performancePresets.medium;
    }
    
    const { renderer, maxTextureSize } = this.deviceCapabilities;
    const rendererLower = renderer.toLowerCase();
    
    // 检测移动设备
    const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
    
    // 检测集成显卡
    const isIntegratedGPU = /intel|integrated|uhd|iris/i.test(rendererLower);
    
    // 检测高端显卡
    const isHighEndGPU = /rtx|gtx|radeon rx|vega|rdna/i.test(rendererLower);
    
    if (isMobile || maxTextureSize < 4096) {
      return performancePresets.low;
    } else if (isIntegratedGPU || maxTextureSize < 8192) {
      return performancePresets.medium;
    } else if (isHighEndGPU && maxTextureSize >= 16384) {
      return performancePresets.ultra;
    } else {
      return performancePresets.high;
    }
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
    const averageFps = this.fpsHistory.reduce((sum, f) => sum + f, 0) / this.fpsHistory.length;
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
    // 冷却时间检查
    if (currentTime - this.lastQualityAdjustment < this.qualityAdjustmentCooldown) {
      return;
    }
    
    const { averageFps, minFps } = this.currentMetrics;
    
    // 如果平均 FPS 低于目标，降低质量
    if (averageFps < this.minFps || minFps < this.minFps * 0.8) {
      this.onQualityAdjustmentNeeded('decrease');
      this.lastQualityAdjustment = currentTime;
      this.qualityAdjustmentCooldown = 3000; // 3秒冷却
    }
    // 如果性能良好，可以尝试提高质量
    else if (averageFps > this.targetFps * 1.2 && minFps > this.targetFps) {
      this.onQualityAdjustmentNeeded('increase');
      this.lastQualityAdjustment = currentTime;
      this.qualityAdjustmentCooldown = 5000; // 5秒冷却
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
  
  // 性能分析工具
  analyzePerformance(): {
    isStable: boolean;
    bottleneck: 'cpu' | 'gpu' | 'memory' | 'none';
    recommendation: string;
  } {
    const { averageFps, frameTime, memoryUsage } = this.currentMetrics;
    
    let bottleneck: 'cpu' | 'gpu' | 'memory' | 'none' = 'none';
    let recommendation = 'Performance is optimal';
    let isStable = true;
    
    // 检测性能瓶颈
    if (averageFps < this.minFps) {
      isStable = false;
      
      if (memoryUsage > 100) { // 100MB
        bottleneck = 'memory';
        recommendation = 'High memory usage detected. Consider reducing particle count or optimizing memory usage.';
      } else if (frameTime > 20) { // 20ms
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
  }
  
  // 导出性能报告
  exportReport(): string {
    const analysis = this.analyzePerformance();
    const capabilities = this.deviceCapabilities;
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.currentMetrics,
      analysis,
      deviceCapabilities: capabilities,
      frameHistory: {
        fps: this.fpsHistory.slice(-30), // 最近30帧
        frameTime: this.frameTimeHistory.slice(-30)
      }
    };
    
    return JSON.stringify(report, null, 2);
  }
}