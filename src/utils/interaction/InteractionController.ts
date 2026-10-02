import {
  InteractionState,
  InteractionConfig,
  defaultInteractionConfig
} from './types';
import { MouseTracker } from './mouseTracker';
import { TouchTracker } from './touchTracker';

export class InteractionController {
  private canvas: HTMLCanvasElement;
  private config: InteractionConfig;
  private state: InteractionState;
  private isEnabled = true;

  // 事件监听器引用，用于清理
  private eventListeners: Map<string, EventListener> = new Map();

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
      interactionRadius: config.interactionRadius
    };

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 鼠标事件
    if (this.config.enableMouse) {
      this.addEventListeners([
        ['mousemove', this.handleMouseMove.bind(this)],
        ['mousedown', this.handleMouseDown.bind(this)],
        ['mouseup', this.handleMouseUp.bind(this)],
        ['mouseleave', this.handleMouseLeave.bind(this)],
        ['wheel', this.handleWheel.bind(this)]
      ]);
    }

    // 触摸事件
    if (this.config.enableTouch) {
      this.addEventListeners([
        ['touchstart', this.handleTouchStart.bind(this)],
        ['touchmove', this.handleTouchMove.bind(this)],
        ['touchend', this.handleTouchEnd.bind(this)],
        ['touchcancel', this.handleTouchCancel.bind(this)]
      ]);
    }

    // 键盘事件
    if (this.config.enableKeyboard) {
      this.addEventListeners([
        ['keydown', this.handleKeyDown.bind(this)],
        ['keyup', this.handleKeyUp.bind(this)]
      ], window);
    }

    // 窗口事件
    this.addEventListeners([
      ['resize', this.handleResize.bind(this)]
    ], window);
  }

  private addEventListeners(events: [string, EventListener][], target: EventTarget = this.canvas): void {
    events.forEach(([event, handler]) => {
      target.addEventListener(event, handler, { passive: false });
      this.eventListeners.set(`${target === window ? 'window' : 'canvas'}_${event}`, handler);
    });
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.isEnabled) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.updateMousePosition(x, y);
    this.updateInteractionStrength();

    this.mouseTracker.record(x, y);
  }

  private handleMouseDown(event: MouseEvent): void {
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

  private handleWheel(event: WheelEvent): void {
    if (!this.isEnabled) return;

    // 滚轮控制交互半径
    const delta = event.deltaY > 0 ? -10 : 10;
    this.config.interactionRadius = Math.max(50, Math.min(300, this.config.interactionRadius + delta));
    this.state.interactionRadius = this.config.interactionRadius;

    event.preventDefault();
  }

  private handleTouchStart(event: TouchEvent): void {
    if (!this.isEnabled) return;

    this.updateTouchPoints(event.touches);
    event.preventDefault();
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.isEnabled) return;

    this.updateTouchPoints(event.touches);
    event.preventDefault();
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (!this.isEnabled) return;

    this.updateTouchPoints(event.touches);
  }

  private handleTouchCancel(): void {
    this.state.touchPoints = [];
    this.state.interactionStrength = 0;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    this.pressedKeys.add(event.code);
    this.handleKeyboardInteraction();
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    this.pressedKeys.delete(event.code);
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
      y: rect.height > 0 ? y / rect.height : 0
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
    let strength = 0;

    // 鼠标交互强度
    if (this.config.enableMouse && this.state.isMouseDown) {
      strength += this.config.mouseInfluence;
    }

    // 触摸交互强度
    if (this.config.enableTouch && this.state.touchPoints.length > 0) {
      const touchStrength = this.state.touchPoints.reduce((sum, touch) => sum + touch.force, 0);
      strength += touchStrength * this.config.touchInfluence;
    }

    // 键盘交互强度
    if (this.config.enableKeyboard && this.pressedKeys.size > 0) {
      strength += this.pressedKeys.size * 0.1;
    }

    // 应用阻尼
    this.state.interactionStrength = strength * this.config.dampingFactor;
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
    return this.state.isMouseDown ||
           this.state.touchPoints.length > 0 ||
           this.pressedKeys.size > 0;
  }

  public dispose(): void {
    this.eventListeners.forEach((handler, key) => {
      const [target, event] = key.split('_');
      const targetElement = target === 'window' ? window : this.canvas;
      targetElement.removeEventListener(event, handler);
    });

    this.eventListeners.clear();
    this.mouseTracker.clear();
    this.pressedKeys.clear();
    this.state.touchPoints = [];
  }
}
