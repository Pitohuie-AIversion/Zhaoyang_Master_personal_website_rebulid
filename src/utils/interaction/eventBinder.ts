export class EventBinder {
  private listeners: Map<string, { target: EventTarget; event: string; handler: EventListener }> = new Map();

  bind(
    target: EventTarget,
    event: string,
    handler: EventListener,
    options: AddEventListenerOptions | boolean = { passive: false }
  ): void {
    target.addEventListener(event, handler, options);
    const prefix = target === window ? 'window' : 'canvas';
    this.listeners.set(`${prefix}_${event}`, { target, event, handler });
  }

  bindMultiple(
    events: [string, EventListener][],
    target: EventTarget,
    options: AddEventListenerOptions | boolean = { passive: false }
  ): void {
    events.forEach(([event, handler]) => {
      this.bind(target, event, handler, options);
    });
  }

  dispose(): void {
    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.listeners.clear();
  }
}
