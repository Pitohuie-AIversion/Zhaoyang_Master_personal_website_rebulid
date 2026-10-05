import React from 'react';
import { PerformanceMetrics } from '../../../utils/performanceMonitor';
import { useTranslation } from '../../common/TranslationProvider';

export interface ParticleDemoStatsPanelProps {
  show: boolean;
  metrics: PerformanceMetrics | null;
}

export const ParticleDemoStatsPanel: React.FC<ParticleDemoStatsPanelProps> = ({
  show,
  metrics,
}) => {
  const { t } = useTranslation();

  if (!show || !metrics) return null;

  return (
    <div className="absolute bottom-20 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-white text-sm min-w-[200px]">
      <h4 className="font-semibold mb-2">{t('particleField.performanceStats')}</h4>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>{t('particleField.performance.fps') as string}:</span>
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
        <div className="flex justify-between">
          <span>{t('particleField.avgFps')}:</span>
          <span>{Math.round(metrics.averageFps)}</span>
        </div>
      </div>
    </div>
  );
};
