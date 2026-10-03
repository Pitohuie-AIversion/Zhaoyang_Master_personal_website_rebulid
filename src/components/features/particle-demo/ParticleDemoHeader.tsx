import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  Monitor,
  Palette,
  Settings
} from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

export interface ParticleDemoHeaderProps {
  isFullscreen: boolean;
  showInfo: boolean;
  showStats: boolean;
  showPresets: boolean;
  onToggleInfo: () => void;
  onToggleStats: () => void;
  onTogglePresets: () => void;
}

export const ParticleDemoHeader: React.FC<ParticleDemoHeaderProps> = ({
  isFullscreen,
  showInfo,
  showStats,
  showPresets,
  onToggleInfo,
  onToggleStats,
  onTogglePresets,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`absolute ${
        isFullscreen ? 'top-0' : 'top-16'
      } left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent transition-all duration-300 ${
        isFullscreen ? 'opacity-0 hover:opacity-100' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/particle-field"
            className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-black/50 transition-all duration-200"
            title={t('particleField.backToMain')}
            aria-label={t('particleField.backToMain')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-xl font-bold text-white">
            {t('particleField.demoMode')}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleInfo}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showInfo
                ? 'bg-blue-500/30 text-blue-300 border border-blue-400/30'
                : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
            }`}
            title={t('particleField.toggleInfo')}
            aria-label={t('particleField.toggleInfo')}
            aria-pressed={showInfo}
          >
            <Info className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleStats}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showStats
                ? 'bg-green-500/30 text-green-300 border border-green-400/30'
                : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
            }`}
            title={t('particleField.toggleStats')}
            aria-label={t('particleField.toggleStats')}
            aria-pressed={showStats}
          >
            <Monitor className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePresets}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showPresets
                ? 'bg-purple-500/30 text-purple-300 border border-purple-400/30'
                : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
            }`}
            title={t('particleField.presets')}
            aria-label={t('particleField.presets')}
            aria-pressed={showPresets}
          >
            <Palette className="w-5 h-5" />
          </button>

          <Link
            to="/particle-field/settings"
            className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white/70 hover:text-white hover:bg-black/50 transition-all duration-200"
            title={t('particleField.navigation.settings')}
            aria-label={t('particleField.navigation.settings')}
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
