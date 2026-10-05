export interface ZhaoyangASCIIRhythmProps {
  theme?: 'matrix' | 'cyber' | 'neon' | 'rainbow';
  rhythmType?: 'heartbeat' | 'wave' | 'pulse' | 'glitch' | 'typewriter' | 'matrix-rain';
  intensity?: 'low' | 'medium' | 'high';
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  transparent?: boolean;
}

export interface CharacterState {
  char: string;
  opacity: number;
  scale: number;
  color: string;
  glowIntensity: number;
  animationDelay: number;
}

// ZHAOYANG ASCII 艺术字（优化版）
export const asciiLines = [
  '███████╗██╗  ██╗ █████╗  ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗ ',
  '╚══███╔╝██║  ██║██╔══██╗██╔═══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██╔════╝ ',
  '  ███╔╝ ███████║███████║██║   ██║ ╚████╔╝ ███████║██╔██╗ ██║██║  ███╗',
  ' ███╔╝  ██╔══██║██╔══██║██║   ██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║   ██║',
  '███████╗██║  ██║██║  ██║╚██████╔╝   ██║   ██║  ██║██║ ╚████║╚██████╔╝',
  '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ '
];

// 主题配色系统
export const themes = {
  matrix: {
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#00cc33',
    glow: '#00ff41',
    background: 'rgba(0, 0, 0, 0.9)'
  },
  cyber: {
    primary: '#00d4ff',
    secondary: '#0099cc',
    accent: '#66e6ff',
    glow: '#00d4ff',
    background: 'rgba(0, 20, 40, 0.9)'
  },
  neon: {
    primary: '#ff00ff',
    secondary: '#cc00cc',
    accent: '#ff66ff',
    glow: '#ff00ff',
    background: 'rgba(20, 0, 20, 0.9)'
  },
  rainbow: {
    primary: '#ff0080',
    secondary: '#8000ff',
    accent: '#00ff80',
    glow: '#ff0080',
    background: 'rgba(10, 10, 30, 0.9)'
  }
};

// 强度配置
export const intensityConfig = {
  low: {
    speed: 0.5,
    amplitude: 0.3,
    glowRange: [0.5, 1],
    scaleRange: [0.9, 1.1]
  },
  medium: {
    speed: 1,
    amplitude: 0.6,
    glowRange: [0.3, 1.2],
    scaleRange: [0.8, 1.3]
  },
  high: {
    speed: 1.5,
    amplitude: 1,
    glowRange: [0.1, 1.5],
    scaleRange: [0.7, 1.5]
  }
};
