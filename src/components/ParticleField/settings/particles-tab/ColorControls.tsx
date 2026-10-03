import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';

type ColorScheme =
  | 'ocean'
  | 'fire'
  | 'electric'
  | 'cosmic'
  | 'storm'
  | 'abyss'
  | 'aurora'
  | 'monochrome';

interface ColorControlsProps {
  colorScheme: ColorScheme;
  onUpdateScheme: (scheme: ColorScheme) => void;
}

export const ColorControls: React.FC<ColorControlsProps> = ({
  colorScheme,
  onUpdateScheme,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.colors')}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.colorScheme')}
          </label>
          <select
            aria-label={t('particleField.settings.colorScheme') as string}
            value={colorScheme}
            onChange={(e) => onUpdateScheme(e.target.value as ColorScheme)}
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
  );
};
