import { useRef, useState, useCallback, useEffect } from 'react';
import { ParticleSystem, defaultParticleConfig } from '../../../utils/particleSystem';
import { ParticleRenderer, defaultRenderConfig } from '../../../utils/particleRenderer';
import { InteractionController } from '../../../utils/interactionController';
import type { ParticleFieldConfig } from '../../../utils/configManager';

interface UseParticleFieldInitOptions {
  config?: ParticleFieldConfig;
  stopAnimation?: () => void;
}

export const useParticleFieldInit = ({
  config,
  stopAnimation,
}: UseParticleFieldInitOptions = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialConfigRef = useRef(config);

  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const rendererRef = useRef<ParticleRenderer | null>(null);
  const interactionControllerRef = useRef<InteractionController | null>(null);

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
      const initialConfig = initialConfigRef.current;
      const particleConfig = initialConfig?.particle || defaultParticleConfig;

      // 创建粒子系统
      const bounds = { width: canvas.width, height: canvas.height };
      particleSystemRef.current = new ParticleSystem(particleConfig, bounds);

      // 创建渲染器
      rendererRef.current = new ParticleRenderer(gl, particleSystemRef.current, defaultRenderConfig);

      // 创建交互控制器
      const interactionConfig = initialConfig?.interaction || {
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
        enabled: true,
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
      await initializeParticleSystem();
    };

    init();

    return () => {
      stopAnimation?.();
    };
  }, [initializeParticleSystem, stopAnimation]);

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

    if (interactionControllerRef.current && isInitialized && config?.interaction) {
      interactionControllerRef.current.updateConfig(config.interaction);
    }
  }, [config, isInitialized]);

  // 清理效果
  useEffect(() => {
    return () => {
      try {
        stopAnimation?.();

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
      } catch (err) {
        console.error('Error during ParticleField cleanup:', err);
      }
    };
  }, [stopAnimation]);

  return {
    canvasRef,
    particleSystemRef,
    rendererRef,
    interactionControllerRef,
    isInitialized,
    loading,
    error,
  };
};
