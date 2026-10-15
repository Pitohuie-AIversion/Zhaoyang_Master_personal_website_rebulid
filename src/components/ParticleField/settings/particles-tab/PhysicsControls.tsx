import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../../utils/configManager';

interface PhysicsControlsProps {
  particle: ParticleFieldConfig['particle'];
  onUpdate: (updates: Partial<ParticleFieldConfig['particle']>) => void;
}

export const PhysicsControls: React.FC<PhysicsControlsProps> = ({ particle, onUpdate }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.physics')}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.gravity')}: {particle.physics.gravity.toFixed(3)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.gravity') as string}
            min="-0.1"
            max="0.1"
            step="0.001"
            value={particle.physics.gravity}
            onChange={(e) =>
              onUpdate({
                physics: { ...particle.physics, gravity: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.damping')}: {particle.physics.damping.toFixed(3)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.damping') as string}
            min="0.9"
            max="1.0"
            step="0.001"
            value={particle.physics.damping}
            onChange={(e) =>
              onUpdate({
                physics: { ...particle.physics, damping: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.noiseStrength')}: {particle.physics.turbulence.toFixed(2)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.noiseStrength') as string}
            min="0"
            max="2"
            step="0.01"
            value={particle.physics.turbulence}
            onChange={(e) =>
              onUpdate({
                physics: { ...particle.physics, turbulence: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.noiseScale')}: {particle.noiseScale.toFixed(3)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.noiseScale') as string}
            min="0.001"
            max="0.01"
            step="0.0001"
            value={particle.noiseScale}
            onChange={(e) => onUpdate({ noiseScale: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
