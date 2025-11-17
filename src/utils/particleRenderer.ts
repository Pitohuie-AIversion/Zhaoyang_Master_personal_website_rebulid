/**
 * 粒子渲染器 - 专门处理粒子系统的 WebGL 渲染
 */

// import { WebGLRenderer } from './webgl'; // 未使用
import { shaderConfigs, fullscreenQuadVertices } from './shaders';
import { ParticleSystem } from './particleSystem';
import { createProjectionMatrix, createViewMatrix } from './webgl';

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

export class ParticleRenderer {
  private gl: WebGL2RenderingContext;
  private particleSystem: ParticleSystem;
  private renderConfig: RenderConfig;
  
  // 着色器程序
  private particleProgram: WebGLProgram | null = null;
  private blurProgram: WebGLProgram | null = null;
  private bloomProgram: WebGLProgram | null = null;
  private finalProgram: WebGLProgram | null = null;
  
  // 渲染目标
  private mainFramebuffer: WebGLFramebuffer | null = null;
  private mainTexture: WebGLTexture | null = null;
  private blurFramebuffer1: WebGLFramebuffer | null = null;
  private blurTexture1: WebGLTexture | null = null;
  private blurFramebuffer2: WebGLFramebuffer | null = null;
  private blurTexture2: WebGLTexture | null = null;
  
  // 缓冲区
  private particleBuffer: WebGLBuffer | null = null;
  private quadBuffer: WebGLBuffer | null = null;
  
  // 矩阵
  private projectionMatrix: Float32Array;
  private viewMatrix: Float32Array;
  
  // 性能监控
  private frameCount = 0;
  private lastFpsTime = 0;
  private fps = 0;

  constructor(
    gl: WebGL2RenderingContext,
    particleSystem: ParticleSystem,
    renderConfig: RenderConfig
  ) {
    this.gl = gl;
    this.particleSystem = particleSystem;
    this.renderConfig = { ...renderConfig };
    
    // 初始化矩阵
    this.projectionMatrix = createProjectionMatrix(gl.canvas.width, gl.canvas.height);
    this.viewMatrix = createViewMatrix();
    
    this.initializeShaders();
    this.initializeBuffers();
    this.initializeFramebuffers();
  }

  /**
   * 初始化着色器程序
   */
  private initializeShaders(): void {
    try {
      // 创建粒子着色器程序
      this.particleProgram = this.createShaderProgram(
        shaderConfigs.find(c => c.name === 'particle')!.vertexShader,
        shaderConfigs.find(c => c.name === 'particle')!.fragmentShader
      );

      // 创建后处理着色器程序
      this.blurProgram = this.createShaderProgram(
        shaderConfigs.find(c => c.name === 'blur')!.vertexShader,
        shaderConfigs.find(c => c.name === 'blur')!.fragmentShader
      );

      this.bloomProgram = this.createShaderProgram(
        shaderConfigs.find(c => c.name === 'bloom')!.vertexShader,
        shaderConfigs.find(c => c.name === 'bloom')!.fragmentShader
      );

      this.finalProgram = this.createShaderProgram(
        shaderConfigs.find(c => c.name === 'finalComposite')!.vertexShader,
        shaderConfigs.find(c => c.name === 'finalComposite')!.fragmentShader
      );

      console.log('Shaders initialized successfully');
    } catch (error) {
      console.error('Failed to initialize shaders:', error);
      throw error;
    }
  }

  /**
   * 创建着色器程序
   */
  private createShaderProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
    const vertexShader = this.compileShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentSource, this.gl.FRAGMENT_SHADER);

    const program = this.gl.createProgram();
    if (!program) {
      throw new Error('Failed to create shader program');
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Failed to link shader program: ${error}`);
    }

    return program;
  }

  /**
   * 编译着色器
   */
  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Failed to create shader');
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Failed to compile shader: ${error}`);
    }

    return shader;
  }

  /**
   * 初始化缓冲区
   */
  private initializeBuffers(): void {
    // 创建全屏四边形缓冲区
    this.quadBuffer = this.gl.createBuffer();
    if (this.quadBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, fullscreenQuadVertices, this.gl.STATIC_DRAW);
    }
    
    // 创建粒子缓冲区（动态）
    this.particleBuffer = this.gl.createBuffer();
    if (this.particleBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleBuffer);
      // 预分配空间 - 每个粒子8个浮点数 (x, y, vx, vy, life, size, r, g, b)
      const initialData = new Float32Array(10000 * 9);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, initialData, this.gl.DYNAMIC_DRAW);
    }
    
    console.log('Buffers initialized successfully');
  }

  /**
   * 初始化帧缓冲区
   */
  private initializeFramebuffers(): void {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const width = canvas.width;
    const height = canvas.height;
    
    // 主渲染目标
    this.mainFramebuffer = this.createFramebuffer(width, height);
    this.mainTexture = this.createTexture(width, height);
    this.attachTextureToFramebuffer(this.mainFramebuffer, this.mainTexture);
    
    // 模糊渲染目标
    this.blurFramebuffer1 = this.createFramebuffer(width, height);
    this.blurTexture1 = this.createTexture(width, height);
    this.attachTextureToFramebuffer(this.blurFramebuffer1, this.blurTexture1);
    
    this.blurFramebuffer2 = this.createFramebuffer(width, height);
    this.blurTexture2 = this.createTexture(width, height);
    this.attachTextureToFramebuffer(this.blurFramebuffer2, this.blurTexture2);
    
    console.log('Framebuffers initialized successfully');
  }

  /**
   * 创建帧缓冲区
   */
  private createFramebuffer(_width: number, _height: number): WebGLFramebuffer {
    const framebuffer = this.gl.createFramebuffer();
    if (!framebuffer) {
      throw new Error('Failed to create framebuffer');
    }
    return framebuffer;
  }

  /**
   * 创建纹理
   */
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

  /**
   * 将纹理附加到帧缓冲区
   */
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
      throw new Error(`Framebuffer is not complete: ${status}`);
    }
  }

  /**
   * 渲染粒子系统
   */
  render(time: number): void {
    try {
      // 更新性能指标
      this.updateFPS();
      
      // 获取粒子数据
      const particleData = this.particleSystem.getParticleData();
      const particleCount = this.particleSystem.getParticleCount();
      
      if (particleCount === 0) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        return;
      }
      
      // 更新粒子缓冲区
      if (this.particleBuffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, particleData);
      }
      
      // 第一步：渲染粒子到主帧缓冲区
      this.renderParticlesToFramebuffer(time, particleCount);
      
      // 第二步：后处理效果
      this.applyPostProcessing(time);
    } catch (error) {
      console.error('Render error:', error);
    }
  }

  /**
   * 渲染粒子到帧缓冲区
   */
  private renderParticlesToFramebuffer(time: number, particleCount: number): void {
    if (!this.particleProgram || !this.particleBuffer) return;
    
    // 绑定主帧缓冲区
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.mainFramebuffer);
    
    // 设置视口
    const canvas = this.gl.canvas as HTMLCanvasElement;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    
    // 清除画布
    this.gl.clearColor(0.04, 0.06, 0.11, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // 启用混合
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // 使用粒子着色器程序
    this.gl.useProgram(this.particleProgram);
    
    // 获取统一变量位置
    const u_projection = this.gl.getUniformLocation(this.particleProgram, 'u_projection');
    const u_view = this.gl.getUniformLocation(this.particleProgram, 'u_view');
    const u_time = this.gl.getUniformLocation(this.particleProgram, 'u_time');
    const u_resolution = this.gl.getUniformLocation(this.particleProgram, 'u_resolution');
    const u_pointSize = this.gl.getUniformLocation(this.particleProgram, 'u_pointSize');
    const u_opacity = this.gl.getUniformLocation(this.particleProgram, 'u_opacity');
    
    // 设置统一变量
    if (u_projection) this.gl.uniformMatrix4fv(u_projection, false, this.projectionMatrix);
    if (u_view) this.gl.uniformMatrix4fv(u_view, false, this.viewMatrix);
    if (u_time) this.gl.uniform1f(u_time, time);
    if (u_resolution) this.gl.uniform2f(u_resolution, canvas.width, canvas.height);
    if (u_pointSize) this.gl.uniform1f(u_pointSize, 2.0);
    if (u_opacity) this.gl.uniform1f(u_opacity, this.particleSystem.getConfig().visual.opacity);
    
    // 获取属性位置
    const a_position = this.gl.getAttribLocation(this.particleProgram, 'a_position');
    const a_velocity = this.gl.getAttribLocation(this.particleProgram, 'a_velocity');
    const a_life = this.gl.getAttribLocation(this.particleProgram, 'a_life');
    const a_size = this.gl.getAttribLocation(this.particleProgram, 'a_size');
    const a_color = this.gl.getAttribLocation(this.particleProgram, 'a_color');
    
    // 绑定粒子缓冲区并设置属性
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleBuffer);
    
    const stride = 9 * 4; // 9个浮点数，每个4字节
    
    // 位置属性 (x, y)
    if (a_position >= 0) {
      this.gl.enableVertexAttribArray(a_position);
      this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, stride, 0);
    }
    
    // 速度属性 (vx, vy)
    if (a_velocity >= 0) {
      this.gl.enableVertexAttribArray(a_velocity);
      this.gl.vertexAttribPointer(a_velocity, 2, this.gl.FLOAT, false, stride, 8);
    }
    
    // 生命值属性
    if (a_life >= 0) {
      this.gl.enableVertexAttribArray(a_life);
      this.gl.vertexAttribPointer(a_life, 1, this.gl.FLOAT, false, stride, 16);
    }
    
    // 大小属性
    if (a_size >= 0) {
      this.gl.enableVertexAttribArray(a_size);
      this.gl.vertexAttribPointer(a_size, 1, this.gl.FLOAT, false, stride, 20);
    }
    
    // 颜色属性 (r, g, b)
    if (a_color >= 0) {
      this.gl.enableVertexAttribArray(a_color);
      this.gl.vertexAttribPointer(a_color, 3, this.gl.FLOAT, false, stride, 24);
    }
    
    // 绘制粒子
    this.gl.drawArrays(this.gl.POINTS, 0, particleCount);
    
    // 禁用属性数组
     if (a_position >= 0) this.gl.disableVertexAttribArray(a_position);
     if (a_velocity >= 0) this.gl.disableVertexAttribArray(a_velocity);
     if (a_life >= 0) this.gl.disableVertexAttribArray(a_life);
     if (a_size >= 0) this.gl.disableVertexAttribArray(a_size);
     if (a_color >= 0) this.gl.disableVertexAttribArray(a_color);
    
    // 解绑帧缓冲区
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  /**
   * 应用后处理效果
   */
  private applyPostProcessing(time: number): void {
    // 简化版本：直接渲染到屏幕，跳过复杂的后处理
    if (this.mainTexture) {
      this.renderToScreen(this.mainTexture, time);
    } else {
      // 如果没有主纹理，直接渲染到屏幕
      this.renderDirectToScreen(time);
    }
  }

  /**
   * 直接渲染到屏幕（简化版本）
   */
  private renderDirectToScreen(time: number): void {
    // 绑定默认帧缓冲区（屏幕）
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    
    // 设置视口
    const canvas = this.gl.canvas as HTMLCanvasElement;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    
    // 清除屏幕
    this.gl.clearColor(0.04, 0.06, 0.11, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // 直接渲染粒子到屏幕
    this.renderParticlesDirectly(time);
  }

  /**
   * 直接渲染粒子（不使用帧缓冲区）
   */
  private renderParticlesDirectly(time: number): void {
    if (!this.particleProgram || !this.particleBuffer) return;
    
    const particleCount = this.particleSystem.getParticleCount();
    if (particleCount === 0) return;
    
    // 启用混合
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // 使用粒子着色器程序
    this.gl.useProgram(this.particleProgram);
    
    // 获取统一变量位置
    const u_projection = this.gl.getUniformLocation(this.particleProgram, 'u_projection');
    const u_view = this.gl.getUniformLocation(this.particleProgram, 'u_view');
    const u_time = this.gl.getUniformLocation(this.particleProgram, 'u_time');
    const u_resolution = this.gl.getUniformLocation(this.particleProgram, 'u_resolution');
    const u_pointSize = this.gl.getUniformLocation(this.particleProgram, 'u_pointSize');
    const u_opacity = this.gl.getUniformLocation(this.particleProgram, 'u_opacity');
    
    const canvas = this.gl.canvas as HTMLCanvasElement;
    
    // 设置统一变量
    if (u_projection) this.gl.uniformMatrix4fv(u_projection, false, this.projectionMatrix);
    if (u_view) this.gl.uniformMatrix4fv(u_view, false, this.viewMatrix);
    if (u_time) this.gl.uniform1f(u_time, time);
    if (u_resolution) this.gl.uniform2f(u_resolution, canvas.width, canvas.height);
    if (u_pointSize) this.gl.uniform1f(u_pointSize, 3.0);
    if (u_opacity) this.gl.uniform1f(u_opacity, this.particleSystem.getConfig().visual.opacity);
    
    // 获取属性位置
    const a_position = this.gl.getAttribLocation(this.particleProgram, 'a_position');
    const a_velocity = this.gl.getAttribLocation(this.particleProgram, 'a_velocity');
    const a_life = this.gl.getAttribLocation(this.particleProgram, 'a_life');
    const a_size = this.gl.getAttribLocation(this.particleProgram, 'a_size');
    const a_color = this.gl.getAttribLocation(this.particleProgram, 'a_color');
    
    // 绑定粒子缓冲区并设置属性
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleBuffer);
    
    const stride = 9 * 4; // 9个浮点数，每个4字节
    
    // 设置顶点属性
    if (a_position >= 0) {
      this.gl.enableVertexAttribArray(a_position);
      this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, stride, 0);
    }
    
    if (a_velocity >= 0) {
      this.gl.enableVertexAttribArray(a_velocity);
      this.gl.vertexAttribPointer(a_velocity, 2, this.gl.FLOAT, false, stride, 8);
    }
    
    if (a_life >= 0) {
      this.gl.enableVertexAttribArray(a_life);
      this.gl.vertexAttribPointer(a_life, 1, this.gl.FLOAT, false, stride, 16);
    }
    
    if (a_size >= 0) {
      this.gl.enableVertexAttribArray(a_size);
      this.gl.vertexAttribPointer(a_size, 1, this.gl.FLOAT, false, stride, 20);
    }
    
    if (a_color >= 0) {
      this.gl.enableVertexAttribArray(a_color);
      this.gl.vertexAttribPointer(a_color, 3, this.gl.FLOAT, false, stride, 24);
    }
    
    // 绘制粒子
    this.gl.drawArrays(this.gl.POINTS, 0, particleCount);
    
    // 禁用属性数组
    if (a_position >= 0) this.gl.disableVertexAttribArray(a_position);
    if (a_velocity >= 0) this.gl.disableVertexAttribArray(a_velocity);
    if (a_life >= 0) this.gl.disableVertexAttribArray(a_life);
    if (a_size >= 0) this.gl.disableVertexAttribArray(a_size);
    if (a_color >= 0) this.gl.disableVertexAttribArray(a_color);
  }

  /**
   * 应用模糊效果
   */
  private applyBlur(inputTexture: WebGLTexture): WebGLTexture {
    if (!this.blurProgram || !this.blurFramebuffer1 || !this.blurFramebuffer2) {
      return inputTexture;
    }
    
    // 水平模糊
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer1);
    this.gl.useProgram(this.blurProgram);
    
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);
    
    // 设置模糊参数
    const u_texture = this.gl.getUniformLocation(this.blurProgram, 'u_texture');
    const u_resolution = this.gl.getUniformLocation(this.blurProgram, 'u_resolution');
    const u_blurAmount = this.gl.getUniformLocation(this.blurProgram, 'u_blurAmount');
    const u_direction = this.gl.getUniformLocation(this.blurProgram, 'u_direction');
    
    if (u_texture) this.gl.uniform1i(u_texture, 0);
    if (u_resolution) this.gl.uniform2f(u_resolution, this.gl.canvas.width, this.gl.canvas.height);
    if (u_blurAmount) this.gl.uniform1f(u_blurAmount, this.renderConfig.blurAmount);
    if (u_direction) this.gl.uniform2f(u_direction, 1.0, 0.0);
    
    // 绘制全屏四边形
    if (this.quadBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
      const a_position = this.gl.getAttribLocation(this.blurProgram, 'a_position');
      if (a_position >= 0) {
        this.gl.enableVertexAttribArray(a_position);
        this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.disableVertexAttribArray(a_position);
      }
    }
    
    // 垂直模糊
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer2);
    
    if (this.blurTexture1) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurTexture1);
      if (u_direction) this.gl.uniform2f(u_direction, 0.0, 1.0);
      
      if (this.quadBuffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
        const a_position = this.gl.getAttribLocation(this.blurProgram, 'a_position');
        if (a_position >= 0) {
          this.gl.enableVertexAttribArray(a_position);
          this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
          this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
          this.gl.disableVertexAttribArray(a_position);
        }
      }
    }
    
    return this.blurTexture2 || inputTexture;
  }

  /**
   * 应用发光效果
   */
  private applyBloom(inputTexture: WebGLTexture): WebGLTexture {
    if (!this.bloomProgram || !this.mainFramebuffer) {
      return inputTexture;
    }
    
    // 渲染到主帧缓冲区
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.mainFramebuffer);
    this.gl.useProgram(this.bloomProgram);
    
    // 绑定原始纹理
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);
    
    // 绑定模糊纹理
    this.gl.activeTexture(this.gl.TEXTURE1);
    const blurTexture = this.blurTexture2 || this.blurTexture1;
    if (blurTexture) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture);
    }
    
    // 设置发光参数
    const u_texture = this.gl.getUniformLocation(this.bloomProgram, 'u_texture');
    const u_blurTexture = this.gl.getUniformLocation(this.bloomProgram, 'u_blurTexture');
    const u_bloomStrength = this.gl.getUniformLocation(this.bloomProgram, 'u_bloomStrength');
    const u_bloomThreshold = this.gl.getUniformLocation(this.bloomProgram, 'u_bloomThreshold');
    
    if (u_texture) this.gl.uniform1i(u_texture, 0);
    if (u_blurTexture) this.gl.uniform1i(u_blurTexture, 1);
    if (u_bloomStrength) this.gl.uniform1f(u_bloomStrength, this.renderConfig.bloomStrength);
    if (u_bloomThreshold) this.gl.uniform1f(u_bloomThreshold, this.renderConfig.bloomThreshold);
    
    // 绘制全屏四边形
    if (this.quadBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
      const a_position = this.gl.getAttribLocation(this.bloomProgram, 'a_position');
      if (a_position >= 0) {
        this.gl.enableVertexAttribArray(a_position);
        this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.disableVertexAttribArray(a_position);
      }
    }
    
    return this.mainTexture || inputTexture;
  }

  /**
   * 应用色彩校正
   */
  private applyColorCorrection(inputTexture: WebGLTexture): WebGLTexture {
    if (!this.finalProgram || !this.blurFramebuffer1) {
      return inputTexture;
    }
    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer1);
    this.gl.useProgram(this.finalProgram);
    
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);
    
    // 设置色彩校正参数
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
    
    // 绘制全屏四边形
    if (this.quadBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
      const a_position = this.gl.getAttribLocation(this.finalProgram, 'a_position');
      if (a_position >= 0) {
        this.gl.enableVertexAttribArray(a_position);
        this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.disableVertexAttribArray(a_position);
      }
    }
    
    return this.blurTexture1 || inputTexture;
  }

  /**
   * 渲染到屏幕
   */
  private renderToScreen(inputTexture: WebGLTexture, time: number): void {
    if (!this.finalProgram) {
      return;
    }
    
    // 渲染到屏幕
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.useProgram(this.finalProgram);
    
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);
    
    // 设置最终合成参数
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
    
    // 绘制全屏四边形
    if (this.quadBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
      const a_position = this.gl.getAttribLocation(this.finalProgram, 'a_position');
      if (a_position >= 0) {
        this.gl.enableVertexAttribArray(a_position);
        this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.disableVertexAttribArray(a_position);
      }
    }
  }

  /**
   * 设置全屏四边形
   */
  private setupFullscreenQuad(program: WebGLProgram): void {
    if (!this.quadBuffer) return;
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    const a_position = this.gl.getAttribLocation(program, 'a_position');
    if (a_position >= 0) {
      this.gl.enableVertexAttribArray(a_position);
      this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
    }
  }

  /**
   * 更新 FPS
   */
  private updateFPS(): void {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastFpsTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  /**
   * 获取 FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * 更新渲染配置
   */
  updateRenderConfig(newConfig: Partial<RenderConfig>): void {
    this.renderConfig = { ...this.renderConfig, ...newConfig };
  }

  /**
   * 调整大小
   */
  resize(width: number, height: number): void {
    this.projectionMatrix = createProjectionMatrix(width, height);
    
    // 重新创建帧缓冲区
    this.initializeFramebuffers();
  }

  /**
   * 销毁渲染器
   */
  dispose(): void {
    try {
      // 清理着色器程序
      if (this.particleProgram) {
        this.gl.deleteProgram(this.particleProgram);
        this.particleProgram = null;
      }
      if (this.blurProgram) {
        this.gl.deleteProgram(this.blurProgram);
        this.blurProgram = null;
      }
      if (this.bloomProgram) {
        this.gl.deleteProgram(this.bloomProgram);
        this.bloomProgram = null;
      }
      if (this.finalProgram) {
        this.gl.deleteProgram(this.finalProgram);
        this.finalProgram = null;
      }

      // 清理帧缓冲区
      if (this.mainFramebuffer) {
        this.gl.deleteFramebuffer(this.mainFramebuffer);
        this.mainFramebuffer = null;
      }
      if (this.blurFramebuffer1) {
        this.gl.deleteFramebuffer(this.blurFramebuffer1);
        this.blurFramebuffer1 = null;
      }
      if (this.blurFramebuffer2) {
        this.gl.deleteFramebuffer(this.blurFramebuffer2);
        this.blurFramebuffer2 = null;
      }

      // 清理纹理
      if (this.mainTexture) {
        this.gl.deleteTexture(this.mainTexture);
        this.mainTexture = null;
      }
      if (this.blurTexture1) {
        this.gl.deleteTexture(this.blurTexture1);
        this.blurTexture1 = null;
      }
      if (this.blurTexture2) {
        this.gl.deleteTexture(this.blurTexture2);
        this.blurTexture2 = null;
      }

      // 清理缓冲区
      if (this.particleBuffer) {
        this.gl.deleteBuffer(this.particleBuffer);
        this.particleBuffer = null;
      }
      if (this.quadBuffer) {
        this.gl.deleteBuffer(this.quadBuffer);
        this.quadBuffer = null;
      }
    } catch (error) {
      console.error('Error disposing ParticleRenderer:', error);
    }
  }
}

/**
 * 默认渲染配置
 */
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