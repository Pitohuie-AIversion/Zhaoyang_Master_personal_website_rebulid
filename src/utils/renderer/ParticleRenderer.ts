import { shaderConfigs, fullscreenQuadVertices } from '../shaders';
import { ParticleSystem } from '../particleSystem';
import { createProjectionMatrix, createViewMatrix } from '../webgl';
import { PostProcessingPipeline, type RenderConfig } from '../postProcessingPipeline';
import { createShaderProgram } from './shaderUtils';
import { drawParticles } from './particlePass';
import { FpsTracker } from './fpsTracker';

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
  private fpsTracker = new FpsTracker();

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

  private initializeShaders(): void {
    try {
      this.particleProgram = createShaderProgram(
        this.gl,
        shaderConfigs.find(c => c.name === 'particle')!.vertexShader,
        shaderConfigs.find(c => c.name === 'particle')!.fragmentShader
      );

      const blurProgram = createShaderProgram(
        this.gl,
        shaderConfigs.find(c => c.name === 'blur')!.vertexShader,
        shaderConfigs.find(c => c.name === 'blur')!.fragmentShader
      );

      const bloomProgram = createShaderProgram(
        this.gl,
        shaderConfigs.find(c => c.name === 'bloom')!.vertexShader,
        shaderConfigs.find(c => c.name === 'bloom')!.fragmentShader
      );

      const finalProgram = createShaderProgram(
        this.gl,
        shaderConfigs.find(c => c.name === 'finalComposite')!.vertexShader,
        shaderConfigs.find(c => c.name === 'finalComposite')!.fragmentShader
      );

      this.pipeline.setPrograms(blurProgram, bloomProgram, finalProgram);
    } catch (error) {
      console.error('Failed to initialize shaders:', error);
      throw error;
    }
  }

  private initializeBuffers(): void {
    this.quadBuffer = this.gl.createBuffer();
    if (this.quadBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, fullscreenQuadVertices, this.gl.STATIC_DRAW);
    }

    this.particleBuffer = this.gl.createBuffer();
    if (this.particleBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleBuffer);
      const initialData = new Float32Array(10000 * 9);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, initialData, this.gl.DYNAMIC_DRAW);
    }
  }

  render(time: number): void {
    try {
      this.fpsTracker.update();

      const particleData = this.particleSystem.getParticleData();
      const particleCount = this.particleSystem.getParticleCount();

      if (particleCount === 0) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        return;
      }

      if (this.particleBuffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, particleData);
      }

      const mainFramebuffer = this.pipeline.getMainFramebuffer();
      const mainTexture = this.pipeline.getMainTexture();

      if (mainFramebuffer && mainTexture) {
        this.renderParticlesToFramebuffer(time, particleCount, mainFramebuffer);

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

        this.pipeline.renderToScreen(currentTexture, time);
      } else {
        this.renderParticlesDirectly(time);
      }
    } catch (error) {
      console.error('Render error:', error);
    }
  }

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

  private drawParticleArrays(time: number, particleCount: number): void {
    if (!this.particleProgram || !this.particleBuffer) return;

    const canvas = this.gl.canvas as HTMLCanvasElement;
    drawParticles(
      this.gl,
      this.particleProgram,
      this.particleBuffer,
      particleCount,
      {
        projectionMatrix: this.projectionMatrix,
        viewMatrix: this.viewMatrix,
        time,
        width: canvas.width,
        height: canvas.height,
        pointSize: 2.0,
        opacity: this.particleSystem.getConfig().visual.opacity
      }
    );
  }

  getFPS(): number {
    return this.fpsTracker.getFPS();
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
    } catch (error) {
      console.error('Error disposing particle renderer:', error);
    }
  }
}
