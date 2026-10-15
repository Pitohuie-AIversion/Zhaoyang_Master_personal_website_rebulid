import { useRef, useCallback, useEffect } from 'react';
import type { ParticleSystem } from '../../../utils/particleSystem';
import type { ParticleRenderer } from '../../../utils/particleRenderer';
import type { InteractionController } from '../../../utils/interactionController';
import type { PerformanceMetrics } from './types';

interface UseParticleRenderLoopOptions {
  particleSystemRef: React.MutableRefObject<ParticleSystem | null>;
  rendererRef: React.MutableRefObject<ParticleRenderer | null>;
  interactionControllerRef: React.MutableRefObject<InteractionController | null>;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
  autoStart?: boolean;
  isPlaying?: boolean;
  isInitialized: boolean;
}

export const useParticleRenderLoop = ({
  particleSystemRef,
  rendererRef,
  interactionControllerRef,
  onPerformanceUpdate,
  autoStart = true,
  isPlaying,
  isInitialized,
}: UseParticleRenderLoopOptions) => {
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

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
      if (Math.random() < 0.01 && onPerformanceUpdate && particleSystemRef.current && rendererRef.current) {
        const particleCount = particleSystemRef.current.getParticleCount();
        const fps = rendererRef.current.getFPS();

        console.debug('Particle system status:', {
          particleCount,
          fps,
          mousePosition: mouseState?.mousePosition,
          isRunning: true,
        });

        onPerformanceUpdate({
          fps,
          frameTime: deltaTime * 1000,
          averageFps: fps,
          minFps: fps,
          maxFps: fps,
          particleCount,
          drawCalls: 1,
          memoryUsage: 0,
          renderTime: deltaTime * 1000,
        });
      }
    } catch (error) {
      console.error('Error in render frame:', error);
    }

    animationFrameRef.current = requestAnimationFrame(renderFrame);
  }, [interactionControllerRef, onPerformanceUpdate, particleSystemRef, rendererRef]);

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

  useEffect(() => {
    if (!isInitialized) return;

    if (isPlaying ?? autoStart) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [autoStart, isInitialized, isPlaying, startAnimation, stopAnimation]);

  return {
    startAnimation,
    stopAnimation,
  };
};
