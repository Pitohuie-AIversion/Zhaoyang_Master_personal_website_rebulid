export type MatrixThemeName = 'green' | 'blue' | 'matrix';
export type MatrixIntensity = 'low' | 'medium' | 'high';

export interface TraeASCIIBackgroundProps {
  className?: string;
  intensity?: MatrixIntensity;
  theme?: MatrixThemeName;
  speed?: number;
}

export interface MatrixThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  fade: string;
  glow: string;
  bright: string;
}

export interface IntensitySetting {
  charCount: number;
  spawnRate: number;
}

export interface MatrixCharacter {
  y: number;
  char: string;
  opacity: number;
  brightness: number;
  isHead: boolean;
}

export interface MatrixColumn {
  x: number;
  characters: MatrixCharacter[];
  speed: number;
  lastSpawn: number;
  spawnDelay: number;
}
