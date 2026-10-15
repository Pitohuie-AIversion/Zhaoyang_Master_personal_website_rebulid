import { InteractionConfig, TouchPoint } from './types';

export function calculateInteractionStrength(
  config: InteractionConfig,
  isMouseDown: boolean,
  touchPoints: TouchPoint[],
  pressedKeysCount: number
): number {
  let strength = 0;

  // 鼠标交互强度
  if (config.enableMouse && isMouseDown) {
    strength += config.mouseInfluence;
  }

  // 触摸交互强度
  if (config.enableTouch && touchPoints.length > 0) {
    const touchStrength = touchPoints.reduce((sum, touch) => sum + touch.force, 0);
    strength += touchStrength * config.touchInfluence;
  }

  // 键盘交互强度
  if (config.enableKeyboard && pressedKeysCount > 0) {
    strength += pressedKeysCount * 0.1;
  }

  // 应用阻尼
  return strength * config.dampingFactor;
}
