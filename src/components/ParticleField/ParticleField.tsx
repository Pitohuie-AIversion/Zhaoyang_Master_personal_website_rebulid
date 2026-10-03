import React, { useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  type PerformanceMetrics,
  type ParticleFieldProps,
  useParticleFieldInit,
  useParticleRenderLoop,
} from './canvas-core';

export type { PerformanceMetrics, ParticleFieldProps };

export const ParticleField = React.forwardRef<HTMLCanvasElement, ParticleFieldProps>(({
  config,
  className = '',
  onPerformanceUpdate,
  autoStart = true,
  isPlaying,
}, ref) => {
  const { t } = useTranslation();

  const {
    canvasRef,
    particleSystemRef,
    rendererRef,
    interactionControllerRef,
    isInitialized,
    loading,
    error,
  } = useParticleFieldInit({ config });

  useParticleRenderLoop({
    particleSystemRef,
    rendererRef,
    interactionControllerRef,
    onPerformanceUpdate,
    autoStart,
    isPlaying,
    isInitialized,
  });

  const setCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
    canvasRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [canvasRef, ref]);

  if (error) {
    return (
      <div className={`particle-field-error ${className}`}>
        <div className="error-message">
          <h3>{t('particleField.status.error') as string}</h3>
          <p>{error}</p>
          <p>{t('particleField.messages.webglNotSupported') as string}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`particle-field ${className}`}>
      <canvas
        ref={setCanvasRef}
        className="particle-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
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
