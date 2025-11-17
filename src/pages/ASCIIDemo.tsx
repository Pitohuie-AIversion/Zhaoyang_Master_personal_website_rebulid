import React, { useState } from 'react';
import { ArrowLeft, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ZhaoyangASCIIText from '../components/ZhaoyangASCIIText';
import ZhaoyangASCIIRhythm from '../components/ZhaoyangASCIIRhythm';
import { ResponsiveContainer } from '../components/ResponsiveEnhancements';
import { useResponsive } from '../components/ResponsiveEnhancements';
import SimpleMotion from '../components/SimpleMotion';

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
                <span>返回首页</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ZHAOYANG ASCII 演示
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? '暂停' : '播放'}
              </button>
              <button
                onClick={resetDemo}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={16} />
                重置
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">控制面板</h2>
              </div>

              {/* 显示模式 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  显示模式
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
                    静态文字
                  </button>
                  <button
                    onClick={() => updateConfig('showRhythm', true)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      config.showRhythm
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    律动效果
                  </button>
                </div>
              </div>

              {/* 主题选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  主题配色
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
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 律动类型 */}
              {config.showRhythm && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    律动类型
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
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {option.description}
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
                    动画类型
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
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 强度控制 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  效果强度
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
                      {intensity === 'low' ? '低' : intensity === 'medium' ? '中' : '高'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 尺寸控制 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  显示尺寸
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
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 速度控制 */}
              {!config.showRhythm && config.animationType === 'typewriter' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    打字速度: {config.speed}ms
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
                功能说明
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">显示模式</h4>
                  <ul className="space-y-1">
                    <li>• <strong>静态文字</strong>: 基础的 ASCII 文字显示，支持多种动画效果</li>
                    <li>• <strong>律动效果</strong>: 动态的字符律动，模拟心跳、波浪等效果</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">主题配色</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Matrix 绿</strong>: 经典黑客帝国风格</li>
                    <li>• <strong>Cyber 蓝</strong>: 现代科技感配色</li>
                    <li>• <strong>Neon 紫</strong>: 未来霓虹灯效果</li>
                    <li>• <strong>彩虹</strong>: 动态彩虹渐变色</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">律动类型</h4>
                  <ul className="space-y-1">
                    <li>• <strong>心跳</strong>: 模拟心跳节拍的缩放效果</li>
                    <li>• <strong>波浪</strong>: 流动的波浪式动画</li>
                    <li>• <strong>脉冲</strong>: 规律的闪烁脉冲</li>
                    <li>• <strong>故障</strong>: 随机的故障风格效果</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">技术特性</h4>
                  <ul className="space-y-1">
                    <li>• 基于 Canvas 和 requestAnimationFrame 的高性能渲染</li>
                    <li>• 响应式设计，支持多种屏幕尺寸</li>
                    <li>• 实时动画控制和参数调节</li>
                    <li>• 多种视觉效果的组合和叠加</li>
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