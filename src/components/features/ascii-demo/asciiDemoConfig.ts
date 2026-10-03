export type Theme = 'matrix' | 'cyber' | 'neon' | 'rainbow';
export type RhythmType = 'heartbeat' | 'wave' | 'pulse' | 'glitch';
export type AnimationType = 'typewriter' | 'wave' | 'pulse' | 'glitch';
export type Intensity = 'low' | 'medium' | 'high';
export type Size = 'small' | 'medium' | 'large';

export interface DemoConfig {
  theme: Theme;
  rhythmType: RhythmType;
  animationType: AnimationType;
  intensity: Intensity;
  size: Size;
  speed: number;
  showRhythm: boolean;
}

export const defaultDemoConfig: DemoConfig = {
  theme: 'matrix',
  rhythmType: 'heartbeat',
  animationType: 'typewriter',
  intensity: 'medium',
  size: 'medium',
  speed: 100,
  showRhythm: true
};

export const getThemeOptions = (t: (key: string, options?: Record<string, unknown>) => string) => [
  { value: 'matrix' as Theme, label: t('ascii.theme.matrix') as string, color: '#00ff41' },
  { value: 'cyber' as Theme, label: t('ascii.theme.cyber') as string, color: '#00d4ff' },
  { value: 'neon' as Theme, label: t('ascii.theme.neon') as string, color: '#ff00ff' },
  { value: 'rainbow' as Theme, label: t('ascii.theme.rainbow') as string, color: 'linear-gradient(45deg, #ff0080, #8000ff, #00ff80)' }
];

export const getRhythmOptions = (t: (key: string, options?: Record<string, unknown>) => string) => [
  { value: 'heartbeat' as RhythmType, label: t('ascii.rhythm.heartbeat.label') as string, description: t('ascii.rhythm.heartbeat.desc') as string },
  { value: 'wave' as RhythmType, label: t('ascii.rhythm.wave.label') as string, description: t('ascii.rhythm.wave.desc') as string },
  { value: 'pulse' as RhythmType, label: t('ascii.rhythm.pulse.label') as string, description: t('ascii.rhythm.pulse.desc') as string },
  { value: 'glitch' as RhythmType, label: t('ascii.rhythm.glitch.label') as string, description: t('ascii.rhythm.glitch.desc') as string }
];

export const getAnimationOptions = (t: (key: string, options?: Record<string, unknown>) => string) => [
  { value: 'typewriter' as AnimationType, label: t('ascii.animation.typewriter.label') as string, description: t('ascii.animation.typewriter.desc') as string },
  { value: 'wave' as AnimationType, label: t('ascii.animation.wave.label') as string, description: t('ascii.animation.wave.desc') as string },
  { value: 'pulse' as AnimationType, label: t('ascii.animation.pulse.label') as string, description: t('ascii.animation.pulse.desc') as string },
  { value: 'glitch' as AnimationType, label: t('ascii.animation.glitch.label') as string, description: t('ascii.animation.glitch.desc') as string }
];
