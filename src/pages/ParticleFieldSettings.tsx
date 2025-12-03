import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../components/TranslationProvider';
import { ParticleField as ParticleFieldComponent } from '../components/ParticleField/ParticleField';
import { 
  ParticleFieldConfig, 
  ConfigManager, 
  builtinPresets,
  defaultConfig,
  ConfigPreset 
} from '../utils/configManager';
import { PerformanceMetrics, performancePresets } from '../utils/performanceMonitor';
import { 
  ArrowLeft,
  Save,
  Upload,
  Download,
  Play,
  Pause,
  Monitor,
  Palette,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Sliders,
  Zap,
  Gamepad2,
  RotateCcw
} from 'lucide-react';

interface ControlPanelProps {
  config: ParticleFieldConfig;
  onConfigChange: (config: ParticleFieldConfig) => void;
  onPresetApply: (preset: ConfigPreset) => void;
  onPresetSave: (name: string, description: string) => void;
  onPresetDelete: (id: string) => void;
  metrics?: PerformanceMetrics;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onConfigChange,
  onPresetApply,
  onPresetSave,
  onPresetDelete,
  metrics
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'particles' | 'postprocess' | 'interaction' | 'presets'>('particles');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [customPresets, setCustomPresets] = useState<ConfigPreset[]>([]);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  
  const configManager = useRef(new ConfigManager());
  
  useEffect(() => {
    // 加载自定义预设
    const presets = configManager.current.getCustomPresets();
    setCustomPresets(presets);
  }, []);
  
  const updateParticleConfig = useCallback((updates: Partial<typeof config.particle>) => {
    onConfigChange({
      ...config,
      particle: { ...config.particle, ...updates }
    });
  }, [config, onConfigChange]);
  
  const updatePostProcessConfig = useCallback((updates: Partial<typeof config.postProcess>) => {
    onConfigChange({
      ...config,
      postProcess: { ...config.postProcess, ...updates }
    });
  }, [config, onConfigChange]);
  
  const updateInteractionConfig = useCallback((updates: Partial<typeof config.interaction>) => {
    onConfigChange({
      ...config,
      interaction: { ...config.interaction, ...updates }
    });
  }, [config, onConfigChange]);
  
  const handleSavePreset = useCallback(() => {
    if (presetName.trim()) {
      onPresetSave(presetName.trim(), presetDescription.trim());
      const newPreset: ConfigPreset = {
        id: `custom-${Date.now()}`,
        name: presetName.trim(),
        description: presetDescription.trim(),
        config,
        tags: ['custom'],
        isCustom: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      configManager.current.saveCustomPreset(newPreset);
      setCustomPresets(prev => [...prev, newPreset]);
      setShowSaveDialog(false);
      setPresetName('');
      setPresetDescription('');
    }
  }, [presetName, presetDescription, config, onPresetSave]);
  
  const handleDeletePreset = useCallback((presetId: string) => {
    configManager.current.deleteCustomPreset(presetId);
    setCustomPresets(prev => prev.filter(p => p.id !== presetId));
    onPresetDelete(presetId);
  }, [onPresetDelete]);
  
  const applyPerformancePreset = useCallback((level: 'low' | 'medium' | 'high' | 'ultra') => {
    const preset = performancePresets[level];
    updateParticleConfig(preset);
  }, [updateParticleConfig]);
  
  const resetToDefault = useCallback(() => {
    onConfigChange(defaultConfig);
  }, [onConfigChange]);
  
  const exportConfig = useCallback(() => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `particle-field-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [config]);
  
  const importConfig = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          onConfigChange(importedConfig);
        } catch (error) {
          console.error('Failed to import config:', error);
        }
      };
      reader.readAsText(file);
    }
  }, [onConfigChange]);
  
  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* 标签页导航 */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('particles')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'particles' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.particles')}
        </button>
        <button
          onClick={() => setActiveTab('postprocess')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'postprocess' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Sliders className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.postProcess')}
        </button>
        <button
          onClick={() => setActiveTab('interaction')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'interaction' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.interaction')}
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'presets' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          {t('particleField.settings.presets')}
        </button>
      </div>
      
      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 粒子设置 */}
        {activeTab === 'particles' && (
          <div className="space-y-6">
            {/* 性能预设 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.performancePresets')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(performancePresets).map(([level, preset]) => (
                  <button
                    key={level}
                    onClick={() => applyPerformancePreset(level as 'low' | 'medium' | 'high' | 'ultra')}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium capitalize">{level}</div>
                    <div className="text-sm text-gray-400">
                      {preset.maxParticles.toLocaleString()} {t('particleField.particles')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 基础设置 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.basic')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.maxParticles')}: {config.particle.particleCount}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="100"
                    value={config.particle.particleCount}
                    onChange={(e) => updateParticleConfig({ particleCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.spawnRate')}: {config.particle.particleCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={config.particle.particleCount}
                    onChange={(e) => updateParticleConfig({ particleCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.lifespan')}: {config.particle.visual.opacity.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={config.particle.visual.opacity}
                    onChange={(e) => updateParticleConfig({ visual: { ...config.particle.visual, opacity: parseFloat(e.target.value) } })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.size')}: {config.particle.visual.maxSize.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={config.particle.visual.maxSize}
                    onChange={(e) => updateParticleConfig({ visual: { ...config.particle.visual, maxSize: parseFloat(e.target.value) } })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* 物理设置 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.physics')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.gravity')}: {config.particle.physics.gravity.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="-0.1"
                    max="0.1"
                    step="0.001"
                    value={config.particle.physics.gravity}
                    onChange={(e) => updateParticleConfig({ physics: { ...config.particle.physics, gravity: parseFloat(e.target.value) } })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.damping')}: {config.particle.physics.damping.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="0.9"
                    max="1.0"
                    step="0.001"
                    value={config.particle.physics.damping}
                    onChange={(e) => updateParticleConfig({ physics: { ...config.particle.physics, damping: parseFloat(e.target.value) } })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.noiseStrength')}: {config.particle.physics.turbulence.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={config.particle.physics.turbulence}
                    onChange={(e) => updateParticleConfig({ physics: { ...config.particle.physics, turbulence: parseFloat(e.target.value) } })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.noiseScale')}: {config.particle.noiseScale.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="0.01"
                    step="0.0001"
                    value={config.particle.noiseScale}
                    onChange={(e) => updateParticleConfig({ noiseScale: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* 颜色设置 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.colors')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.colorScheme')}
                  </label>
                  <select
                    value={config.particle.colorScheme}
                    onChange={(e) => updateParticleConfig({ colorScheme: e.target.value as 'ocean' | 'fire' | 'electric' | 'cosmic' | 'storm' | 'abyss' | 'aurora' | 'monochrome' })}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                  >
                    <option value="blue">{t('particleField.settings.colorOptions.blue') as string}</option>
                    <option value="rainbow">{t('particleField.settings.colorOptions.rainbow') as string}</option>
                    <option value="fire">{t('particleField.settings.colorOptions.fire') as string}</option>
                    <option value="ice">{t('particleField.settings.colorOptions.ice') as string}</option>
                    <option value="forest">{t('particleField.settings.colorOptions.forest') as string}</option>
                    <option value="sunset">{t('particleField.settings.colorOptions.sunset') as string}</option>
                    <option value="monochrome">{t('particleField.settings.colorOptions.monochrome') as string}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 后处理设置 */}
        {activeTab === 'postprocess' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.bloom')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {t('particleField.settings.enableBloom')}
                  </label>
                  <button
                    onClick={() => updatePostProcessConfig({ bloomEnabled: !config.postProcess.bloomEnabled })}
                    className={`p-2 rounded ${
                      config.postProcess.bloomEnabled 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {config.postProcess.bloomEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                {config.postProcess.bloomEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('particleField.settings.bloomIntensity')}: {config.postProcess.bloomIntensity.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.01"
                        value={config.postProcess.bloomIntensity}
                        onChange={(e) => updatePostProcessConfig({ bloomIntensity: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('particleField.settings.blurAmount')}: {config.postProcess.blurAmount.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={config.postProcess.blurAmount}
                        onChange={(e) => updatePostProcessConfig({ blurAmount: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.colorCorrection')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.contrast')}: {config.postProcess.contrast.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.01"
                    value={config.postProcess.contrast}
                    onChange={(e) => updatePostProcessConfig({ contrast: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.saturation')}: {config.postProcess.saturation.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={config.postProcess.saturation}
                    onChange={(e) => updatePostProcessConfig({ saturation: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.colorTemperature')}: {config.postProcess.colorTemperature.toFixed(0)}K
                  </label>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="100"
                    value={config.postProcess.colorTemperature}
                    onChange={(e) => updatePostProcessConfig({ colorTemperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.effects')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.noiseAmount')}: {config.postProcess.noiseAmount.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.1"
                    step="0.001"
                    value={config.postProcess.noiseAmount}
                    onChange={(e) => updatePostProcessConfig({ noiseAmount: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.vignetteStrength')}: {config.postProcess.vignetteStrength.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.postProcess.vignetteStrength}
                    onChange={(e) => updatePostProcessConfig({ vignetteStrength: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 交互设置 */}
        {activeTab === 'interaction' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.mouse')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {t('particleField.settings.enableMouse')}
                  </label>
                  <button
                    onClick={() => updateInteractionConfig({ enabled: !config.interaction.enabled })}
                    className={`p-2 rounded ${
                      config.interaction.enabled 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {config.interaction.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                {config.interaction.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('particleField.settings.mouseRadius')}: {config.interaction.interactionRadius}
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={config.interaction.interactionRadius}
                        onChange={(e) => updateInteractionConfig({ interactionRadius: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('particleField.settings.mouseStrength')}: {config.interaction.mouseInfluence.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={config.interaction.mouseInfluence}
                        onChange={(e) => updateInteractionConfig({ mouseInfluence: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('particleField.settings.smoothing')}: {config.interaction.dampingFactor.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={config.interaction.dampingFactor}
                        onChange={(e) => updateInteractionConfig({ dampingFactor: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.touch')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {t('particleField.settings.enableTouch')}
                  </label>
                  <button
                    onClick={() => updateInteractionConfig({ enableTouch: !config.interaction.enableTouch })}
                    className={`p-2 rounded ${
                      config.interaction.enableTouch 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {config.interaction.enableTouch ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('particleField.settings.maxTouches')}: {config.interaction.maxTouches}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={config.interaction.maxTouches}
                    onChange={(e) => updateInteractionConfig({ maxTouches: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 预设管理 */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            {/* 内置预设 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.builtinPresets')}</h3>
              <div className="space-y-2">
                {builtinPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-sm text-gray-400">{preset.description}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {preset.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => onPresetApply(preset)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                      >
                        {t('particleField.settings.apply')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 自定义预设 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{t('particleField.settings.customPresets')}</h3>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  {t('particleField.settings.savePreset')}
                </button>
              </div>
              
              {customPresets.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  {t('particleField.settings.noCustomPresets')}
                </div>
              ) : (
                <div className="space-y-2">
                  {customPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {editingPreset === preset.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={preset.name}
                                onChange={(e) => {
                                  const updated = customPresets.map(p => 
                                    p.id === preset.id ? { ...p, name: e.target.value } : p
                                  );
                                  setCustomPresets(updated);
                                }}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm"
                              />
                              <textarea
                                value={preset.description}
                                onChange={(e) => {
                                  const updated = customPresets.map(p => 
                                    p.id === preset.id ? { ...p, description: e.target.value } : p
                                  );
                                  setCustomPresets(updated);
                                }}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm resize-none"
                                rows={2}
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium">{preset.name}</div>
                              <div className="text-sm text-gray-400">{preset.description}</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {editingPreset === preset.id ? (
                            <>
                              <button
                                onClick={() => {
                                  configManager.current.updateCustomPreset(preset.id, preset);
                                  setEditingPreset(null);
                                }}
                                className="p-1 text-green-400 hover:text-green-300"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingPreset(null)}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => onPresetApply(preset)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                              >
                                {t('particleField.settings.apply')}
                              </button>
                              <button
                                onClick={() => setEditingPreset(preset.id)}
                                className="p-1 text-gray-400 hover:text-white"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePreset(preset.id)}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 底部操作栏 */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={resetToDefault}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4 inline mr-1" />
              {t('particleField.settings.reset')}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm cursor-pointer transition-colors">
              <Upload className="w-4 h-4 inline mr-1" />
              {t('particleField.settings.import')}
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
            </label>
            
            <button
              onClick={exportConfig}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
            >
              <Download className="w-4 h-4 inline mr-1" />
              {t('particleField.settings.export')}
            </button>
          </div>
        </div>
        
        {/* 性能指标 */}
        {metrics && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span>FPS: <span className={metrics.fps < 30 ? 'text-red-400' : 'text-green-400'}>{Math.round(metrics.fps)}</span></span>
                <span>{t('particleField.particles')}: {metrics.particleCount.toLocaleString()}</span>
                <span>{t('particleField.memory')}: {metrics.memoryUsage.toFixed(1)}MB</span>
              </div>
              <Monitor className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
      
      {/* 保存预设对话框 */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-600">
            <h3 className="text-lg font-semibold mb-4">{t('particleField.settings.savePreset')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('particleField.settings.presetName')}
                </label>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  placeholder={t('particleField.settings.enterPresetName')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('particleField.settings.presetDescription')}
                </label>
                <textarea
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded resize-none"
                  rows={3}
                  placeholder={t('particleField.settings.enterPresetDescription')}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                {t('particleField.settings.cancel')}
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
              >
                <Save className="w-4 h-4 inline mr-1" />
                {t('particleField.settings.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ParticleFieldSettings: React.FC = () => {
  const { t } = useTranslation();
  const particleFieldRef = useRef<HTMLCanvasElement>(null);
  
  const [config, setConfig] = useState<ParticleFieldConfig | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  
  const handleConfigChange = useCallback((newConfig: ParticleFieldConfig) => {
    setConfig(newConfig);
  }, []);
  
  const handlePerformanceUpdate = useCallback((newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  }, []);
  
  const handlePresetApply = useCallback((preset: ConfigPreset) => {
    handleConfigChange(preset.config);
  }, [handleConfigChange]);
  
  const handlePresetSave = useCallback(() => {
    // 预设保存逻辑已在 ControlPanel 中处理
  }, []);
  
  const handlePresetDelete = useCallback(() => {
    // 预设删除逻辑已在 ControlPanel 中处理
  }, []);
  
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const resetSystem = useCallback(() => {
    // Reset to default configuration
    if (config) {
      handleConfigChange(defaultConfig);
    }
  }, [config, handleConfigChange]);
  
  const togglePreview = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* 左侧控制面板 */}
        <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* 头部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link 
                  to="/particle-field" 
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('particleField.settings.title')}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePreview}
                  className={`p-2 rounded transition-colors ${
                    showPreview 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={showPreview ? t('particleField.settings.hidePreview') : t('particleField.settings.showPreview')}
                >
                  {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* 控制面板内容 */}
          {config && (
            <ControlPanel
              config={config}
              onConfigChange={handleConfigChange}
              onPresetApply={handlePresetApply}
              onPresetSave={handlePresetSave}
              onPresetDelete={handlePresetDelete}
              metrics={metrics || undefined}
            />
          )}
        </div>
        
        {/* 右侧预览区域 */}
        {showPreview && (
          <div className="flex-1 relative bg-black">
            {/* 粒子场预览 */}
            <ParticleFieldComponent
              className="w-full h-full"
              onConfigChange={setConfig}
              onPerformanceUpdate={handlePerformanceUpdate}
              enableControls={false}
              autoStart={true}
            />
            
            {/* 预览控制覆盖层 */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <button
                onClick={togglePlayback}
                className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-all duration-200"
                title={isPlaying ? t('particleField.pause') : t('particleField.play')}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={resetSystem}
                className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-all duration-200"
                title={t('particleField.reset')}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <Link
                to="/particle-field/demo"
                className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-all duration-200"
                title={t('particleField.demoMode')}
              >
                <Play className="w-5 h-5" />
              </Link>
            </div>
            
            {/* 预览标签 */}
            <div className="absolute bottom-4 left-4">
              <div className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-lg text-white text-sm">
                {t('particleField.settings.livePreview')}
              </div>
            </div>
          </div>
        )}
        
        {/* 无预览时的占位 */}
        {!showPreview && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('particleField.settings.previewHidden')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('particleField.settings.previewHiddenDesc')}
              </p>
              <button
                onClick={togglePreview}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {t('particleField.settings.showPreview')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticleFieldSettings;
