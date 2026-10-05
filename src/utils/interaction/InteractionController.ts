import {
  InteractionState,
  InteractionConfig,
  defaultInteractionConfig,
} from './types';
import { MouseTracker } from './mouseTracker';
import { TouchTracker } from './touchTracker';
import { EventBinder } from './eventBinder';
import { calculateInteractionStrength } from './strengthCalculator';

export class InteractionController {
  private canvas: HTMLCanvasElement;
  private config: InteractionConfig;
  private state: InteractionState;
  private isEnabled = true;

  // 事件监听器管理器
  private eventBinder = new EventBinder();

  // 鼠标历史与速度跟踪器
  private mouseTracker = new MouseTracker(10);

  // 键盘状态
  private pressedKeys = new Set<string>();

  constructor(canvas: HTMLCanvasElement, config: InteractionConfig = defaultInteractionConfig) {
    this.canvas = canvas;
    this.config = { ...config };

    this.state = {
      mousePosition: { x: 0, y: 0 },
      normalizedMousePosition: { x: 0, y: 0 },
      isMouseDown: false,
      touchPoints: [],
      interactionStrength: 0,
      interactionRadius: config.interactionRadius,
    };

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 鼠标事件
    if (this.config.enableMouse) {
      this.eventBinder.bindMultiple(
        [
          ['mousemove', this.handleMouseMove.bind(this)],
          ['mousedown', this.handleMouseDown.bind(this)],
          ['mouseup', this.handleMouseUp.bind(this)],
          ['mouseleave', this.handleMouseLeave.bind(this)],
          ['wheel', this.handleWheel.bind(this)],
        ],
        this.canvas
      );
    }

    // 触摸事件
    if (this.config.enableTouch) {
      this.eventBinder.bindMultiple(
        [
          ['touchstart', this.handleTouchStart.bind(this)],
          ['touchmove', this.handleTouchMove.bind(this)],
          ['touchend', this.handleTouchEnd.bind(this)],
          ['touchcancel', this.handleTouchCancel.bind(this)],
        ],
        this.canvas
      );
    }

    // 键盘事件
    if (this.config.enableKeyboard) {
      this.eventBinder.bindMultiple(
        [
          ['keydown', this.handleKeyDown.bind(this)],
          ['keyup', this.handleKeyUp.bind(this)],
        ],
        window
      );
    }

    // 窗口尺寸事件
    this.eventBinder.bind(window, 'resize', this.handleResize.bind(this));
  }

  private handleMouseMove(event: Event): void {
    if (!this.isEnabled) return;
    const mouseEvent = event as MouseEvent;

    const rect = this.canvas.getBoundingClientRect();
    const x = mouseEvent.clientX - rect.left;
    const y = mouseEvent.clientY - rect.top;

    this.updateMousePosition(x, y);
    this.updateInteractionStrength();

    this.mouseTracker.record(x, y);
  }

  private handleMouseDown(event: Event): void {
    if (!this.isEnabled) return;

    this.state.isMouseDown = true;
    this.updateInteractionStrength();
    event.preventDefault();
  }

  private handleMouseUp(): void {
    if (!this.isEnabled) return;

    this.state.isMouseDown = false;
    this.updateInteractionStrength();
  }

  private handleMouseLeave(): void {
    this.state.isMouseDown = false;
    this.state.interactionStrength = 0;
  }

  private handleWheel(event: Event): void {
    if (!this.isEnabled) return;
    const wheelEvent = event as WheelEvent;

    // 滚轮控制交互半径
    const delta = wheelEvent.deltaY > 0 ? -10 : 10;
    this.config.interactionRadius = Math.max(50, Math.min(300, this.config.interactionRadius + delta));
    this.state.interactionRadius = this.config.interactionRadius;

    wheelEvent.preventDefault();
  }

  private handleTouchStart(event: Event): void {
    if (!this.isEnabled) return;
    const touchEvent = event as TouchEvent;

    this.updateTouchPoints(touchEvent.touches);
    touchEvent.preventDefault();
  }

  private handleTouchMove(event: Event): void {
    if (!this.isEnabled) return;
    const touchEvent = event as TouchEvent;

    this.updateTouchPoints(touchEvent.touches);
    touchEvent.preventDefault();
  }

  private handleTouchEnd(event: Event): void {
    if (!this.isEnabled) return;
    const touchEvent = event as TouchEvent;

    this.updateTouchPoints(touchEvent.touches);
  }

  private handleTouchCancel(): void {
    this.state.touchPoints = [];
    this.state.interactionStrength = 0;
  }

  private handleKeyDown(event: Event): void {
    if (!this.isEnabled) return;
    const keyEvent = event as KeyboardEvent;

    this.pressedKeys.add(keyEvent.code);
    this.handleKeyboardInteraction();
  }

  private handleKeyUp(event: Event): void {
    if (!this.isEnabled) return;
    const keyEvent = event as KeyboardEvent;

    this.pressedKeys.delete(keyEvent.code);
    this.handleKeyboardInteraction();
  }

  private handleResize(): void {
    this.updateMousePosition(this.state.mousePosition.x, this.state.mousePosition.y);
  }

  private updateMousePosition(x: number, y: number): void {
    this.state.mousePosition = { x, y };

    const rect = this.canvas.getBoundingClientRect();
    this.state.normalizedMousePosition = {
      x: rect.width > 0 ? x / rect.width : 0,
      y: rect.height > 0 ? y / rect.height : 0,
    };
  }

  private updateTouchPoints(touches: TouchList): void {
    const rect = this.canvas.getBoundingClientRect();
    this.state.touchPoints = TouchTracker.extractTouchPoints(
      touches,
      rect,
      this.config.maxTouches
    );

    this.updateInteractionStrength();
  }

  private updateInteractionStrength(): void {
    this.state.interactionStrength = calculateInteractionStrength(
      this.config,
      this.state.isMouseDown,
      this.state.touchPoints,
      this.pressedKeys.size
    );
  }

  private handleKeyboardInteraction(): void {
    if (this.pressedKeys.has('Space')) {
      this.state.interactionStrength = Math.max(this.state.interactionStrength, 2.0);
    }
  }

  // 获取鼠标速度
  public getMouseVelocity(): { x: number; y: number } {
    return this.mouseTracker.getVelocity();
  }

  // 获取平均触摸位置
  public getAverageTouchPosition(): { x: number; y: number } | null {
    return TouchTracker.getAveragePosition(this.state.touchPoints);
  }

  // 更新周期
  public update(deltaTime: number): void {
    this.mouseTracker.prune(1000);

    // 更新交互强度（应用时间衰减）
    this.state.interactionStrength *= Math.pow(this.config.dampingFactor, deltaTime * 60);
  }

  public getState(): InteractionState {
    return { ...this.state };
  }

  public getConfig(): InteractionConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<InteractionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.state.interactionRadius = this.config.interactionRadius;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
    this.state.isMouseDown = false;
    this.state.touchPoints = [];
    this.state.interactionStrength = 0;
  }

  public isInteracting(): boolean {
    return (
      this.state.isMouseDown ||
      this.state.touchPoints.length > 0 ||
      this.pressedKeys.size > 0
    );
  }

  public dispose(): void {
    this.eventBinder.dispose();
    this.mouseTracker.clear();
    this.pressedKeys.clear();
    this.state.touchPoints = [];
  }
}
