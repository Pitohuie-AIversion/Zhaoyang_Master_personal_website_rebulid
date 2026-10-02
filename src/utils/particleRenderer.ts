/**
 * 粒子渲染器 - 专门处理粒子系统的 WebGL 渲染
 */

import { shaderConfigs, fullscreenQuadVertices } from './shaders';
import { ParticleSystem } from './particleSystem';
import { createProjectionMatrix, createViewMatrix } from './webgl';
import { PostProcessingPipeline, type RenderConfig, defaultRenderConfig } from './postProcessingPipeline';

export type { RenderConfig };
export { defaultRenderConfig };

export class ParticleRenderer {
  private gl: WebGL2RenderingContext;
  private particleSystem: ParticleSystem;
  private renderConfig: RenderConfig;
  private pipeline: PostProcessingPipeline;

  // 着色器程序
  private particleProgram: WebGLProgram | null = null;

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

    this.initializeBuffers();

    // 实例化后处理渲染管线
    this.pipeline = new PostProcessingPipeline(this.gl, this.renderConfig, this.quadBuffer);

    this.initializeShaders();
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
      const blurProgram = this.createShaderProgram(
        shaderConfigs.find(c => c.name === 'blur')!.vertexShader,
        shaderConfigs.find(c => c.name === 'blur')!.fragmentShader
      );

      const bloomProgram = this.createShaderProgram(
        shaderConfigs.find(c => c.name === 'bloom')!.vertexShader,
        shaderConfigs.find(c => c.name === 'bloom')!.fragmentShader
      );

      const finalProgram = this.createShaderProgram(
        shaderConfigs.find(c => c.name === 'finalComposite')!.vertexShader,
        shaderConfigs.find(c => c.name === 'finalComposite')!.fragmentShader
      );

      this.pipeline.setPrograms(blurProgram, bloomProgram, finalProgram);

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

    if (!this.gl.getProgramParameter(shader, this.gl.COMPILE_STATUS)) {
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
      // 预分配空间 - 每个粒子9个浮点数 (x, y, vx, vy, life, size, r, g, b)
      const initialData = new Float32Array(10000 * 9);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, initialData, this.gl.DYNAMIC_DRAW);
    }

    console.log('Buffers initialized successfully');
  }

  /**
   * 渲染粒子系统
   */
  render(time: number): void {
    try {
      this.updateFPS();

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

      const mainFramebuffer = this.pipeline.getMainFramebuffer();
      const mainTexture = this.pipeline.getMainTexture();

      if (mainFramebuffer && mainTexture) {
        // 渲染粒子到离屏主帧缓冲区
        this.renderParticlesToFramebuffer(time, particleCount, mainFramebuffer);

        // 应用后处理流水线
        let currentTexture = mainTexture;
        if (this.renderConfig.enableBlur) {
          currentTexture = this.pipeline.applyBlur(currentTexture);
        }
        if (this.renderConfig.enableBloom) {
          currentTexture = this.pipeline.applyBloom(currentTexture);
        }
        if (this.renderConfig.enableColorCorrection) {
          currentTexture = this.pipeline.applyColorCorrection(currentTexture);
        }

        // 呈现到屏幕
        this.pipeline.renderToScreen(currentTexture, time);
      } else {
        // 直接渲染粒子到屏幕画布
        this.renderParticlesDirectly(time);
      }
    } catch (error) {
      console.error('Render error:', error);
    }
  }

  /**
   * 渲染粒子到指定帧缓冲区
   */
  private renderParticlesToFramebuffer(
    time: number,
    particleCount: number,
    framebuffer: WebGLFramebuffer
  ): void {
    if (!this.particleProgram || !this.particleBuffer) return;

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);

    const canvas = this.gl.canvas as HTMLCanvasElement;
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.gl.clearColor(0.04, 0.06, 0.11, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.drawParticleArrays(time, particleCount);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  /**
   * 直接渲染粒子到默认屏幕缓冲区
   */
  private renderParticlesDirectly(time: number): void {
    if (!this.particleProgram || !this.particleBuffer) return;

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    const canvas = this.gl.canvas as HTMLCanvasElement;
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.gl.clearColor(0.04, 0.06, 0.11, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const particleCount = this.particleSystem.getParticleCount();
    if (particleCount === 0) return;

    this.drawParticleArrays(time, particleCount);
  }

  /**
   * 绑定着色器统一变量并调用绘制
   */
  private drawParticleArrays(time: number, particleCount: number): void {
    if (!this.particleProgram || !this.particleBuffer) return;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.gl.useProgram(this.particleProgram);

    const u_projection = this.gl.getUniformLocation(this.particleProgram, 'u_projection');
    const u_view = this.gl.getUniformLocation(this.particleProgram, 'u_view');
    const u_time = this.gl.getUniformLocation(this.particleProgram, 'u_time');
    const u_resolution = this.gl.getUniformLocation(this.particleProgram, 'u_resolution');
    const u_pointSize = this.gl.getUniformLocation(this.particleProgram, 'u_pointSize');
    const u_opacity = this.gl.getUniformLocation(this.particleProgram, 'u_opacity');

    const canvas = this.gl.canvas as HTMLCanvasElement;

    if (u_projection) this.gl.uniformMatrix4fv(u_projection, false, this.projectionMatrix);
    if (u_view) this.gl.uniformMatrix4fv(u_view, false, this.viewMatrix);
    if (u_time) this.gl.uniform1f(u_time, time);
    if (u_resolution) this.gl.uniform2f(u_resolution, canvas.width, canvas.height);
    if (u_pointSize) this.gl.uniform1f(u_pointSize, 2.0);
    if (u_opacity) this.gl.uniform1f(u_opacity, this.particleSystem.getConfig().visual.opacity);

    const a_position = this.gl.getAttribLocation(this.particleProgram, 'a_position');
    const a_velocity = this.gl.getAttribLocation(this.particleProgram, 'a_velocity');
    const a_life = this.gl.getAttribLocation(this.particleProgram, 'a_life');
    const a_size = this.gl.getAttribLocation(this.particleProgram, 'a_size');
    const a_color = this.gl.getAttribLocation(this.particleProgram, 'a_color');

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleBuffer);

    const stride = 9 * 4;

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

    this.gl.drawArrays(this.gl.POINTS, 0, particleCount);

    if (a_position >= 0) this.gl.disableVertexAttribArray(a_position);
    if (a_velocity >= 0) this.gl.disableVertexAttribArray(a_velocity);
    if (a_life >= 0) this.gl.disableVertexAttribArray(a_life);
    if (a_size >= 0) this.gl.disableVertexAttribArray(a_size);
    if (a_color >= 0) this.gl.disableVertexAttribArray(a_color);
  }

  private updateFPS(): void {
    this.frameCount++;
    const now = performance.now();

    if (now - this.lastFpsTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  updateRenderConfig(newConfig: Partial<RenderConfig>): void {
    this.renderConfig = { ...this.renderConfig, ...newConfig };
    this.pipeline.updateConfig(newConfig);
  }

  resize(width: number, height: number): void {
    this.projectionMatrix = createProjectionMatrix(width, height);
    this.pipeline.resize();
  }

  dispose(): void {
    try {
      this.pipeline.dispose();

      if (this.particleProgram) {
        this.gl.deleteProgram(this.particleProgram);
      }
      if (this.particleBuffer) {
        this.gl.deleteBuffer(this.particleBuffer);
      }
      if (this.quadBuffer) {
        this.gl.deleteBuffer(this.quadBuffer);
      }

      console.log('Particle renderer disposed successfully');
    } catch (error) {
      console.error('Error disposing particle renderer:', error);
    }
  }
}