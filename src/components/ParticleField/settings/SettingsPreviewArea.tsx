import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, Eye } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { ParticleField as ParticleFieldComponent } from '../ParticleField';
import type { ParticleFieldConfig } from '../../../utils/configManager';
import type { PerformanceMetrics } from '../../../utils/performanceMonitor';

interface SettingsPreviewAreaProps {
  showPreview: boolean;
  config: ParticleFieldConfig;
  isPlaying: boolean;
  onPerformanceUpdate: (metrics: PerformanceMetrics) => void;
  onTogglePlayback: () => void;
  onReset: () => void;
  onTogglePreview: () => void;
}

export const SettingsPreviewArea: React.FC<SettingsPreviewAreaProps> = ({
  showPreview,
  config,
  isPlaying,
  onPerformanceUpdate,
  onTogglePlayback,
  onReset,
  onTogglePreview,
}) => {
  const { t } = useTranslation();

  if (!showPreview) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('particleField.settings.previewHidden')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('particleField.settings.previewHiddenDesc')}
          </p>
          <button
            onClick={onTogglePreview}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {t('particleField.settings.showPreview')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[40dvh] flex-1 bg-black lg:min-h-0">
      {/* 粒子场预览 */}
      <ParticleFieldComponent
        className="w-full h-full"
        config={config}
        isPlaying={isPlaying}
        onPerformanceUpdate={onPerformanceUpdate}
        enableControls={false}
        autoStart={true}
      />

      {/* 预览控制覆盖层 */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={onTogglePlayback}
          className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-all duration-200"
          title={
            isPlaying
              ? (t('particleField.pause') as string)
              : (t('particleField.play') as string)
          }
          aria-label={
            isPlaying
              ? (t('particleField.pause') as string)
              : (t('particleField.play') as string)
          }
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={onReset}
          className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-all duration-200"
          title={t('particleField.reset') as string}
          aria-label={t('particleField.reset') as string}
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <Link
          to="/particle-field/demo"
          className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-all duration-200"
          title={t('particleField.demoMode') as string}
          aria-label={t('particleField.demoMode') as string}
        >
          <Play className="w-5 h-5" />
        </Link>
      </div>

      {/* 预览标签 */}
      <div className="absolute bottom-4 left-4">
        <div className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-lg text-white text-sm">
          {t('particleField.settings.livePreview')}
        </div>
      </div>
    </div>
  );
};
