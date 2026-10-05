import React, { useState, useCallback } from 'react';
import { ParticleField as ParticleFieldComponent } from '../components/ParticleField/ParticleField';
import { ParticleFieldConfig } from '../utils/configManager';
import { PerformanceMetrics } from '../utils/performanceMonitor';
import { ParticleFieldSEO } from '../components/seo/SEOOptimization';
import {
  ParticleHeroSection,
  ParticleTechnicalFeatures,
  ParticleFloatingStats,
} from '../components/ParticleField/overview';

const ParticleField: React.FC = () => {
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
    setShowStats((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <ParticleFieldSEO />

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
        {/* 主要内容区域 */}
        <div className="flex-1 flex items-center justify-center p-6 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <ParticleHeroSection
              showStats={showStats}
              onToggleStats={toggleStats}
            />

            <ParticleTechnicalFeatures />
          </div>
        </div>

        {/* 性能统计面板 */}
        {showStats && metrics && <ParticleFloatingStats metrics={metrics} />}
      </div>
    </div>
  );
};

export default ParticleField;
