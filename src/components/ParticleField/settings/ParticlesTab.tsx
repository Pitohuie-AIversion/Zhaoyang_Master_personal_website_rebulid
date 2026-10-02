import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../utils/configManager';
import { performancePresets } from '../../../utils/performanceMonitor';

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
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* 性能预设 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          {t('particleField.settings.performancePresets')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(performancePresets).map(([level, preset]) => (
            <button
              key={level}
              type="button"
              onClick={() => applyPerformancePreset(level as 'low' | 'medium' | 'high' | 'ultra')}
              aria-pressed={config.performance.preset === level}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"
            >
              <div className="font-medium capitalize">{level}</div>
              <div className="text-sm text-gray-400">
                {preset.maxParticles.toLocaleString()} {t('particleField.particles')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 基础设置 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.basic')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.maxParticles')}: {config.particle.particleCount}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.maxParticles') as string}
              min="100"
              max="50000"
              step="100"
              value={config.particle.particleCount}
              onChange={(e) => updateParticleConfig({ particleCount: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.opacity')}: {config.particle.visual.opacity.toFixed(2)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.opacity') as string}
              min="0.1"
              max="1"
              step="0.05"
              value={config.particle.visual.opacity}
              onChange={(e) =>
                updateParticleConfig({
                  visual: { ...config.particle.visual, opacity: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.size')}: {config.particle.visual.maxSize.toFixed(1)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.size') as string}
              min="0.5"
              max="10"
              step="0.1"
              value={config.particle.visual.maxSize}
              onChange={(e) =>
                updateParticleConfig({
                  visual: { ...config.particle.visual, maxSize: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 物理设置 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.physics')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.gravity')}: {config.particle.physics.gravity.toFixed(3)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.gravity') as string}
              min="-0.1"
              max="0.1"
              step="0.001"
              value={config.particle.physics.gravity}
              onChange={(e) =>
                updateParticleConfig({
                  physics: { ...config.particle.physics, gravity: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.damping')}: {config.particle.physics.damping.toFixed(3)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.damping') as string}
              min="0.9"
              max="1.0"
              step="0.001"
              value={config.particle.physics.damping}
              onChange={(e) =>
                updateParticleConfig({
                  physics: { ...config.particle.physics, damping: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.noiseStrength')}: {config.particle.physics.turbulence.toFixed(2)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.noiseStrength') as string}
              min="0"
              max="2"
              step="0.01"
              value={config.particle.physics.turbulence}
              onChange={(e) =>
                updateParticleConfig({
                  physics: { ...config.particle.physics, turbulence: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.noiseScale')}: {config.particle.noiseScale.toFixed(3)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.noiseScale') as string}
              min="0.001"
              max="0.01"
              step="0.0001"
              value={config.particle.noiseScale}
              onChange={(e) => updateParticleConfig({ noiseScale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 颜色设置 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.colors')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.colorScheme')}
            </label>
            <select
              aria-label={t('particleField.settings.colorScheme') as string}
              value={config.particle.colorScheme}
              onChange={(e) =>
                updateParticleConfig({
                  colorScheme: e.target.value as
                    | 'ocean'
                    | 'fire'
                    | 'electric'
                    | 'cosmic'
                    | 'storm'
                    | 'abyss'
                    | 'aurora'
                    | 'monochrome',
                })
              }
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="ocean">{t('particleField.settings.colorOptions.ocean') as string}</option>
              <option value="fire">{t('particleField.settings.colorOptions.fire') as string}</option>
              <option value="electric">{t('particleField.settings.colorOptions.electric') as string}</option>
              <option value="cosmic">{t('particleField.settings.colorOptions.cosmic') as string}</option>
              <option value="storm">{t('particleField.settings.colorOptions.storm') as string}</option>
              <option value="abyss">{t('particleField.settings.colorOptions.abyss') as string}</option>
              <option value="aurora">{t('particleField.settings.colorOptions.aurora') as string}</option>
              <option value="monochrome">{t('particleField.settings.colorOptions.monochrome') as string}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticlesTab;
