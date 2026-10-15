import React from 'react';
import { builtinPresets } from '../../../utils/configManager';
import { useTranslation } from '../../common/TranslationProvider';

export interface ParticleDemoPresetsPanelProps {
  show: boolean;
  selectedPreset: string;
  onApplyPreset: (presetId: string) => void;
}

export const ParticleDemoPresetsPanel: React.FC<ParticleDemoPresetsPanelProps> = ({
  show,
  selectedPreset,
  onApplyPreset,
}) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="absolute top-20 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-white max-w-sm">
      <h3 className="text-lg font-semibold mb-4">{t('particleField.presets')}</h3>
      <div className="space-y-2">
        {builtinPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              selectedPreset === preset.id
                ? 'bg-blue-500/30 border border-blue-400/50'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="font-medium">{preset.name}</div>
            <div className="text-sm text-white/70 mt-1">{preset.description}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {preset.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
