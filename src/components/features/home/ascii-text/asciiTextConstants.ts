import type { ASCIIThemeColors, ASCIIThemeName, ASCIISize, ASCIISizeSetting } from './types';

// ZHAOYANG ASCII 艺术字
export const asciiLines: readonly string[] = [
  '███████╗██╗  ██╗ █████╗  ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗ ',
  '╚══███╔╝██║  ██║██╔══██╗██╔═══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██╔════╝ ',
  '  ███╔╝ ███████║███████║██║   ██║ ╚████╔╝ ███████║██╔██╗ ██║██║  ███╗',
  ' ███╔╝  ██╔══██║██╔══██║██║   ██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║   ██║',
  '███████╗██║  ██║██║  ██║╚██████╔╝   ██║   ██║  ██║██║ ╚████║╚██████╔╝',
  '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ '
];

// 简化版 ASCII 字符（用于小屏幕）
export const simpleAsciiLines: readonly string[] = [
  '███████ ██   ██  █████   ██████  ██    ██  █████  ███    ██  ██████ ',
  '     ██ ██   ██ ██   ██ ██    ██  ██  ██  ██   ██ ████   ██ ██      ',
  '  ████  ███████ ███████ ██    ██   ████   ███████ ██ ██  ██ ██   ███',
  ' ██     ██   ██ ██   ██ ██    ██    ██    ██   ██ ██  ██ ██ ██    ██',
  '███████ ██   ██ ██   ██  ██████     ██    ██   ██ ██   ████  ██████ '
];

// 主题配色
export const themes: Record<ASCIIThemeName, ASCIIThemeColors> = {
  matrix: {
    primary: '#00ff41',
    secondary: '#008f11',
    glow: '#00ff41',
    background: 'rgba(0, 0, 0, 0.8)'
  },
  cyber: {
    primary: '#00d4ff',
    secondary: '#0099cc',
    glow: '#00d4ff',
    background: 'rgba(0, 20, 40, 0.8)'
  },
  neon: {
    primary: '#ff00ff',
    secondary: '#cc00cc',
    glow: '#ff00ff',
    background: 'rgba(20, 0, 20, 0.8)'
  }
};

// 尺寸配置
export const sizeConfig: Record<ASCIISize, ASCIISizeSetting> = {
  small: {
    fontSize: '0.5rem',
    lineHeight: '0.6rem',
    useSimple: true
  },
  medium: {
    fontSize: '0.8rem',
    lineHeight: '1rem',
    useSimple: false
  },
  large: {
    fontSize: '1.2rem',
    lineHeight: '1.4rem',
    useSimple: false
  }
};
