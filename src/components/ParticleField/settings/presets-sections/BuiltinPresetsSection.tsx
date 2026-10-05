import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { ConfigPreset, builtinPresets } from '../../../../utils/configManager';

export interface BuiltinPresetsSectionProps {
  onPresetApply: (preset: ConfigPreset) => void;
}

export const BuiltinPresetsSection: React.FC<BuiltinPresetsSectionProps> = ({
  onPresetApply,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        {t('particleField.settings.builtinPresets')}
      </h3>
      <div className="space-y-2">
        {builtinPresets.map((preset) => (
          <div
            key={preset.id}
            className="p-3 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{preset.name}</div>
                <div className="text-sm text-gray-400">{preset.description}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {preset.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onPresetApply(preset)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                {t('particleField.settings.apply')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
