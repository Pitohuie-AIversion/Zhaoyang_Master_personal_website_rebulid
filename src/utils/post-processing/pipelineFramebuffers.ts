export class PipelineFramebufferManager {
  private mainFramebuffer: WebGLFramebuffer | null = null;
  private mainTexture: WebGLTexture | null = null;
  private blurFramebuffer1: WebGLFramebuffer | null = null;
  private blurTexture1: WebGLTexture | null = null;
  private blurFramebuffer2: WebGLFramebuffer | null = null;
  private blurTexture2: WebGLTexture | null = null;

  initialize(gl: WebGL2RenderingContext, width: number, height: number): void {
    this.cleanup(gl);

    // 主渲染目标
    this.mainFramebuffer = this.createFramebuffer(gl);
    this.mainTexture = this.createTexture(gl, width, height);
    this.attachTextureToFramebuffer(gl, this.mainFramebuffer, this.mainTexture);

    // 模糊双缓存
    this.blurFramebuffer1 = this.createFramebuffer(gl);
    this.blurTexture1 = this.createTexture(gl, width, height);
    this.attachTextureToFramebuffer(gl, this.blurFramebuffer1, this.blurTexture1);

    this.blurFramebuffer2 = this.createFramebuffer(gl);
    this.blurTexture2 = this.createTexture(gl, width, height);
    this.attachTextureToFramebuffer(gl, this.blurFramebuffer2, this.blurTexture2);
  }

  private createFramebuffer(gl: WebGL2RenderingContext): WebGLFramebuffer {
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
      throw new Error('Failed to create framebuffer');
    }
    return framebuffer;
  }

  private createTexture(gl: WebGL2RenderingContext, width: number, height: number): WebGLTexture {
    const texture = gl.createTexture();
    if (!texture) {
      throw new Error('Failed to create texture');
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA,
      width, height, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, null
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture;
  }

  private attachTextureToFramebuffer(
    gl: WebGL2RenderingContext,
    framebuffer: WebGLFramebuffer,
    texture: WebGLTexture
  ): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.warn('Framebuffer is not complete:', status);
    }
  }

  getMainFramebuffer(): WebGLFramebuffer | null {
    return this.mainFramebuffer;
  }

  getMainTexture(): WebGLTexture | null {
    return this.mainTexture;
  }

  getBlurFramebuffer1(): WebGLFramebuffer | null {
    return this.blurFramebuffer1;
  }

  getBlurTexture1(): WebGLTexture | null {
    return this.blurTexture1;
  }

  getBlurFramebuffer2(): WebGLFramebuffer | null {
    return this.blurFramebuffer2;
  }

  getBlurTexture2(): WebGLTexture | null {
    return this.blurTexture2;
  }

  cleanup(gl: WebGL2RenderingContext): void {
    if (this.mainFramebuffer) gl.deleteFramebuffer(this.mainFramebuffer);
    if (this.mainTexture) gl.deleteTexture(this.mainTexture);
    if (this.blurFramebuffer1) gl.deleteFramebuffer(this.blurFramebuffer1);
    if (this.blurTexture1) gl.deleteTexture(this.blurTexture1);
    if (this.blurFramebuffer2) gl.deleteFramebuffer(this.blurFramebuffer2);
    if (this.blurTexture2) gl.deleteTexture(this.blurTexture2);

    this.mainFramebuffer = null;
    this.mainTexture = null;
    this.blurFramebuffer1 = null;
    this.blurTexture1 = null;
    this.blurFramebuffer2 = null;
    this.blurTexture2 = null;
  }
}
