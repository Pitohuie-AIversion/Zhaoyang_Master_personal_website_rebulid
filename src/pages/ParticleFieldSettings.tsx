import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../components/common/TranslationProvider';
import { ParticleFieldSettingsSEO } from '../components/seo/SEOOptimization';
import {
  ControlPanel,
  SettingsPreviewArea,
  useParticleSettingsState,
} from '../components/ParticleField/settings';

const ParticleFieldSettings: React.FC = () => {
  const { t } = useTranslation();
  const {
    config,
    metrics,
    isPlaying,
    showPreview,
    handleConfigChange,
    handlePerformanceUpdate,
    handlePresetApply,
    handlePresetSave,
    handlePresetDelete,
    togglePlayback,
    resetSystem,
    togglePreview,
  } = useParticleSettingsState();

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
                  {t('particleField.settings.title') as string}
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
        <SettingsPreviewArea
          showPreview={showPreview}
          config={config}
          isPlaying={isPlaying}
          onPerformanceUpdate={handlePerformanceUpdate}
          onTogglePlayback={togglePlayback}
          onReset={resetSystem}
          onTogglePreview={togglePreview}
        />
      </div>
    </div>
  );
};

export default ParticleFieldSettings;
