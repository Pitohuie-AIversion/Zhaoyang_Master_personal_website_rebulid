import React, { useState } from 'react';
import {
  ParticleFieldConfig,
  ConfigPreset,
} from '../../../utils/configManager';
import { PerformanceMetrics } from '../../../utils/performanceMonitor';
import { ParticlesTab } from './ParticlesTab';
import { PostprocessTab } from './PostprocessTab';
import { InteractionTab } from './InteractionTab';
import { PresetsTab } from './PresetsTab';
import { SavePresetModal } from './SavePresetModal';
import { ControlPanelTabs, type ControlPanelTabType } from './ControlPanelTabs';
import { ControlPanelFooter } from './ControlPanelFooter';
import { useControlPanelPresets } from './useControlPanelPresets';
import { useControlPanelActions } from './useControlPanelActions';

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
  const [activeTab, setActiveTab] = useState<ControlPanelTabType>('particles');

  const {
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
    handleDeletePreset,
  } = useControlPanelPresets({ config, onPresetSave, onPresetDelete });

  const {
    updateParticleConfig,
    updatePostProcessConfig,
    updateInteractionConfig,
    applyPerformancePreset,
    resetToDefault,
    exportConfig,
    importConfig,
  } = useControlPanelActions({ config, onConfigChange });

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* 标签页导航 */}
      <ControlPanelTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
      <ControlPanelFooter
        onReset={resetToDefault}
        onImport={importConfig}
        onExport={exportConfig}
        metrics={metrics}
      />

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
