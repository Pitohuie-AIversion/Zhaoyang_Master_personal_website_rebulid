import React, { useState } from 'react';
import { useTranslation } from '../components/common/TranslationProvider';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ZhaoyangASCIIText from '../components/features/home/ZhaoyangASCIIText';
import ZhaoyangASCIIRhythm from '../components/features/home/ZhaoyangASCIIRhythm';
import { ResponsiveContainer, useResponsive } from '../components/common/ResponsiveEnhancements';
import SimpleMotion from '../components/animations/SimpleMotion';
import { ASCIIDemoSEO } from '../components/seo/SEOOptimization';
import {
  DemoConfig,
  defaultDemoConfig,
  AsciiDemoControls,
  AsciiDemoDocs
} from '../components/features/ascii-demo';

const ASCIIDemo: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  const { t } = useTranslation();
  const [config, setConfig] = useState<DemoConfig>(defaultDemoConfig);
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const updateConfig = (key: keyof DemoConfig, value: string | boolean | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetDemo = () => {
    setResetKey(prev => prev + 1);
    setConfig(defaultDemoConfig);
  };

  return (
    <div className="min-h-screen relative theme-transition">
      <ASCIIDemoSEO />
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 theme-transition mt-16">
        <ResponsiveContainer>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>{t('navigation.home') as string}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('ascii.title') as string}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? (t('particleField.pause') as string) : (t('particleField.play') as string)}
                aria-pressed={isPlaying}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? (t('particleField.pause') as string) : (t('particleField.play') as string)}
              </button>
              <button
                type="button"
                onClick={resetDemo}
                aria-label={t('particleField.settings.reset') as string}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={16} />
                {t('particleField.settings.reset') as string}
              </button>
            </div>
          </div>
        </ResponsiveContainer>
      </div>

      <ResponsiveContainer style={{ paddingTop: isMobile ? '120px' : isTablet ? '140px' : '160px', paddingBottom: '80px' }}>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-4'} gap-8`}>
          {/* 控制面板 */}
          <AsciiDemoControls
            config={config}
            onUpdateConfig={updateConfig}
            className={isMobile ? 'order-2' : 'lg:col-span-1'}
          />

          {/* 展示区域 */}
          <div className={`${isMobile ? 'order-1' : 'lg:col-span-3'}`}>
            <div className="bg-black rounded-lg p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
              <SimpleMotion
                key={`${resetKey}-${JSON.stringify(config)}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center"
              >
                {config.showRhythm ? (
                  <ZhaoyangASCIIRhythm
                    theme={config.theme}
                    rhythmType={config.rhythmType}
                    intensity={config.intensity}
                    autoPlay={isPlaying}
                    showControls={false}
                    className={`${config.size === 'small' ? 'scale-75' : config.size === 'large' ? 'scale-125' : 'scale-100'}`}
                  />
                ) : (
                  <ZhaoyangASCIIText
                    theme={config.theme === 'rainbow' ? 'matrix' : config.theme}
                    animationType={config.animationType}
                    size={config.size}
                    speed={config.speed}
                    className="w-full"
                  />
                )}
              </SimpleMotion>
            </div>

            {/* 说明文档 */}
            <AsciiDemoDocs className="mt-8" />
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export { ASCIIDemo as default };
