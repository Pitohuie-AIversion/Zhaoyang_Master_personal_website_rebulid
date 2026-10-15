export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  force: number;
}

export interface InteractionState {
  mousePosition: { x: number; y: number };
  normalizedMousePosition: { x: number; y: number };
  isMouseDown: boolean;
  touchPoints: TouchPoint[];
  interactionStrength: number;
  interactionRadius: number;
}

export interface InteractionConfig {
  mouseInfluence: number;
  touchInfluence: number;
  interactionRadius: number;
  attractionStrength: number;
  repulsionStrength: number;
  dampingFactor: number;
  enableMouse: boolean;
  enableTouch: boolean;
  enableKeyboard: boolean;
  maxTouches: number;
  enabled: boolean;
}

export const defaultInteractionConfig: InteractionConfig = {
  mouseInfluence: 1.0,
  touchInfluence: 1.0,
  interactionRadius: 100,
  attractionStrength: 0.5,
  repulsionStrength: 0.3,
  dampingFactor: 0.95,
  enableMouse: true,
  enableTouch: true,
  enableKeyboard: false,
  maxTouches: 5,
  enabled: true
};
