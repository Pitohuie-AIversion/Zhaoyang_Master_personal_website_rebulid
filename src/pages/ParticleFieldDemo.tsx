import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../components/common/TranslationProvider';
import { ParticleField as ParticleFieldComponent } from '../components/ParticleField/ParticleField';
import { ParticleFieldConfig, builtinPresets } from '../utils/configManager';
import { PerformanceMetrics } from '../utils/performanceMonitor';
import { 
  Settings, 
  Play, 
  Pause,
  RotateCcw, 
  Monitor, 
  Palette,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';

const ParticleFieldDemo: React.FC = () => {
  const { t } = useTranslation();
  
  const [config, setConfig] = useState<ParticleFieldConfig>(builtinPresets[0].config);
  const [isPlaying, setIsPlaying] = useState(true);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState('ocean-calm');
  
  const handleConfigChange = useCallback((newConfig: ParticleFieldConfig) => {
    setConfig(newConfig);
  }, []);
  
  const handlePerformanceUpdate = useCallback((newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  }, []);
  
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const resetSystem = useCallback(() => {
    // Reset to current preset configuration
    // setConfig(builtinPresets[selectedPreset].config);
  }, [selectedPreset]);
  
  const toggleStats = useCallback(() => {
    setShowStats(prev => !prev);
  }, []);
  
  const togglePresets = useCallback(() => {
    setShowPresets(prev => !prev);
  }, []);
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);
  
  const applyPreset = useCallback((presetId: string) => {
    const preset = builtinPresets.find(p => p.id === presetId);
    if (preset) {
      // setConfig(preset.config);
      setSelectedPreset(presetId);
      setShowPresets(false);
    }
  }, []);
  
  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);
  
  // 监听全屏状态变化
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // 键盘快捷键
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          togglePlayback();
          break;
        case 'KeyR':
          event.preventDefault();
          resetSystem();
          break;
        case 'KeyS':
          event.preventDefault();
          toggleStats();
          break;
        case 'KeyP':
          event.preventDefault();
          togglePresets();
          break;
        case 'KeyF':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyI':
          event.preventDefault();
          toggleInfo();
          break;
        case 'Escape':
          if (showPresets) setShowPresets(false);
          if (showInfo) setShowInfo(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayback, resetSystem, toggleStats, togglePresets, toggleFullscreen, toggleInfo, showPresets, showInfo]);
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 粒子场全屏背景 */}
      <div className="absolute inset-0 z-0">
        <ParticleFieldComponent
          className="w-full h-full"
          onConfigChange={handleConfigChange}
          onPerformanceUpdate={handlePerformanceUpdate}
          enableControls={false}
          autoStart={true}
        />
      </div>
      
      {/* 控制界面覆盖层 */}
      <div className="relative z-10 min-h-screen">
        {/* 顶部控制栏 */}
        <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent transition-all duration-300 ${isFullscreen ? 'opacity-0 hover:opacity-100' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/particle-field" 
                className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-black/50 transition-all duration-200"
                title={t('particleField.backToMain')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <h1 className="text-xl font-bold text-white">
                {t('particleField.demoMode')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleInfo}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showInfo 
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-400/30' 
                    : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
                }`}
                title={t('particleField.toggleInfo')}
              >
                <Info className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleStats}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showStats 
                    ? 'bg-green-500/30 text-green-300 border border-green-400/30' 
                    : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
                }`}
                title={t('particleField.toggleStats')}
              >
                <Monitor className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePresets}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showPresets 
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400/30' 
                    : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
                }`}
                title={t('particleField.presets')}
              >
                <Palette className="w-5 h-5" />
              </button>
              
              <Link
                to="/particle-field/settings"
                className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white/70 hover:text-white hover:bg-black/50 transition-all duration-200"
                title={t('particleField.settings')}
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* 底部控制栏 */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300 ${isFullscreen ? 'opacity-0 hover:opacity-100' : ''}`}>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={togglePlayback}
              className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-200"
              title={isPlaying ? t('particleField.pause') : t('particleField.play')}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={resetSystem}
              className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-200"
              title={t('particleField.reset')}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-200"
              title={isFullscreen ? t('particleField.exitFullscreen') : t('particleField.fullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* 信息面板 */}
        {showInfo && (
          <div className="absolute top-20 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-white max-w-md">
            <h3 className="text-lg font-semibold mb-4">{t('particleField.controls')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('particleField.shortcuts.space')}:</span>
                <span className="text-white/70">{t('particleField.shortcuts.playPause')}</span>
              </div>
              <div className="flex justify-between">
                <span>R:</span>
                <span className="text-white/70">{t('particleField.shortcuts.reset')}</span>
              </div>
              <div className="flex justify-between">
                <span>S:</span>
                <span className="text-white/70">{t('particleField.shortcuts.stats')}</span>
              </div>
              <div className="flex justify-between">
                <span>P:</span>
                <span className="text-white/70">{t('particleField.shortcuts.presets')}</span>
              </div>
              <div className="flex justify-between">
                <span>F:</span>
                <span className="text-white/70">{t('particleField.shortcuts.fullscreen')}</span>
              </div>
              <div className="flex justify-between">
                <span>I:</span>
                <span className="text-white/70">{t('particleField.shortcuts.info')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('particleField.shortcuts.mouse')}:</span>
                <span className="text-white/70">{t('particleField.shortcuts.interact')}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* 预设面板 */}
        {showPresets && (
          <div className="absolute top-20 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-white max-w-sm">
            <h3 className="text-lg font-semibold mb-4">{t('particleField.presets')}</h3>
            <div className="space-y-2">
              {builtinPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedPreset === preset.id
                      ? 'bg-blue-500/30 border border-blue-400/50'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm text-white/70 mt-1">{preset.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preset.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 性能统计面板 */}
        {showStats && metrics && (
          <div className="absolute bottom-20 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-white text-sm min-w-[200px]">
            <h4 className="font-semibold mb-2">{t('particleField.performanceStats')}</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>{t('particleField.performance.fps') as string}:</span>
                <span className={metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
                  {Math.round(metrics.fps)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('particleField.particles')}:</span>
                <span>{metrics.particleCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('particleField.frameTime')}:</span>
                <span>{metrics.frameTime.toFixed(1)}ms</span>
              </div>
              <div className="flex justify-between">
                <span>{t('particleField.memory')}:</span>
                <span>{metrics.memoryUsage.toFixed(1)}MB</span>
              </div>
              <div className="flex justify-between">
                <span>{t('particleField.avgFps')}:</span>
                <span>{Math.round(metrics.averageFps)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticleFieldDemo;
