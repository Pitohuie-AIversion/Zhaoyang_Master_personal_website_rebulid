import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Upload,
  Download,
  Monitor,
  Zap,
  Sliders,
  Gamepad2,
  Palette,
} from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import {
  ParticleFieldConfig,
  ConfigManager,
  defaultConfig,
  ConfigPreset,
} from '../../../utils/configManager';
import { PerformanceMetrics, performancePresets } from '../../../utils/performanceMonitor';
import { ParticlesTab } from './ParticlesTab';
import { PostprocessTab } from './PostprocessTab';
import { InteractionTab } from './InteractionTab';
import { PresetsTab } from './PresetsTab';
import { SavePresetModal } from './SavePresetModal';

export interface ControlPanelProps {
  config: ParticleFieldConfig;
  onConfigChange: (config: ParticleFieldConfig) => void;
  onPresetApply: (preset: ConfigPreset) => void;
  onPresetSave?: (name: string, description: string) => void;
  onPresetDelete?: (id: string) => void;
  metrics?: PerformanceMetrics;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onConfigChange,
  onPresetApply,
  onPresetSave,
  onPresetDelete,
  metrics,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'particles' | 'postprocess' | 'interaction' | 'presets'>('particles');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [customPresets, setCustomPresets] = useState<ConfigPreset[]>([]);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);

  const configManager = useRef(new ConfigManager());

  useEffect(() => {
    // 加载自定义预设
    const presets = configManager.current.getCustomPresets();
    setCustomPresets(presets);
  }, []);

  const updateParticleConfig = useCallback(
    (updates: Partial<typeof config.particle>) => {
      onConfigChange({
        ...config,
        particle: { ...config.particle, ...updates },
      });
    },
    [config, onConfigChange]
  );

  const updatePostProcessConfig = useCallback(
    (updates: Partial<typeof config.postProcess>) => {
      onConfigChange({
        ...config,
        postProcess: { ...config.postProcess, ...updates },
      });
    },
    [config, onConfigChange]
  );

  const updateInteractionConfig = useCallback(
    (updates: Partial<typeof config.interaction>) => {
      onConfigChange({
        ...config,
        interaction: { ...config.interaction, ...updates },
      });
    },
    [config, onConfigChange]
  );

  const handleSavePreset = useCallback(() => {
    if (presetName.trim()) {
      onPresetSave?.(presetName.trim(), presetDescription.trim());
      const newPreset: ConfigPreset = {
        id: `custom-${Date.now()}`,
        name: presetName.trim(),
        description: presetDescription.trim(),
        config,
        tags: ['custom'],
        isCustom: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      configManager.current.saveCustomPreset(newPreset);
      setCustomPresets((prev) => [...prev, newPreset]);
      setShowSaveDialog(false);
      setPresetName('');
      setPresetDescription('');
    }
  }, [presetName, presetDescription, config, onPresetSave]);

  const handleSaveEditedPreset = useCallback((preset: ConfigPreset) => {
    configManager.current.updateCustomPreset(preset.id, preset);
    setEditingPreset(null);
  }, []);

  const handleDeletePreset = useCallback(
    (presetId: string) => {
      configManager.current.deleteCustomPreset(presetId);
      setCustomPresets((prev) => prev.filter((p) => p.id !== presetId));
      onPresetDelete?.(presetId);
    },
    [onPresetDelete]
  );

  const applyPerformancePreset = useCallback(
    (level: 'low' | 'medium' | 'high' | 'ultra') => {
      const preset = performancePresets[level];
      onConfigChange({
        ...config,
        particle: {
          ...config.particle,
          particleCount: preset.particleCount,
          performanceLevel: preset.quality,
        },
        postProcess: {
          ...config.postProcess,
          bloomEnabled: preset.bloomEnabled,
        },
        performance: {
          ...config.performance,
          preset: level,
        },
      });
    },
    [config, onConfigChange]
  );

  const resetToDefault = useCallback(() => {
    onConfigChange(defaultConfig);
  }, [onConfigChange]);

  const exportConfig = useCallback(() => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `particle-field-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const importConfig = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedConfig = JSON.parse(e.target?.result as string);
            onConfigChange(importedConfig);
          } catch (error) {
            console.error('Failed to import config:', error);
          }
        };
        reader.readAsText(file);
      }
    },
    [onConfigChange]
  );

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* 标签页导航 */}
      <div className="flex overflow-x-auto border-b border-gray-700" role="tablist">
        <button
          id="particle-settings-tab-particles"
          role="tab"
          aria-selected={activeTab === 'particles'}
          aria-controls="particle-settings-panel"
          onClick={() => setActiveTab('particles')}
          className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'particles'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.particles')}
        </button>
        <button
          id="particle-settings-tab-postprocess"
          role="tab"
          aria-selected={activeTab === 'postprocess'}
          aria-controls="particle-settings-panel"
          onClick={() => setActiveTab('postprocess')}
          className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'postprocess'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Sliders className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.postProcess')}
        </button>
        <button
          id="particle-settings-tab-interaction"
          role="tab"
          aria-selected={activeTab === 'interaction'}
          aria-controls="particle-settings-panel"
          onClick={() => setActiveTab('interaction')}
          className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'interaction'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.interaction')}
        </button>
        <button
          id="particle-settings-tab-presets"
          role="tab"
          aria-selected={activeTab === 'presets'}
          aria-controls="particle-settings-panel"
          onClick={() => setActiveTab('presets')}
          className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'presets'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.presets')}
        </button>
      </div>

      {/* 内容区域 */}
      <div
        id="particle-settings-panel"
        role="tabpanel"
        aria-labelledby={`particle-settings-tab-${activeTab}`}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {activeTab === 'particles' && (
          <ParticlesTab
            config={config}
            updateParticleConfig={updateParticleConfig}
            applyPerformancePreset={applyPerformancePreset}
          />
        )}

        {activeTab === 'postprocess' && (
          <PostprocessTab
            config={config}
            updatePostProcessConfig={updatePostProcessConfig}
          />
        )}

        {activeTab === 'interaction' && (
          <InteractionTab
            config={config}
            updateInteractionConfig={updateInteractionConfig}
          />
        )}

        {activeTab === 'presets' && (
          <PresetsTab
            customPresets={customPresets}
            setCustomPresets={setCustomPresets}
            onPresetApply={onPresetApply}
            onShowSaveDialog={() => setShowSaveDialog(true)}
            editingPreset={editingPreset}
            setEditingPreset={setEditingPreset}
            onSaveEditedPreset={handleSaveEditedPreset}
            onDeletePreset={handleDeletePreset}
          />
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={resetToDefault}
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
                onChange={importConfig}
                className="hidden"
              />
            </label>

            <button
              onClick={exportConfig}
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

      {/* 保存预设对话框 */}
      <SavePresetModal
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        presetName={presetName}
        setPresetName={setPresetName}
        presetDescription={presetDescription}
        setPresetDescription={setPresetDescription}
        onSave={handleSavePreset}
      />
    </div>
  );
};

export default ControlPanel;
