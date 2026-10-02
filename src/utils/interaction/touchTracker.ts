import { TouchPoint } from './types';

export class TouchTracker {
  public static extractTouchPoints(
    touches: TouchList,
    rect: DOMRect,
    maxTouches: number
  ): TouchPoint[] {
    const points: TouchPoint[] = [];
    const count = Math.min(touches.length, maxTouches);

    for (let i = 0; i < count; i++) {
      const touch = touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      points.push({
        id: touch.identifier,
        x,
        y,
        normalizedX: rect.width > 0 ? x / rect.width : 0,
        normalizedY: rect.height > 0 ? y / rect.height : 0,
        force: touch.force || 1.0
      });
    }

    return points;
  }

  public static getAveragePosition(touchPoints: TouchPoint[]): { x: number; y: number } | null {
    if (touchPoints.length === 0) {
      return null;
    }

    const sum = touchPoints.reduce(
      (acc, touch) => ({
        x: acc.x + touch.x,
        y: acc.y + touch.y
      }),
      { x: 0, y: 0 }
    );

    return {
      x: sum.x / touchPoints.length,
      y: sum.y / touchPoints.length
    };
  }
}
