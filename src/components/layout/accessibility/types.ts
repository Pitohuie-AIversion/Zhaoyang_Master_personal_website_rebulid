// 可访问性配置接口
export interface AccessibilityConfig {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  colorBlindFriendly: boolean;
  textToSpeech: boolean;
}

// 可访问性上下文
export interface AccessibilityContextType {
  config: AccessibilityConfig;
  updateConfig: (newConfig: Partial<AccessibilityConfig>) => void;
  announceToScreenReader: (message: string) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

export const defaultConfig: AccessibilityConfig = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusVisible: true,
  colorBlindFriendly: false,
  textToSpeech: false
};
