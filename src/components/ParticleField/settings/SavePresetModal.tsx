import React, { useEffect, useRef } from 'react';
import { Save, X } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-preset-title"
    >
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm border border-gray-700 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 id="save-preset-title" className="text-lg font-semibold text-white">
            {t('particleField.settings.savePreset') as string}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('particleField.settings.cancel') as string}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (presetName.trim()) onSave();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="preset-name-input" className="block text-sm font-medium text-gray-300 mb-2">
              {t('particleField.settings.presetName') as string}
            </label>
            <input
              id="preset-name-input"
              ref={inputRef}
              type="text"
              aria-label={t('particleField.settings.presetName') as string}
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full p-2.5 bg-gray-700/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder={t('particleField.settings.enterPresetName') as string}
            />
          </div>

          <div>
            <label htmlFor="preset-desc-input" className="block text-sm font-medium text-gray-300 mb-2">
              {t('particleField.settings.presetDescription') as string}
            </label>
            <textarea
              id="preset-desc-input"
              aria-label={t('particleField.settings.presetDescription') as string}
              value={presetDescription}
              onChange={(e) => setPresetDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-700/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              rows={3}
              placeholder={t('particleField.settings.enterPresetDescription') as string}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/60 rounded-lg transition-colors"
            >
              {t('particleField.settings.cancel') as string}
            </button>
            <button
              type="submit"
              disabled={!presetName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              {t('particleField.settings.save') as string}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavePresetModal;
