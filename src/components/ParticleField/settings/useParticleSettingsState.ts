import { useState, useCallback } from 'react';
import {
  ParticleFieldConfig,
  defaultConfig,
  ConfigPreset,
} from '../../../utils/configManager';
import { PerformanceMetrics } from '../../../utils/performanceMonitor';

export const useParticleSettingsState = () => {
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

  return {
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
  };
};
