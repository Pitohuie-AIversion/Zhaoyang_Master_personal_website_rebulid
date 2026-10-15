import type { MatrixIntensity, MatrixThemeColors, MatrixThemeName, IntensitySetting } from './types';

// 扩展字符集 - 包含日文片假名和特殊ASCII字符
export const matrixChars: readonly string[] = [
  // 数字
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  // 英文字母
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
  // 日文片假名 (Matrix风格)
  'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ', 'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
  'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ',
  'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ', 'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ',
  'ﾔ', 'ﾕ', 'ﾖ', 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ﾝ',
  // 扩展ASCII字符
  '│', '┤', '┐', '└', '┴', '┬', '├', '─', '┼', '┘', '┌',
  '≡', '±', '∞', '∆', '∑', '∏', '∫', '√', '∂', '∇',
  // 特殊符号
  '#', '*', '+', '-', '|', '/', '\\', '=', '<', '>',
  '.', ':', ';', '~', '^', '&', '%', '$', '@', '!',
  '¿', '¡', '©', '®', '™', '°', '±', '÷', '×', '§'
];

// 主题配色 - 优化的Matrix风格渐变
export const themes: Record<MatrixThemeName, MatrixThemeColors> = {
  green: {
    primary: '#00ff41',
    secondary: '#008f11', 
    tertiary: '#003d00',
    fade: '#001a00',
    glow: '#00ff41',
    bright: '#66ff66'
  },
  blue: {
    primary: '#00d4ff',
    secondary: '#0088cc',
    tertiary: '#003366', 
    fade: '#001122',
    glow: '#00d4ff',
    bright: '#66ddff'
  },
  matrix: {
    primary: '#00ff00',
    secondary: '#00cc00',
    tertiary: '#008800',
    fade: '#004400',
    glow: '#00ff00',
    bright: '#88ff88'
  }
};

// 强度配置
export const intensityConfig: Record<MatrixIntensity, IntensitySetting> = {
  low: { charCount: 50, spawnRate: 0.3 },
  medium: { charCount: 100, spawnRate: 0.5 },
  high: { charCount: 200, spawnRate: 0.8 }
};
