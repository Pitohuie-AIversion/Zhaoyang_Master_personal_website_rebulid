import { useEffect, useRef } from 'react';
import type { Particle } from './types';
import {
  createParticles,
  updateParticles,
  drawParticle,
  drawConnections,
} from './particlePhysics';

export const useAnimatedParticles = (isDark: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particlesRef.current = createParticles(canvas.width, canvas.height, isDark);
    };

    const renderFrame = (shouldAdvance: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (shouldAdvance) updateParticles(particlesRef.current, canvas.width, canvas.height);
      drawConnections(ctx, particlesRef.current, isDark);
      particlesRef.current.forEach((particle) => drawParticle(ctx, particle, isDark));
    };

    const stopAnimation = () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };

    const animate = () => {
      renderFrame(true);
      animationRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      stopAnimation();

      if (document.hidden || prefersReducedMotion) {
        renderFrame(false);
        return;
      }

      animate();
    };

    resizeCanvas();
    initParticles();
    startAnimation();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
      startAnimation();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      startAnimation();
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      stopAnimation();
    };
  }, [isDark]);

  return { canvasRef };
};
