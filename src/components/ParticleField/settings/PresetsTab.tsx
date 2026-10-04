import React from 'react';
import { ConfigPreset } from '../../../utils/configManager';
import { BuiltinPresetsSection, CustomPresetsSection } from './presets-sections';

export interface PresetsTabProps {
  customPresets: ConfigPreset[];
  setCustomPresets: React.Dispatch<React.SetStateAction<ConfigPreset[]>>;
  onPresetApply: (preset: ConfigPreset) => void;
  onShowSaveDialog: () => void;
  editingPreset: string | null;
  setEditingPreset: (id: string | null) => void;
  onSaveEditedPreset: (preset: ConfigPreset) => void;
  onDeletePreset: (id: string) => void;
}

export const PresetsTab: React.FC<PresetsTabProps> = ({
  customPresets,
  setCustomPresets,
  onPresetApply,
  onShowSaveDialog,
  editingPreset,
  setEditingPreset,
  onSaveEditedPreset,
  onDeletePreset,
}) => {
  return (
    <div className="space-y-6">
      <BuiltinPresetsSection onPresetApply={onPresetApply} />

      <CustomPresetsSection
        customPresets={customPresets}
        setCustomPresets={setCustomPresets}
        onPresetApply={onPresetApply}
        onShowSaveDialog={onShowSaveDialog}
        editingPreset={editingPreset}
        setEditingPreset={setEditingPreset}
        onSaveEditedPreset={onSaveEditedPreset}
        onDeletePreset={onDeletePreset}
      />
    </div>
  );
};

export default PresetsTab;
