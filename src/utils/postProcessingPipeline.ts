/**
 * WebGL 后处理渲染管线
 * 专门处理帧缓冲区、全屏四边形绘制、高斯模糊、Bloom 辉光、色彩校正及最终合成
 */

export interface RenderConfig {
  enableBloom: boolean;
  enableBlur: boolean;
  enableColorCorrection: boolean;
  bloomStrength: number;
  bloomThreshold: number;
  blurAmount: number;
  contrast: number;
  brightness: number;
  saturation: number;
  colorTint: [number, number, number];
  vignette: number;
  filmGrain: number;
}

export const defaultRenderConfig: RenderConfig = {
  enableBloom: true,
  enableBlur: true,
  enableColorCorrection: true,
  bloomStrength: 0.8,
  bloomThreshold: 0.6,
  blurAmount: 1.0,
  contrast: 1.2,
  brightness: 0.0,
  saturation: 1.1,
  colorTint: [1.0, 1.0, 1.0],
  vignette: 0.3,
  filmGrain: 0.1
};

export class PostProcessingPipeline {
  private gl: WebGL2RenderingContext;
  private renderConfig: RenderConfig;
  private quadBuffer: WebGLBuffer | null = null;

  // 着色器程序
  private blurProgram: WebGLProgram | null = null;
  private bloomProgram: WebGLProgram | null = null;
  private finalProgram: WebGLProgram | null = null;

  // 帧缓冲区与纹理
  private mainFramebuffer: WebGLFramebuffer | null = null;
  private mainTexture: WebGLTexture | null = null;
  private blurFramebuffer1: WebGLFramebuffer | null = null;
  private blurTexture1: WebGLTexture | null = null;
  private blurFramebuffer2: WebGLFramebuffer | null = null;
  private blurTexture2: WebGLTexture | null = null;

  constructor(
    gl: WebGL2RenderingContext,
    renderConfig: RenderConfig,
    quadBuffer: WebGLBuffer | null
  ) {
    this.gl = gl;
    this.renderConfig = { ...renderConfig };
    this.quadBuffer = quadBuffer;

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
    return this.mainFramebuffer;
  }

  getMainTexture(): WebGLTexture | null {
    return this.mainTexture;
  }

  updateConfig(newConfig: Partial<RenderConfig>): void {
    this.renderConfig = { ...this.renderConfig, ...newConfig };
  }

  resize(): void {
    this.cleanupFramebuffers();
    this.initializeFramebuffers();
  }

  /**
   * 初始化所有后处理所需的帧缓冲区与挂载纹理
   */
  private initializeFramebuffers(): void {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const width = canvas.width;
    const height = canvas.height;

    // 主渲染目标
    this.mainFramebuffer = this.createFramebuffer();
    this.mainTexture = this.createTexture(width, height);
    this.attachTextureToFramebuffer(this.mainFramebuffer, this.mainTexture);

    // 模糊双缓存
    this.blurFramebuffer1 = this.createFramebuffer();
    this.blurTexture1 = this.createTexture(width, height);
    this.attachTextureToFramebuffer(this.blurFramebuffer1, this.blurTexture1);

    this.blurFramebuffer2 = this.createFramebuffer();
    this.blurTexture2 = this.createTexture(width, height);
    this.attachTextureToFramebuffer(this.blurFramebuffer2, this.blurTexture2);
  }

  private createFramebuffer(): WebGLFramebuffer {
    const framebuffer = this.gl.createFramebuffer();
    if (!framebuffer) {
      throw new Error('Failed to create framebuffer');
    }
    return framebuffer;
  }

  private createTexture(width: number, height: number): WebGLTexture {
    const texture = this.gl.createTexture();
    if (!texture) {
      throw new Error('Failed to create texture');
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA,
      width, height, 0,
      this.gl.RGBA, this.gl.UNSIGNED_BYTE, null
    );

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    return texture;
  }

  private attachTextureToFramebuffer(framebuffer: WebGLFramebuffer, texture: WebGLTexture): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    );

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.warn('Framebuffer is not complete:', status);
    }
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
    if (!this.blurProgram || !this.blurFramebuffer1 || !this.blurFramebuffer2) {
      return inputTexture;
    }

    // 水平模糊
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer1);
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
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer2);

    if (this.blurTexture1) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurTexture1);
      if (u_direction) this.gl.uniform2f(u_direction, 0.0, 1.0);
      this.drawFullscreenQuad(this.blurProgram);
    }

    return this.blurTexture2 || inputTexture;
  }

  /**
   * 应用发光效果 (Bloom)
   */
  applyBloom(inputTexture: WebGLTexture): WebGLTexture {
    if (!this.bloomProgram || !this.mainFramebuffer) {
      return inputTexture;
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.mainFramebuffer);
    this.gl.useProgram(this.bloomProgram);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);

    this.gl.activeTexture(this.gl.TEXTURE1);
    const blurTexture = this.blurTexture2 || this.blurTexture1;
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

    return this.mainTexture || inputTexture;
  }

  /**
   * 应用色彩校正
   */
  applyColorCorrection(inputTexture: WebGLTexture): WebGLTexture {
    if (!this.finalProgram || !this.blurFramebuffer1) {
      return inputTexture;
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer1);
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

    return this.blurTexture1 || inputTexture;
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

  private cleanupFramebuffers(): void {
    if (this.mainFramebuffer) this.gl.deleteFramebuffer(this.mainFramebuffer);
    if (this.mainTexture) this.gl.deleteTexture(this.mainTexture);
    if (this.blurFramebuffer1) this.gl.deleteFramebuffer(this.blurFramebuffer1);
    if (this.blurTexture1) this.gl.deleteTexture(this.blurTexture1);
    if (this.blurFramebuffer2) this.gl.deleteFramebuffer(this.blurFramebuffer2);
    if (this.blurTexture2) this.gl.deleteTexture(this.blurTexture2);

    this.mainFramebuffer = null;
    this.mainTexture = null;
    this.blurFramebuffer1 = null;
    this.blurTexture1 = null;
    this.blurFramebuffer2 = null;
    this.blurTexture2 = null;
  }

  dispose(): void {
    this.cleanupFramebuffers();
    if (this.blurProgram) this.gl.deleteProgram(this.blurProgram);
    if (this.bloomProgram) this.gl.deleteProgram(this.bloomProgram);
    if (this.finalProgram) this.gl.deleteProgram(this.finalProgram);
  }
}
