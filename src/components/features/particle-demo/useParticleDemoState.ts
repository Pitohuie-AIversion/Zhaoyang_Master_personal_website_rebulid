import { useState, useCallback, useEffect } from 'react';
import { ParticleFieldConfig, builtinPresets } from '../../../utils/configManager';
import { PerformanceMetrics } from '../../../utils/performanceMonitor';

export const useParticleDemoState = () => {
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
    const preset = builtinPresets.find(item => item.id === selectedPreset);
    setConfig(preset?.config || builtinPresets[0].config);
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
      setConfig(preset.config);
      setSelectedPreset(presetId);
      setShowPresets(false);
    }
  }, []);

  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 键盘快捷键
  useEffect(() => {
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

  return {
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
  };
};
