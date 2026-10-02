import React from 'react';
import { ParticleFieldDemoSEO } from '../components/seo/SEOOptimization';
import { ParticleField as ParticleFieldComponent } from '../components/ParticleField/ParticleField';
import {
  useParticleDemoState,
  ParticleDemoHeader,
  ParticleDemoFooter,
  ParticleDemoInfoPanel,
  ParticleDemoPresetsPanel,
  ParticleDemoStatsPanel
} from '../components/features/particle-demo';

const ParticleFieldDemo: React.FC = () => {
  const {
    config,
    isPlaying,
    metrics,
    showStats,
    showPresets,
    isFullscreen,
    showInfo,
    selectedPreset,
    handleConfigChange,
    handlePerformanceUpdate,
    togglePlayback,
    resetSystem,
    toggleStats,
    togglePresets,
    toggleFullscreen,
    applyPreset,
    toggleInfo
  } = useParticleDemoState();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticleFieldDemoSEO />

      {/* 粒子场全屏背景 */}
      <div className="absolute inset-0 z-0">
        <ParticleFieldComponent
          className="w-full h-full"
          config={config}
          isPlaying={isPlaying}
          onConfigChange={handleConfigChange}
          onPerformanceUpdate={handlePerformanceUpdate}
          enableControls={false}
          autoStart={true}
        />
      </div>

      {/* 控制界面覆盖层 */}
      <div className="relative z-10 min-h-screen">
        <ParticleDemoHeader
          isFullscreen={isFullscreen}
          showInfo={showInfo}
          showStats={showStats}
          showPresets={showPresets}
          onToggleInfo={toggleInfo}
          onToggleStats={toggleStats}
          onTogglePresets={togglePresets}
        />

        <ParticleDemoFooter
          isPlaying={isPlaying}
          isFullscreen={isFullscreen}
          onTogglePlayback={togglePlayback}
          onReset={resetSystem}
          onToggleFullscreen={toggleFullscreen}
        />

        <ParticleDemoInfoPanel show={showInfo} />

        <ParticleDemoPresetsPanel
          show={showPresets}
          selectedPreset={selectedPreset}
          onApplyPreset={applyPreset}
        />

        <ParticleDemoStatsPanel
          show={showStats}
          metrics={metrics}
        />
      </div>
    </div>
  );
};

export default ParticleFieldDemo;
