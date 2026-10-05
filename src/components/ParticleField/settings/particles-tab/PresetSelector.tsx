import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { performancePresets } from '../../../../utils/performanceMonitor';

interface PresetSelectorProps {
  currentPreset?: string;
  onApplyPreset: (level: 'low' | 'medium' | 'high' | 'ultra') => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  onApplyPreset,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        {t('particleField.settings.performancePresets')}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(performancePresets).map(([level, preset]) => (
          <button
            key={level}
            type="button"
            onClick={() => onApplyPreset(level as 'low' | 'medium' | 'high' | 'ultra')}
            aria-pressed={currentPreset === level}
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
  );
};
