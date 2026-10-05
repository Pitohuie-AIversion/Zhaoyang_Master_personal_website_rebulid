import React from 'react';
import { Zap, Sliders, Gamepad2, Palette } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

export type ControlPanelTabType = 'particles' | 'postprocess' | 'interaction' | 'presets';

export interface ControlPanelTabsProps {
  activeTab: ControlPanelTabType;
  onTabChange: (tab: ControlPanelTabType) => void;
}

export const ControlPanelTabs: React.FC<ControlPanelTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex overflow-x-auto border-b border-gray-700" role="tablist">
      <button
        id="particle-settings-tab-particles"
        role="tab"
        aria-selected={activeTab === 'particles'}
        aria-controls="particle-settings-panel"
        onClick={() => onTabChange('particles')}
        className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
          activeTab === 'particles'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Zap className="w-4 h-4 inline mr-2" />
        {t('particleField.settings.particles')}
      </button>
      <button
        id="particle-settings-tab-postprocess"
        role="tab"
        aria-selected={activeTab === 'postprocess'}
        aria-controls="particle-settings-panel"
        onClick={() => onTabChange('postprocess')}
        className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
          activeTab === 'postprocess'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Sliders className="w-4 h-4 inline mr-2" />
        {t('particleField.settings.postProcess')}
      </button>
      <button
        id="particle-settings-tab-interaction"
        role="tab"
        aria-selected={activeTab === 'interaction'}
        aria-controls="particle-settings-panel"
        onClick={() => onTabChange('interaction')}
        className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
          activeTab === 'interaction'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Gamepad2 className="w-4 h-4 inline mr-2" />
        {t('particleField.settings.interaction')}
      </button>
      <button
        id="particle-settings-tab-presets"
        role="tab"
        aria-selected={activeTab === 'presets'}
        aria-controls="particle-settings-panel"
        onClick={() => onTabChange('presets')}
        className={`min-w-32 flex-none lg:min-w-0 lg:flex-1 p-3 text-sm font-medium transition-colors ${
          activeTab === 'presets'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Palette className="w-4 h-4 inline mr-2" />
        {t('particleField.settings.presets')}
      </button>
    </div>
  );
};
