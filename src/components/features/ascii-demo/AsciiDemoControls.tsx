import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { Settings } from 'lucide-react';
import { DemoConfig } from './asciiDemoConfig';
import {
  ModeAndThemeControls,
  RhythmAndAnimationControls,
  IntensityAndSizeControls,
} from './controls';

interface AsciiDemoControlsProps {
  config: DemoConfig;
  onUpdateConfig: (key: keyof DemoConfig, value: string | boolean | number) => void;
  className?: string;
}

export const AsciiDemoControls: React.FC<AsciiDemoControlsProps> = ({
  config,
  onUpdateConfig,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 theme-transition">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.settings') as string}
          </h2>
        </div>

        {/* 显示模式与主题 */}
        <ModeAndThemeControls config={config} onUpdateConfig={onUpdateConfig} />

        {/* 律动与动画类型 */}
        <RhythmAndAnimationControls config={config} onUpdateConfig={onUpdateConfig} />

        {/* 效果强度、尺寸与速度 */}
        <IntensityAndSizeControls config={config} onUpdateConfig={onUpdateConfig} />
      </div>
    </div>
  );
};

export default AsciiDemoControls;
