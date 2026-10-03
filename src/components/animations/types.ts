// 动画配置接口
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  repeat?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export const defaultAnimationConfig: AnimationConfig = {
  duration: 1000,
  delay: 0,
  easing: 'ease-out',
  repeat: false,
  direction: 'normal',
  fillMode: 'both'
};
