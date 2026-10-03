import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../components/common/TranslationProvider';
import { ParticleFieldSettingsSEO } from '../components/seo/SEOOptimization';
import { ParticleField as ParticleFieldComponent } from '../components/ParticleField/ParticleField';
import { ControlPanel } from '../components/ParticleField/settings';
import {
  ParticleFieldConfig,
  defaultConfig,
  ConfigPreset,
} from '../utils/configManager';
import { PerformanceMetrics } from '../utils/performanceMonitor';

const ParticleFieldSettings: React.FC = () => {
  const { t } = useTranslation();

  const [config, setConfig] = useState<ParticleFieldConfig>(defaultConfig);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  const handleConfigChange = useCallback((newConfig: ParticleFieldConfig) => {
    setConfig(newConfig);
  }, []);

  const handlePerformanceUpdate = useCallback((newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  }, []);

  const handlePresetApply = useCallback(
    (preset: ConfigPreset) => {
      handleConfigChange(preset.config);
    },
    [handleConfigChange]
  );

  const handlePresetSave = useCallback(() => {
    // 预设保存持久化在 ControlPanel 内部完成
  }, []);

  const handlePresetDelete = useCallback(() => {
    // 预设删除逻辑在 ControlPanel 内部完成
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const resetSystem = useCallback(() => {
    handleConfigChange(defaultConfig);
  }, [handleConfigChange]);

  const togglePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <ParticleFieldSettingsSEO />
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col lg:flex-row">
        {/* 左侧控制面板 */}
        <div className="flex max-h-[60dvh] w-full flex-col border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 lg:max-h-none lg:w-96 lg:flex-shrink-0 lg:border-b-0 lg:border-r">
          {/* 头部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link
                  to="/particle-field"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={t('particleField.backToMain') as string}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('particleField.settings.title')}
                </h1>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePreview}
                  className={`p-2 rounded transition-colors ${
                    showPreview
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={
                    showPreview
                      ? (t('particleField.settings.hidePreview') as string)
                      : (t('particleField.settings.showPreview') as string)
                  }
                  aria-label={
                    showPreview
                      ? (t('particleField.settings.hidePreview') as string)
                      : (t('particleField.settings.showPreview') as string)
                  }
                  aria-pressed={showPreview}
                >
                  {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 控制面板内容 */}
          <ControlPanel
            config={config}
            onConfigChange={handleConfigChange}
            onPresetApply={handlePresetApply}
            onPresetSave={handlePresetSave}
            onPresetDelete={handlePresetDelete}
            metrics={metrics || undefined}
          />
        </div>

        {/* 右侧预览区域 */}
        {showPreview && (
          <div className="relative min-h-[40dvh] flex-1 bg-black lg:min-h-0">
            {/* 粒子场预览 */}
            <ParticleFieldComponent
              className="w-full h-full"
              config={config}
              isPlaying={isPlaying}
              onPerformanceUpdate={handlePerformanceUpdate}
              enableControls={false}
              autoStart={true}
            />

            {/* 预览控制覆盖层 */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <button
                onClick={togglePlayback}
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
                onClick={resetSystem}
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
        )}

        {/* 无预览时的占位 */}
        {!showPreview && (
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
                onClick={togglePreview}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {t('particleField.settings.showPreview')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticleFieldSettings;
