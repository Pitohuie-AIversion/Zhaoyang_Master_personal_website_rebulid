import React from 'react';
import { RotateCcw, Upload, Download, Monitor } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { PerformanceMetrics } from '../../../utils/performanceMonitor';

export interface ControlPanelFooterProps {
  onReset: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  metrics?: PerformanceMetrics;
}

export const ControlPanelFooter: React.FC<ControlPanelFooterProps> = ({
  onReset,
  onImport,
  onExport,
  metrics,
}) => {
  const { t } = useTranslation();

  return (
    <div className="border-t border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            {t('particleField.settings.reset')}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm cursor-pointer transition-colors">
            <Upload className="w-4 h-4 inline mr-1" />
            {t('particleField.settings.import')}
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>

          <button
            onClick={onExport}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
          >
            <Download className="w-4 h-4 inline mr-1" />
            {t('particleField.settings.export')}
          </button>
        </div>
      </div>

      {/* 性能指标 */}
      {metrics && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>
                FPS:{' '}
                <span className={metrics.fps < 30 ? 'text-red-400' : 'text-green-400'}>
                  {Math.round(metrics.fps)}
                </span>
              </span>
              <span>
                {t('particleField.particles')}: {metrics.particleCount.toLocaleString()}
              </span>
              <span>
                {t('particleField.memory')}: {metrics.memoryUsage.toFixed(1)}MB
              </span>
            </div>
            <Monitor className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};
