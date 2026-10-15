import type { RenderConfig } from './types';
import { PipelineFramebufferManager } from './pipelineFramebuffers';

export class PostProcessingPipeline {
  private gl: WebGL2RenderingContext;
  private renderConfig: RenderConfig;
  private quadBuffer: WebGLBuffer | null = null;
  private fboManager: PipelineFramebufferManager;

  // 着色器程序
  private blurProgram: WebGLProgram | null = null;
  private bloomProgram: WebGLProgram | null = null;
  private finalProgram: WebGLProgram | null = null;

  constructor(
    gl: WebGL2RenderingContext,
    renderConfig: RenderConfig,
    quadBuffer: WebGLBuffer | null
  ) {
    this.gl = gl;
    this.renderConfig = { ...renderConfig };
    this.quadBuffer = quadBuffer;
    this.fboManager = new PipelineFramebufferManager();

    this.initializeFramebuffers();
  }

  setPrograms(
    blurProgram: WebGLProgram | null,
    bloomProgram: WebGLProgram | null,
    finalProgram: WebGLProgram | null
  ): void {
    this.blurProgram = blurProgram;
    this.bloomProgram = bloomProgram;
    this.finalProgram = finalProgram;
  }

  setQuadBuffer(buffer: WebGLBuffer | null): void {
    this.quadBuffer = buffer;
  }

  getMainFramebuffer(): WebGLFramebuffer | null {
    return this.fboManager.getMainFramebuffer();
  }

  getMainTexture(): WebGLTexture | null {
    return this.fboManager.getMainTexture();
  }

  updateConfig(newConfig: Partial<RenderConfig>): void {
    this.renderConfig = { ...this.renderConfig, ...newConfig };
  }

  resize(): void {
    this.initializeFramebuffers();
  }

  private initializeFramebuffers(): void {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    this.fboManager.initialize(this.gl, canvas.width, canvas.height);
  }

  private drawFullscreenQuad(program: WebGLProgram): void {
    if (!this.quadBuffer) return;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    const a_position = this.gl.getAttribLocation(program, 'a_position');
    if (a_position >= 0) {
      this.gl.enableVertexAttribArray(a_position);
      this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
      this.gl.disableVertexAttribArray(a_position);
    }
  }

  /**
   * 应用模糊效果 (水平与垂直双 Pass)
   */
  applyBlur(inputTexture: WebGLTexture): WebGLTexture {
    const blurFb1 = this.fboManager.getBlurFramebuffer1();
    const blurFb2 = this.fboManager.getBlurFramebuffer2();
    const blurTex1 = this.fboManager.getBlurTexture1();
    const blurTex2 = this.fboManager.getBlurTexture2();

    if (!this.blurProgram || !blurFb1 || !blurFb2) {
      return inputTexture;
    }

    // 水平模糊
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, blurFb1);
    this.gl.useProgram(this.blurProgram);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);

    const u_texture = this.gl.getUniformLocation(this.blurProgram, 'u_texture');
    const u_resolution = this.gl.getUniformLocation(this.blurProgram, 'u_resolution');
    const u_blurAmount = this.gl.getUniformLocation(this.blurProgram, 'u_blurAmount');
    const u_direction = this.gl.getUniformLocation(this.blurProgram, 'u_direction');

    if (u_texture) this.gl.uniform1i(u_texture, 0);
    if (u_resolution) this.gl.uniform2f(u_resolution, this.gl.canvas.width, this.gl.canvas.height);
    if (u_blurAmount) this.gl.uniform1f(u_blurAmount, this.renderConfig.blurAmount);
    if (u_direction) this.gl.uniform2f(u_direction, 1.0, 0.0);

    this.drawFullscreenQuad(this.blurProgram);

    // 垂直模糊
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, blurFb2);

    if (blurTex1) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTex1);
      if (u_direction) this.gl.uniform2f(u_direction, 0.0, 1.0);
      this.drawFullscreenQuad(this.blurProgram);
    }

    return blurTex2 || inputTexture;
  }

  /**
   * 应用发光效果 (Bloom)
   */
  applyBloom(inputTexture: WebGLTexture): WebGLTexture {
    const mainFb = this.fboManager.getMainFramebuffer();
    if (!this.bloomProgram || !mainFb) {
      return inputTexture;
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, mainFb);
    this.gl.useProgram(this.bloomProgram);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);

    this.gl.activeTexture(this.gl.TEXTURE1);
    const blurTexture = this.fboManager.getBlurTexture2() || this.fboManager.getBlurTexture1();
    if (blurTexture) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture);
    }

    const u_texture = this.gl.getUniformLocation(this.bloomProgram, 'u_texture');
    const u_blurTexture = this.gl.getUniformLocation(this.bloomProgram, 'u_blurTexture');
    const u_bloomStrength = this.gl.getUniformLocation(this.bloomProgram, 'u_bloomStrength');
    const u_bloomThreshold = this.gl.getUniformLocation(this.bloomProgram, 'u_bloomThreshold');

    if (u_texture) this.gl.uniform1i(u_texture, 0);
    if (u_blurTexture) this.gl.uniform1i(u_blurTexture, 1);
    if (u_bloomStrength) this.gl.uniform1f(u_bloomStrength, this.renderConfig.bloomStrength);
    if (u_bloomThreshold) this.gl.uniform1f(u_bloomThreshold, this.renderConfig.bloomThreshold);

    this.drawFullscreenQuad(this.bloomProgram);

    return this.fboManager.getMainTexture() || inputTexture;
  }

  /**
   * 应用色彩校正
   */
  applyColorCorrection(inputTexture: WebGLTexture): WebGLTexture {
    const blurFb1 = this.fboManager.getBlurFramebuffer1();
    if (!this.finalProgram || !blurFb1) {
      return inputTexture;
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, blurFb1);
    this.gl.useProgram(this.finalProgram);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);

    const u_texture = this.gl.getUniformLocation(this.finalProgram, 'u_texture');
    const u_contrast = this.gl.getUniformLocation(this.finalProgram, 'u_contrast');
    const u_brightness = this.gl.getUniformLocation(this.finalProgram, 'u_brightness');
    const u_saturation = this.gl.getUniformLocation(this.finalProgram, 'u_saturation');
    const u_colorTint = this.gl.getUniformLocation(this.finalProgram, 'u_colorTint');

    if (u_texture) this.gl.uniform1i(u_texture, 0);
    if (u_contrast) this.gl.uniform1f(u_contrast, this.renderConfig.contrast);
    if (u_brightness) this.gl.uniform1f(u_brightness, this.renderConfig.brightness);
    if (u_saturation) this.gl.uniform1f(u_saturation, this.renderConfig.saturation);
    if (u_colorTint) this.gl.uniform3f(u_colorTint, ...this.renderConfig.colorTint);

    this.drawFullscreenQuad(this.finalProgram);

    return this.fboManager.getBlurTexture1() || inputTexture;
  }

  /**
   * 渲染最终后处理到屏幕默认帧缓冲区
   */
  renderToScreen(inputTexture: WebGLTexture, time: number): void {
    if (!this.finalProgram) return;

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.useProgram(this.finalProgram);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);

    const u_texture = this.gl.getUniformLocation(this.finalProgram, 'u_texture');
    const u_time = this.gl.getUniformLocation(this.finalProgram, 'u_time');
    const u_resolution = this.gl.getUniformLocation(this.finalProgram, 'u_resolution');
    const u_vignette = this.gl.getUniformLocation(this.finalProgram, 'u_vignette');
    const u_filmGrain = this.gl.getUniformLocation(this.finalProgram, 'u_filmGrain');

    if (u_texture) this.gl.uniform1i(u_texture, 0);
    if (u_time) this.gl.uniform1f(u_time, time);
    if (u_resolution) this.gl.uniform2f(u_resolution, this.gl.canvas.width, this.gl.canvas.height);
    if (u_vignette) this.gl.uniform1f(u_vignette, this.renderConfig.vignette);
    if (u_filmGrain) this.gl.uniform1f(u_filmGrain, this.renderConfig.filmGrain);

    this.drawFullscreenQuad(this.finalProgram);
  }

  dispose(): void {
    this.fboManager.cleanup(this.gl);
    if (this.blurProgram) this.gl.deleteProgram(this.blurProgram);
    if (this.bloomProgram) this.gl.deleteProgram(this.bloomProgram);
    if (this.finalProgram) this.gl.deleteProgram(this.finalProgram);
  }
}
