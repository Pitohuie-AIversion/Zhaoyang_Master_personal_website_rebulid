export {
  type TouchPoint,
  type InteractionState,
  type InteractionConfig,
  defaultInteractionConfig,
} from './types';

export { MouseTracker, type MouseHistoryEntry } from './mouseTracker';
export { TouchTracker } from './touchTracker';
export { EventBinder } from './eventBinder';
export { calculateInteractionStrength } from './strengthCalculator';
export { InteractionController } from './InteractionController';
