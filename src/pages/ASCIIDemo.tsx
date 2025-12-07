import React, { useState } from 'react';
import { useTranslation } from '../components/common/TranslationProvider';
import { ArrowLeft, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ZhaoyangASCIIText from '../components/features/home/ZhaoyangASCIIText';
import ZhaoyangASCIIRhythm from '../components/features/home/ZhaoyangASCIIRhythm';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { useResponsive } from '../components/common/ResponsiveEnhancements';
import SimpleMotion from '../components/animations/SimpleMotion';

type Theme = 'matrix' | 'cyber' | 'neon' | 'rainbow';
type RhythmType = 'heartbeat' | 'wave' | 'pulse' | 'glitch';
type AnimationType = 'typewriter' | 'wave' | 'pulse' | 'glitch';
type Intensity = 'low' | 'medium' | 'high';
type Size = 'small' | 'medium' | 'large';

interface DemoConfig {
  theme: Theme;
  rhythmType: RhythmType;
  animationType: AnimationType;
  intensity: Intensity;
  size: Size;
  speed: number;
  showRhythm: boolean;
}

const ASCIIDemo: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  const { t } = useTranslation();
  const [config, setConfig] = useState<DemoConfig>({
    theme: 'matrix',
    rhythmType: 'heartbeat',
    animationType: 'typewriter',
    intensity: 'medium',
    size: 'medium',
    speed: 100,
    showRhythm: true
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const updateConfig = (key: keyof DemoConfig, value: string | boolean | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetDemo = () => {
    setResetKey(prev => prev + 1);
    setConfig({
      theme: 'matrix',
      rhythmType: 'heartbeat',
      animationType: 'typewriter',
      intensity: 'medium',
      size: 'medium',
      speed: 100,
      showRhythm: true
    });
  };

  const themeOptions: { value: Theme; label: string; color: string }[] = [
    { value: 'matrix', label: 'Matrix 绿', color: '#00ff41' },
    { value: 'cyber', label: 'Cyber 蓝', color: '#00d4ff' },
    { value: 'neon', label: 'Neon 紫', color: '#ff00ff' },
    { value: 'rainbow', label: '彩虹', color: 'linear-gradient(45deg, #ff0080, #8000ff, #00ff80)' }
  ];

  const rhythmOptions: { value: RhythmType; label: string; description: string }[] = [
    { value: 'heartbeat', label: '心跳', description: '模拟心跳节拍的律动' },
    { value: 'wave', label: '波浪', description: '流动的波浪效果' },
    { value: 'pulse', label: '脉冲', description: '规律的脉冲闪烁' },
    { value: 'glitch', label: '故障', description: '随机的故障效果' }
  ];

  const animationOptions: { value: AnimationType; label: string; description: string }[] = [
    { value: 'typewriter', label: '打字机', description: '逐字显示效果' },
    { value: 'wave', label: '波浪', description: '字符波浪动画' },
    { value: 'pulse', label: '脉冲', description: '整行脉冲效果' },
    { value: 'glitch', label: '故障', description: '字符故障效果' }
  ];

  return (
    <div className="min-h-screen relative theme-transition">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 theme-transition mt-14">
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
                {t('ascii.title', { fallback: 'ASCII 演示' }) as string}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? (t('particleField.pause') as string) : (t('particleField.play') as string)}
              </button>
              <button
                onClick={resetDemo}
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
          <div className={`${isMobile ? 'order-2' : 'lg:col-span-1'} space-y-6`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 theme-transition">
              <div className="flex items-center gap-2 mb-4">
                <Settings size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('common.settings') as string}</h2>
              </div>

              {/* 显示模式 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ascii.displayMode', { fallback: '显示模式' }) as string}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateConfig('showRhythm', false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !config.showRhythm
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('ascii.display.staticText', { fallback: '静态文字' }) as string}
                  </button>
                  <button
                    onClick={() => updateConfig('showRhythm', true)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      config.showRhythm
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('ascii.display.rhythmEffect', { fallback: '律动效果' }) as string}
                  </button>
                </div>
              </div>

              {/* 主题选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ascii.theme.title', { fallback: '主题配色' }) as string}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateConfig('theme', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        config.theme === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mx-auto mb-1"
                        style={{ 
                          background: option.value === 'rainbow' 
                            ? 'linear-gradient(45deg, #ff0080, #8000ff, #00ff80)' 
                            : option.color 
                        }}
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {t(`ascii.theme.${option.value}`, { fallback: option.label }) as string}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 律动类型 */}
              {config.showRhythm && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('ascii.rhythm.title', { fallback: '律动类型' }) as string}
                  </label>
                  <div className="space-y-2">
                    {rhythmOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateConfig('rhythmType', option.value)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          config.rhythmType === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {t(`ascii.rhythm.${option.value}.label`, { fallback: option.label }) as string}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {t(`ascii.rhythm.${option.value}.desc`, { fallback: option.description }) as string}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 动画类型 */}
              {!config.showRhythm && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('ascii.animation.title', { fallback: '动画类型' }) as string}
                  </label>
                  <div className="space-y-2">
                    {animationOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateConfig('animationType', option.value)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          config.animationType === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {t(`ascii.animation.${option.value}.label`, { fallback: option.label }) as string}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {t(`ascii.animation.${option.value}.desc`, { fallback: option.description }) as string}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 强度控制 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ascii.intensity.title', { fallback: '效果强度' }) as string}
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as Intensity[]).map((intensity) => (
                    <button
                      key={intensity}
                      onClick={() => updateConfig('intensity', intensity)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        config.intensity === intensity
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {intensity === 'low' ? (t('ascii.intensity.low') as string) : intensity === 'medium' ? (t('ascii.intensity.medium') as string) : (t('ascii.intensity.high') as string)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 尺寸控制 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ascii.size.title', { fallback: '显示尺寸' }) as string}
                </label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as Size[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateConfig('size', size)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        config.size === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {size === 'small' ? (t('ascii.size.small') as string) : size === 'medium' ? (t('ascii.size.medium') as string) : (t('ascii.size.large') as string)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 速度控制 */}
              {!config.showRhythm && config.animationType === 'typewriter' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('ascii.typewriter.speedLabel', { fallback: '打字速度' }) as string}: {config.speed}ms
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    value={config.speed}
                    onChange={(e) => updateConfig('speed', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

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
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 theme-transition">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('ascii.docs.title') as string}
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.display.title') as string}</h4>
                  <ul className="space-y-1">
                    <li>• <strong>{t('ascii.display.staticText') as string}</strong>: {t('ascii.docs.display.static') as string}</li>
                    <li>• <strong>{t('ascii.display.rhythmEffect') as string}</strong>: {t('ascii.docs.display.rhythm') as string}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.theme.title') as string}</h4>
                  <ul className="space-y-1">
                    <li>• <strong>{t('ascii.theme.matrix') as string}</strong>: {t('ascii.docs.theme.matrix') as string}</li>
                    <li>• <strong>{t('ascii.theme.cyber') as string}</strong>: {t('ascii.docs.theme.cyber') as string}</li>
                    <li>• <strong>{t('ascii.theme.neon') as string}</strong>: {t('ascii.docs.theme.neon') as string}</li>
                    <li>• <strong>{t('ascii.theme.rainbow') as string}</strong>: {t('ascii.docs.theme.rainbow') as string}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.rhythm.title') as string}</h4>
                  <ul className="space-y-1">
                    <li>• <strong>{t('ascii.rhythm.heartbeat.label') as string}</strong>: {t('ascii.docs.rhythm.heartbeat') as string}</li>
                    <li>• <strong>{t('ascii.rhythm.wave.label') as string}</strong>: {t('ascii.docs.rhythm.wave') as string}</li>
                    <li>• <strong>{t('ascii.rhythm.pulse.label') as string}</strong>: {t('ascii.docs.rhythm.pulse') as string}</li>
                    <li>• <strong>{t('ascii.rhythm.glitch.label') as string}</strong>: {t('ascii.docs.rhythm.glitch') as string}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.tech.title') as string}</h4>
                  <ul className="space-y-1">
                    <li>• {t('ascii.docs.tech.canvas') as string}</li>
                    <li>• {t('ascii.docs.tech.responsive') as string}</li>
                    <li>• {t('ascii.docs.tech.controls') as string}</li>
                    <li>• {t('ascii.docs.tech.effects') as string}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export { ASCIIDemo as default };
