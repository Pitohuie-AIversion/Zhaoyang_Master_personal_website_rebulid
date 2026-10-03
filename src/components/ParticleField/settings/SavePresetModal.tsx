import React from 'react';
import { Save } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

export interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetName: string;
  setPresetName: (name: string) => void;
  presetDescription: string;
  setPresetDescription: (desc: string) => void;
  onSave: () => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  onClose,
  presetName,
  setPresetName,
  presetDescription,
  setPresetDescription,
  onSave,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-600">
        <h3 className="text-lg font-semibold mb-4">{t('particleField.settings.savePreset')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.presetName')}
            </label>
            <input
              type="text"
              aria-label={t('particleField.settings.presetName') as string}
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder={t('particleField.settings.enterPresetName')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.presetDescription')}
            </label>
            <textarea
              aria-label={t('particleField.settings.presetDescription') as string}
              value={presetDescription}
              onChange={(e) => setPresetDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded resize-none"
              rows={3}
              placeholder={t('particleField.settings.enterPresetDescription')}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            {t('particleField.settings.cancel')}
          </button>
          <button
            onClick={onSave}
            disabled={!presetName.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
          >
            <Save className="w-4 h-4 inline mr-1" />
            {t('particleField.settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePresetModal;
