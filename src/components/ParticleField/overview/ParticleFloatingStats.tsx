import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import type { PerformanceMetrics } from '../../../utils/performanceMonitor';

interface ParticleFloatingStatsProps {
  metrics: PerformanceMetrics;
}

export const ParticleFloatingStats: React.FC<ParticleFloatingStatsProps> = ({ metrics }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-white text-sm min-w-[200px]">
      <h4 className="font-semibold mb-2">{t('particleField.performanceStats')}</h4>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span
            className={
              metrics.fps < 30
                ? 'text-red-400'
                : metrics.fps < 50
                ? 'text-yellow-400'
                : 'text-green-400'
            }
          >
            {Math.round(metrics.fps)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>{t('particleField.particles')}:</span>
          <span>{metrics.particleCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('particleField.frameTime')}:</span>
          <span>{metrics.frameTime.toFixed(1)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>{t('particleField.memory')}:</span>
          <span>{metrics.memoryUsage.toFixed(1)}MB</span>
        </div>
      </div>
    </div>
  );
};
