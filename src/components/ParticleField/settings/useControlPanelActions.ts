import { useCallback } from 'react';
import {
  ParticleFieldConfig,
  defaultConfig
} from '../../../utils/configManager';
import { performancePresets } from '../../../utils/performanceMonitor';

export interface UseControlPanelActionsOptions {
  config: ParticleFieldConfig;
  onConfigChange: (config: ParticleFieldConfig) => void;
}

export const useControlPanelActions = ({
  config,
  onConfigChange
}: UseControlPanelActionsOptions) => {
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

  return {
    updateParticleConfig,
    updatePostProcessConfig,
    updateInteractionConfig,
    applyPerformancePreset,
    resetToDefault,
    exportConfig,
    importConfig
  };
};
