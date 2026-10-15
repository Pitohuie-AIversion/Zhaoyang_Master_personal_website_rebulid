export type ASCIIThemeName = 'matrix' | 'cyber' | 'neon';
export type ASCIIAnimationType = 'typewriter' | 'wave' | 'pulse' | 'glitch';
export type ASCIISize = 'small' | 'medium' | 'large';

export interface ZhaoyangASCIITextProps {
  theme?: ASCIIThemeName;
  animationType?: ASCIIAnimationType;
  size?: ASCIISize;
  speed?: number;
  className?: string;
}

export interface ASCIIThemeColors {
  primary: string;
  secondary: string;
  glow: string;
  background: string;
}

export interface ASCIISizeSetting {
  fontSize: string;
  lineHeight: string;
  useSimple: boolean;
}
