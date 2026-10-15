import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';

interface AsciiControlsProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onResetAnimation: () => void;
}

export const AsciiControls: React.FC<AsciiControlsProps> = ({
  isPlaying,
  onTogglePlayback,
  onResetAnimation
}) => {
  const { t } = useTranslation();

  return (
    <div className="controls">
      <button className="control-btn" onClick={onTogglePlayback}>
        {isPlaying ? `⏸️ ${t('ascii.controls.pause')}` : `▶️ ${t('ascii.controls.play')}`}
      </button>
      <button className="control-btn" onClick={onResetAnimation}>
        🔄 {t('ascii.controls.reset')}
      </button>
    </div>
  );
};
