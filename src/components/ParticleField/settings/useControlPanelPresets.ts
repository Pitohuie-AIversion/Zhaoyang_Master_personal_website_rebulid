import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ParticleFieldConfig,
  ConfigManager,
  ConfigPreset
} from '../../../utils/configManager';

export interface UseControlPanelPresetsOptions {
  config: ParticleFieldConfig;
  onPresetSave?: (name: string, description: string) => void;
  onPresetDelete?: (id: string) => void;
}

export const useControlPanelPresets = ({
  config,
  onPresetSave,
  onPresetDelete
}: UseControlPanelPresetsOptions) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [customPresets, setCustomPresets] = useState<ConfigPreset[]>([]);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);

  const configManager = useRef(new ConfigManager());

  useEffect(() => {
    const presets = configManager.current.getCustomPresets();
    setCustomPresets(presets);
  }, []);

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

  return {
    showSaveDialog,
    setShowSaveDialog,
    presetName,
    setPresetName,
    presetDescription,
    setPresetDescription,
    customPresets,
    setCustomPresets,
    editingPreset,
    setEditingPreset,
    handleSavePreset,
    handleSaveEditedPreset,
    handleDeletePreset
  };
};
