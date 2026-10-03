import React from 'react';
import { ParticleFieldConfig } from '../../../utils/configManager';
import {
  PresetSelector,
  BasicControls,
  PhysicsControls,
  ColorControls,
} from './particles-tab';

export interface ParticlesTabProps {
  config: ParticleFieldConfig;
  updateParticleConfig: (updates: Partial<ParticleFieldConfig['particle']>) => void;
  applyPerformancePreset: (level: 'low' | 'medium' | 'high' | 'ultra') => void;
}

export const ParticlesTab: React.FC<ParticlesTabProps> = ({
  config,
  updateParticleConfig,
  applyPerformancePreset,
}) => {
  return (
    <div className="space-y-6">
      {/* 性能预设 */}
      <PresetSelector
        currentPreset={config.performance.preset}
        onApplyPreset={applyPerformancePreset}
      />

      {/* 基础设置 */}
      <BasicControls
        particle={config.particle}
        onUpdate={updateParticleConfig}
      />

      {/* 物理设置 */}
      <PhysicsControls
        particle={config.particle}
        onUpdate={updateParticleConfig}
      />

      {/* 颜色设置 */}
      <ColorControls
        colorScheme={config.particle.colorScheme}
        onUpdateScheme={(colorScheme) => updateParticleConfig({ colorScheme })}
      />
    </div>
  );
};

export default ParticlesTab;
