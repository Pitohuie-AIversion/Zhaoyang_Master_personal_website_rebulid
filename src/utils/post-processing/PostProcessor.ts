import { WebGLRenderer } from '../webgl';
import { type PostProcessConfig, defaultPostProcessConfig } from './postProcessorConfig';
import { createFullscreenQuad } from './quadGeometry';
import {
  createMainFramebuffer,
  createBloomFramebuffers,
} from './postProcessorBuffers';

export class PostProcessor {
  private gl: WebGL2RenderingContext;
  private renderer: WebGLRenderer;
  private program: WebGLProgram | null = null;

  // 帧缓冲区和纹理
  private mainFramebuffer: WebGLFramebuffer | null = null;
  private mainTexture: WebGLTexture | null = null;
  private mainDepthBuffer: WebGLRenderbuffer | null = null;

  // Bloom 效果的多级缓冲区
  private bloomFramebuffers: WebGLFramebuffer[] = [];
  private bloomTextures: WebGLTexture[] = [];
  private bloomLevels = 4;

  // 全屏四边形顶点数据
  private quadVAO: WebGLVertexArrayObject | null = null;
  private quadVBO: WebGLBuffer | null = null;

  private width = 0;
  private height = 0;
  private config: PostProcessConfig;

  constructor(
    gl: WebGL2RenderingContext,
    renderer: WebGLRenderer,
    config: PostProcessConfig = defaultPostProcessConfig
  ) {
    this.gl = gl;
    this.renderer = renderer;
    this.config = { ...config };
  }

  async initialize(vertexShaderSource: string, fragmentShaderSource: string): Promise<void> {
    const vertexShader = this.renderer.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.renderer.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to compile post-process shaders');
    }

    this.program = this.renderer.linkProgram(vertexShader, fragmentShader);
    if (!this.program) {
      throw new Error('Failed to link post-process program');
    }

    const { vao, vbo } = createFullscreenQuad(this.gl);
    this.quadVAO = vao;
    this.quadVBO = vbo;
  }

  resize(width: number, height: number): void {
    if (this.width === width && this.height === height) return;

    this.width = width;
    this.height = height;

    this.cleanup();

    const main = createMainFramebuffer(this.gl, this.width, this.height);
    this.mainFramebuffer = main.framebuffer;
    this.mainTexture = main.texture;
    this.mainDepthBuffer = main.depthBuffer;

    const bloom = createBloomFramebuffers(this.gl, this.width, this.height, this.bloomLevels);
    this.bloomFramebuffers = bloom.framebuffers;
    this.bloomTextures = bloom.textures;
  }

  beginRender(): void {
    if (!this.mainFramebuffer) return;

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.mainFramebuffer);
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  endRender(time: number): void {
    if (!this.program || !this.mainTexture || !this.quadVAO) return;

    // 绑定到默认帧缓冲区
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.width, this.height);

    // 使用后处理着色器
    this.gl.useProgram(this.program);

    // 设置 uniforms
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_texture'), '1i', 0);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_resolution'), '2f', new Float32Array([this.width, this.height]));
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_time'), '1f', time);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_blurAmount'), '1f', this.config.blurAmount);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_bloomIntensity'), '1f', this.config.bloomIntensity);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_bloomEnabled'), '1i', this.config.bloomEnabled ? 1 : 0);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_contrast'), '1f', this.config.contrast);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_saturation'), '1f', this.config.saturation);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_colorTemperature'), '1f', this.config.colorTemperature);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_noiseIntensity'), '1f', this.config.noiseIntensity);
    this.renderer.setUniform(this.renderer.getUniformLocation(this.program, 'u_vignetteStrength'), '1f', this.config.vignetteStrength);

    // 绑定主纹理
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.mainTexture);

    // 渲染全屏四边形
    this.gl.bindVertexArray(this.quadVAO);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    this.gl.bindVertexArray(null);
  }

  updateConfig(newConfig: Partial<PostProcessConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): PostProcessConfig {
    return { ...this.config };
  }

  private cleanup(): void {
    if (this.mainFramebuffer) {
      this.gl.deleteFramebuffer(this.mainFramebuffer);
      this.mainFramebuffer = null;
    }
    if (this.mainTexture) {
      this.gl.deleteTexture(this.mainTexture);
      this.mainTexture = null;
    }
    if (this.mainDepthBuffer) {
      this.gl.deleteRenderbuffer(this.mainDepthBuffer);
      this.mainDepthBuffer = null;
    }

    this.bloomFramebuffers.forEach((fb) => this.gl.deleteFramebuffer(fb));
    this.bloomTextures.forEach((tex) => this.gl.deleteTexture(tex));
    this.bloomFramebuffers = [];
    this.bloomTextures = [];
  }

  dispose(): void {
    this.cleanup();

    if (this.quadVAO) {
      this.gl.deleteVertexArray(this.quadVAO);
      this.quadVAO = null;
    }
    if (this.quadVBO) {
      this.gl.deleteBuffer(this.quadVBO);
      this.quadVBO = null;
    }
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }
}
