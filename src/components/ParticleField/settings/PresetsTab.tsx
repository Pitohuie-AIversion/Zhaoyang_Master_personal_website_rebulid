import React from 'react';
import { Plus, Check, X, Edit3, Trash2 } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { ConfigPreset, builtinPresets } from '../../../utils/configManager';

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
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* 内置预设 */}
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

      {/* 自定义预设 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{t('particleField.settings.customPresets')}</h3>
          <button
            onClick={onShowSaveDialog}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            {t('particleField.settings.savePreset')}
          </button>
        </div>

        {customPresets.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {t('particleField.settings.noCustomPresets')}
          </div>
        ) : (
          <div className="space-y-2">
            {customPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editingPreset === preset.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          aria-label={t('particleField.settings.presetName') as string}
                          value={preset.name}
                          onChange={(e) => {
                            const updated = customPresets.map((p) =>
                              p.id === preset.id ? { ...p, name: e.target.value } : p
                            );
                            setCustomPresets(updated);
                          }}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm"
                        />
                        <textarea
                          aria-label={t('particleField.settings.presetDescription') as string}
                          value={preset.description}
                          onChange={(e) => {
                            const updated = customPresets.map((p) =>
                              p.id === preset.id ? { ...p, description: e.target.value } : p
                            );
                            setCustomPresets(updated);
                          }}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm resize-none"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-sm text-gray-400">{preset.description}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {editingPreset === preset.id ? (
                      <>
                        <button
                          type="button"
                          aria-label={t('particleField.settings.save') as string}
                          onClick={() => onSaveEditedPreset(preset)}
                          className="p-1 text-green-400 hover:text-green-300"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={t('particleField.settings.cancel') as string}
                          onClick={() => setEditingPreset(null)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onPresetApply(preset)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                        >
                          {t('particleField.settings.apply')}
                        </button>
                        <button
                          type="button"
                          aria-label={t('particleField.settings.edit') as string}
                          onClick={() => setEditingPreset(preset.id)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={t('particleField.settings.delete') as string}
                          onClick={() => onDeletePreset(preset.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetsTab;
