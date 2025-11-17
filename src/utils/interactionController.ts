export interface InteractionState {
  mousePosition: { x: number; y: number };
  normalizedMousePosition: { x: number; y: number };
  isMouseDown: boolean;
  touchPoints: TouchPoint[];
  interactionStrength: number;
  interactionRadius: number;
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  force: number;
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

export class InteractionController {
  private canvas: HTMLCanvasElement;
  private config: InteractionConfig;
  private state: InteractionState;
  private isEnabled = true;
  
  // 事件监听器引用，用于清理
  private eventListeners: Map<string, EventListener> = new Map();
  
  // 交互历史记录，用于平滑处理
  private mouseHistory: { x: number; y: number; time: number }[] = [];
  private maxHistoryLength = 10;
  
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
    
    // 记录鼠标历史
    this.mouseHistory.push({ x, y, time: performance.now() });
    if (this.mouseHistory.length > this.maxHistoryLength) {
      this.mouseHistory.shift();
    }
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
    // 重新计算归一化坐标
    this.updateMousePosition(this.state.mousePosition.x, this.state.mousePosition.y);
  }
  
  private updateMousePosition(x: number, y: number): void {
    this.state.mousePosition = { x, y };
    
    // 计算归一化坐标 (0-1)
    const rect = this.canvas.getBoundingClientRect();
    this.state.normalizedMousePosition = {
      x: x / rect.width,
      y: y / rect.height
    };
  }
  
  private updateTouchPoints(touches: TouchList): void {
    this.state.touchPoints = [];
    
    const rect = this.canvas.getBoundingClientRect();
    const maxTouches = Math.min(touches.length, this.config.maxTouches);
    
    for (let i = 0; i < maxTouches; i++) {
      const touch = touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      this.state.touchPoints.push({
        id: touch.identifier,
        x,
        y,
        normalizedX: x / rect.width,
        normalizedY: y / rect.height,
        force: touch.force || 1.0
      });
    }
    
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
    // 键盘控制逻辑，可以用于控制粒子行为
    // 例如：WASD 控制重力方向，空格键暂停等
    
    if (this.pressedKeys.has('Space')) {
      // 空格键可以触发特殊效果
      this.state.interactionStrength = Math.max(this.state.interactionStrength, 2.0);
    }
  }
  
  // 获取鼠标速度
  public getMouseVelocity(): { x: number; y: number } {
    if (this.mouseHistory.length < 2) {
      return { x: 0, y: 0 };
    }
    
    const recent = this.mouseHistory[this.mouseHistory.length - 1];
    const previous = this.mouseHistory[this.mouseHistory.length - 2];
    const timeDelta = recent.time - previous.time;
    
    if (timeDelta === 0) {
      return { x: 0, y: 0 };
    }
    
    return {
      x: (recent.x - previous.x) / timeDelta,
      y: (recent.y - previous.y) / timeDelta
    };
  }
  
  // 获取平均触摸位置
  public getAverageTouchPosition(): { x: number; y: number } | null {
    if (this.state.touchPoints.length === 0) {
      return null;
    }
    
    const sum = this.state.touchPoints.reduce(
      (acc, touch) => ({
        x: acc.x + touch.x,
        y: acc.y + touch.y
      }),
      { x: 0, y: 0 }
    );
    
    return {
      x: sum.x / this.state.touchPoints.length,
      y: sum.y / this.state.touchPoints.length
    };
  }
  
  // 公共方法
  public update(deltaTime: number): void {
    // 清理过期的鼠标历史记录
    const currentTime = performance.now();
    this.mouseHistory = this.mouseHistory.filter(
      entry => currentTime - entry.time < 1000 // 保留1秒内的记录
    );
    
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
    // 移除所有事件监听器
    this.eventListeners.forEach((handler, key) => {
      const [target, event] = key.split('_');
      const targetElement = target === 'window' ? window : this.canvas;
      targetElement.removeEventListener(event, handler);
    });
    
    this.eventListeners.clear();
    this.mouseHistory = [];
    this.pressedKeys.clear();
    this.state.touchPoints = [];
  }
}