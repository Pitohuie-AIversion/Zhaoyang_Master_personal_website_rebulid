import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ParticleSystem, defaultParticleConfig } from '../../utils/particleSystem';
import { ParticleRenderer, defaultRenderConfig } from '../../utils/particleRenderer';
import { InteractionController } from '../../utils/interactionController';
import { ParticleFieldConfig } from '../../utils/configManager';
import { useTranslation } from '../../hooks/useTranslation';

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
}

export const ParticleField = React.forwardRef<HTMLCanvasElement, ParticleFieldProps>(({
  config,
  className = '',
  onPerformanceUpdate
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();
  
  // 系统组件引用
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const rendererRef = useRef<ParticleRenderer | null>(null);
  const interactionControllerRef = useRef<InteractionController | null>(null);
  
  // 渲染循环控制
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  
  // 状态
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeParticleSystem = useCallback(async () => {
    if (!canvasRef.current) return false;

    try {
      setLoading(true);
      setError(null);

      const canvas = canvasRef.current;
      
      // 设置画布尺寸
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const gl = canvas.getContext('webgl2');
      if (!gl) {
        throw new Error('WebGL2 not supported');
      }

      console.log('Initializing particle system with canvas size:', canvas.width, 'x', canvas.height);

      // 使用 config.particle 或默认配置
      const particleConfig = config?.particle || defaultParticleConfig;
      
      // 创建粒子系统
      const bounds = { width: canvas.width, height: canvas.height };
      particleSystemRef.current = new ParticleSystem(particleConfig, bounds);
      
      // 创建渲染器
      rendererRef.current = new ParticleRenderer(gl, particleSystemRef.current, defaultRenderConfig);
      
      // 创建交互控制器
      const interactionConfig = config?.interaction || {
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
      };
      interactionControllerRef.current = new InteractionController(canvas, interactionConfig);

      console.log('Particle system initialized successfully');
      setLoading(false);
      setIsInitialized(true);
      return true;
    } catch (err) {
      console.error('Failed to initialize particle system:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      return false;
    }
  }, [config]);

  const renderFrame = useCallback((currentTime: number) => {
    if (!particleSystemRef.current || !rendererRef.current || !interactionControllerRef.current) {
      return;
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    try {
      // 更新交互控制器
      interactionControllerRef.current.update(deltaTime);
      
      // 获取鼠标位置并传递给粒子系统
      const mouseState = interactionControllerRef.current.getState();
      if (mouseState && particleSystemRef.current) {
        particleSystemRef.current.setMousePosition(mouseState.mousePosition.x, mouseState.mousePosition.y);
      }

      // 更新粒子系统
      particleSystemRef.current.update(deltaTime);

      // 渲染
      rendererRef.current.render(currentTime * 0.001);

      // 性能监控
      if (Math.random() < 0.01 && onPerformanceUpdate && particleSystemRef.current && rendererRef.current) { // 1% 概率输出调试信息
        const particleCount = particleSystemRef.current.getParticleCount();
        const fps = rendererRef.current.getFPS();
        
        console.debug('Particle system status:', {
          particleCount,
          fps,
          mousePosition: mouseState?.mousePosition,
          isRunning: true
        });

        onPerformanceUpdate({
          fps,
          frameTime: deltaTime * 1000,
          averageFps: fps,
          minFps: fps,
          maxFps: fps,
          particleCount,
          drawCalls: 1,
          memoryUsage: 0, // 可以后续添加内存监控
          renderTime: deltaTime * 1000
        });
      }
    } catch (error) {
      console.error('Error in render frame:', error);
    }

    animationFrameRef.current = requestAnimationFrame(renderFrame);
  }, [onPerformanceUpdate]);

  const startAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  }, [renderFrame]);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const handleResize = useCallback(() => {
    if (!canvasRef.current || !rendererRef.current || !particleSystemRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    rendererRef.current.resize(canvas.width, canvas.height);
    particleSystemRef.current.resize(canvas.width, canvas.height);
  }, []);

  // 初始化效果
  useEffect(() => {
    const init = async () => {
      const success = await initializeParticleSystem();
      if (success) {
        startAnimation();
      }
    };
    
    init();

    return () => {
      stopAnimation();
    };
  }, [initializeParticleSystem, startAnimation, stopAnimation]);

  // 窗口大小变化处理
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // 配置变化处理
  useEffect(() => {
    if (particleSystemRef.current && isInitialized && config?.particle) {
      particleSystemRef.current.updateConfig(config.particle);
    }
  }, [config, isInitialized]);

  // 清理效果
  useEffect(() => {
    return () => {
      try {
        stopAnimation();
        
        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current = null;
        }
        
        if (particleSystemRef.current) {
          particleSystemRef.current.dispose();
          particleSystemRef.current = null;
        }
        
        if (interactionControllerRef.current) {
          interactionControllerRef.current.dispose();
          interactionControllerRef.current = null;
        }
      } catch (error) {
        console.error('Error during ParticleField cleanup:', error);
      }
    };
  }, [stopAnimation]);

  if (error) {
    return (
      <div className={`particle-field-error ${className}`}>
        <div className="error-message">
          <h3>WebGL Error</h3>
          <p>{error}</p>
          <p>Please make sure your browser supports WebGL 2.0</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`particle-field ${className}`}>
      <canvas
        ref={ref || canvasRef}
        className="particle-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">{t('common.loading')}</div>
        </div>
      )}
    </div>
  );
});

ParticleField.displayName = 'ParticleField';

export default ParticleField;