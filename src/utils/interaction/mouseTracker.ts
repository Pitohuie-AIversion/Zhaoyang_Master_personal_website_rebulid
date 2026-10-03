export interface MouseHistoryEntry {
  x: number;
  y: number;
  time: number;
}

export class MouseTracker {
  private history: MouseHistoryEntry[] = [];
  private maxHistoryLength: number;

  constructor(maxHistoryLength = 10) {
    this.maxHistoryLength = maxHistoryLength;
  }

  public record(x: number, y: number, time: number = performance.now()): void {
    this.history.push({ x, y, time });
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }
  }

  public getVelocity(): { x: number; y: number } {
    if (this.history.length < 2) {
      return { x: 0, y: 0 };
    }

    const recent = this.history[this.history.length - 1];
    const previous = this.history[this.history.length - 2];
    const timeDelta = recent.time - previous.time;

    if (timeDelta === 0) {
      return { x: 0, y: 0 };
    }

    return {
      x: (recent.x - previous.x) / timeDelta,
      y: (recent.y - previous.y) / timeDelta
    };
  }

  public prune(maxAgeMs = 1000, currentTime: number = performance.now()): void {
    this.history = this.history.filter(
      entry => currentTime - entry.time < maxAgeMs
    );
  }

  public clear(): void {
    this.history = [];
  }
}
