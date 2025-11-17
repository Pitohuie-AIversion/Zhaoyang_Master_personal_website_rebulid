import { WebGLRenderer } from './webgl';

export interface PostProcessConfig {
  blurAmount: number;
  bloomIntensity: number;
  bloomEnabled: boolean;
  contrast: number;
  saturation: number;
  colorTemperature: number;
  noiseIntensity: number;
  noiseAmount: number;
  vignetteStrength: number;
}

export const defaultPostProcessConfig: PostProcessConfig = {
  blurAmount: 1.0,
  bloomIntensity: 0.8,
  bloomEnabled: true,
  contrast: 1.1,
  saturation: 1.2,
  colorTemperature: 6500,
  noiseIntensity: 0.02,
  noiseAmount: 0.01,
  vignetteStrength: 0.3
};

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
  
  constructor(gl: WebGL2RenderingContext, renderer: WebGLRenderer, config: PostProcessConfig = defaultPostProcessConfig) {
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
    
    this.createQuadGeometry();
  }
  
  private createQuadGeometry(): void {
    // 全屏四边形顶点数据 (位置 + UV)
    const quadVertices = new Float32Array([
      // 位置      UV
      -1, -1,    0, 0,
       1, -1,    1, 0,
      -1,  1,    0, 1,
       1,  1,    1, 1
    ]);
    
    this.quadVAO = this.gl.createVertexArray();
    this.quadVBO = this.gl.createBuffer();
    
    this.gl.bindVertexArray(this.quadVAO);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadVBO);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quadVertices, this.gl.STATIC_DRAW);
    
    // 位置属性
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 16, 0);
    
    // UV 属性
    this.gl.enableVertexAttribArray(1);
    this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 16, 8);
    
    this.gl.bindVertexArray(null);
  }
  
  resize(width: number, height: number): void {
    if (this.width === width && this.height === height) return;
    
    this.width = width;
    this.height = height;
    
    this.createFramebuffers();
  }
  
  private createFramebuffers(): void {
    // 清理旧的帧缓冲区
    this.cleanup();
    
    // 创建主帧缓冲区
    this.createMainFramebuffer();
    
    // 创建 Bloom 效果的多级帧缓冲区
    this.createBloomFramebuffers();
  }
  
  private createMainFramebuffer(): void {
    this.mainFramebuffer = this.gl.createFramebuffer();
    this.mainTexture = this.gl.createTexture();
    this.mainDepthBuffer = this.gl.createRenderbuffer();
    
    // 设置颜色纹理
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.mainTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA16F,
      this.width, this.height, 0,
      this.gl.RGBA, this.gl.FLOAT, null
    );
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    
    // 设置深度缓冲区
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.mainDepthBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT24, this.width, this.height);
    
    // 绑定到帧缓冲区
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.mainFramebuffer);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D, this.mainTexture, 0
    );
    this.gl.framebufferRenderbuffer(
      this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT,
      this.gl.RENDERBUFFER, this.mainDepthBuffer
    );
    
    if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Main framebuffer is not complete');
    }
    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
  
  private createBloomFramebuffers(): void {
    this.bloomFramebuffers = [];
    this.bloomTextures = [];
    
    for (let i = 0; i < this.bloomLevels; i++) {
      const scale = Math.pow(0.5, i + 1);
      const levelWidth = Math.max(1, Math.floor(this.width * scale));
      const levelHeight = Math.max(1, Math.floor(this.height * scale));
      
      const framebuffer = this.gl.createFramebuffer();
      const texture = this.gl.createTexture();
      
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA16F,
        levelWidth, levelHeight, 0,
        this.gl.RGBA, this.gl.FLOAT, null
      );
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0,
        this.gl.TEXTURE_2D, texture, 0
      );
      
      if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(`Bloom framebuffer ${i} is not complete`);
      }
      
      this.bloomFramebuffers.push(framebuffer);
      this.bloomTextures.push(texture);
    }
    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
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
    // 清理主帧缓冲区
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
    
    // 清理 Bloom 帧缓冲区
    this.bloomFramebuffers.forEach(fb => this.gl.deleteFramebuffer(fb));
    this.bloomTextures.forEach(tex => this.gl.deleteTexture(tex));
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