import React from 'react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

export interface ParticleDemoFooterProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  onTogglePlayback: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
}

export const ParticleDemoFooter: React.FC<ParticleDemoFooterProps> = ({
  isPlaying,
  isFullscreen,
  onTogglePlayback,
  onReset,
  onToggleFullscreen,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300 ${
        isFullscreen ? 'opacity-0 hover:opacity-100' : ''
      }`}
    >
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={onTogglePlayback}
          className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-200"
          title={isPlaying ? t('particleField.pause') : t('particleField.play')}
          aria-label={isPlaying ? t('particleField.pause') : t('particleField.play')}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={onReset}
          className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-200"
          title={t('particleField.reset')}
          aria-label={t('particleField.reset')}
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-200"
          title={isFullscreen ? t('particleField.exitFullscreen') : t('particleField.fullscreen')}
          aria-label={isFullscreen ? t('particleField.exitFullscreen') : t('particleField.fullscreen')}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
