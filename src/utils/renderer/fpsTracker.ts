export class FpsTracker {
  private frameCount = 0;
  private lastFpsTime = 0;
  private fps = 0;

  public update(): void {
    this.frameCount++;
    const now = performance.now();

    if (now - this.lastFpsTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  public getFPS(): number {
    return this.fps;
  }
}
