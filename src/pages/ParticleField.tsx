import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ParticleField as ParticleFieldComponent } from '../components/ParticleField/ParticleField';
import { ParticleFieldConfig } from '../utils/configManager';
import { PerformanceMetrics } from '../utils/performanceMonitor';
import { Settings, Play, Monitor, Palette } from 'lucide-react';
import { useTranslation } from '../components/common/TranslationProvider';

const ParticleField: React.FC = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showStats, setShowStats] = useState(false);
  
  const handleConfigChange = useCallback((newConfig: ParticleFieldConfig) => {
    // 配置变更处理
    console.log('Particle field config changed:', newConfig);
  }, []);
  
  const handlePerformanceUpdate = useCallback((newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  }, []);
  
  const toggleStats = useCallback(() => {
    setShowStats(prev => !prev);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 粒子场背景 */}
      <div className="absolute inset-0 z-0">
        <ParticleFieldComponent
          className="w-full h-full"
          onConfigChange={handleConfigChange}
          onPerformanceUpdate={handlePerformanceUpdate}
          enableControls={false}
          autoStart={true}
        />
      </div>
      
      {/* 内容覆盖层 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航栏 */}
        <nav className="p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                ← {t('particleField.backToHome')}
              </Link>
              <div className="w-px h-6 bg-white/20"></div>
              <h1 className="text-2xl font-bold text-white">
                {t('particleField.title')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleStats}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showStats 
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-400/30' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
                title={t('particleField.toggleStats')}
              >
                <Monitor className="w-5 h-5" />
              </button>
              
              <Link
                to="/particle-field/demo"
                className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-200"
              >
                <Play className="w-4 h-4 inline mr-2" />
                {t('particleField.demo')}
              </Link>
              
              <Link
                to="/particle-field/settings"
                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-200"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                {t('particleField.settings')}
              </Link>
            </div>
          </div>
        </nav>
        
        {/* 主要内容区域 */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* 标题区域 */}
            <div className="mb-12">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {t('particleField.mainTitle')}
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                {t('particleField.description')}
              </p>
              
              {/* 特性标签 */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  'WebGL 2.0',
                  'Perlin Noise',
                  t('particleField.features.realtime'),
                  t('particleField.features.interactive'),
                  t('particleField.features.responsive')
                ].map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/particle-field/demo"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5 inline mr-2 group-hover:animate-pulse" />
                {t('particleField.startExperience')}
              </Link>
              
              <Link
                to="/particle-field/settings"
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
              >
                <Palette className="w-5 h-5 inline mr-2" />
                {t('particleField.customize')}
              </Link>
            </div>
            
            {/* 技术说明 */}
            <div className="mt-16 text-left">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {t('particleField.technicalFeatures')}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {t('particleField.tech.performance')}
                  </h4>
                  <p className="text-white/70 leading-relaxed">
                    {t('particleField.tech.performanceDesc')}
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {t('particleField.tech.interaction')}
                  </h4>
                  <p className="text-white/70 leading-relaxed">
                    {t('particleField.tech.interactionDesc')}
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {t('particleField.tech.visual')}
                  </h4>
                  <p className="text-white/70 leading-relaxed">
                    {t('particleField.tech.visualDesc')}
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {t('particleField.tech.adaptive')}
                  </h4>
                  <p className="text-white/70 leading-relaxed">
                    {t('particleField.tech.adaptiveDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* 性能统计面板 */}
        {showStats && metrics && (
          <div className="fixed bottom-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-white text-sm min-w-[200px]">
            <h4 className="font-semibold mb-2">{t('particleField.performanceStats')}</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>FPS:</span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticleField;