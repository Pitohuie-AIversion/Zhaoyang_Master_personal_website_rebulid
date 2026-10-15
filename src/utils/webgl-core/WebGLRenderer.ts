import { ShaderProgram } from './types';
import { compileShader, linkProgram, createShaderProgram } from './webglShader';

export class WebGLRenderer {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private programs: Map<string, ShaderProgram> = new Map();
  private buffers: Map<string, WebGLBuffer> = new Map();
  private textures: Map<string, WebGLTexture> = new Map();
  private framebuffers: Map<string, WebGLFramebuffer> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      throw new Error('WebGL 2.0 not supported');
    }

    this.gl = gl;
    this.initializeGL();
  }

  private initializeGL(): void {
    const { gl } = this;

    // 启用混合
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 设置清除颜色
    gl.clearColor(0.04, 0.06, 0.11, 1.0); // 深蓝色背景
  }

  /**
   * 编译着色器
   */
  compileShader(source: string, type: number): WebGLShader {
    return compileShader(this.gl, source, type);
  }

  /**
   * 链接着色器程序
   */
  linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    return linkProgram(this.gl, vertexShader, fragmentShader);
  }

  /**
   * 创建着色器程序
   */
  createProgram(name: string, vertexSource: string, fragmentSource: string): ShaderProgram {
    const shaderProgram = createShaderProgram(this.gl, vertexSource, fragmentSource);
    this.programs.set(name, shaderProgram);
    return shaderProgram;
  }

  /**
   * 获取着色器程序
   */
  getProgram(name: string): ShaderProgram | undefined {
    return this.programs.get(name);
  }

  /**
   * 创建缓冲区
   */
  createBuffer(name: string, data: Float32Array, usage: number = this.gl.STATIC_DRAW): WebGLBuffer {
    const { gl } = this;
    const buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error('Failed to create buffer');
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);

    this.buffers.set(name, buffer);
    return buffer;
  }

  /**
   * 更新缓冲区数据
   */
  updateBuffer(name: string, data: Float32Array, offset: number = 0): void {
    const { gl } = this;
    const buffer = this.buffers.get(name);

    if (!buffer) {
      throw new Error(`Buffer ${name} not found`);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
  }

  /**
   * 获取缓冲区
   */
  getBuffer(name: string): WebGLBuffer | undefined {
    return this.buffers.get(name);
  }

  /**
   * 创建纹理
   */
  createTexture(name: string, width: number, height: number, format: number = this.gl.RGBA): WebGLTexture {
    const { gl } = this;
    const texture = gl.createTexture();

    if (!texture) {
      throw new Error('Failed to create texture');
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);

    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.textures.set(name, texture);
    return texture;
  }

  /**
   * 获取纹理
   */
  getTexture(name: string): WebGLTexture | undefined {
    return this.textures.get(name);
  }

  /**
   * 创建帧缓冲区
   */
  createFramebuffer(name: string, width: number, height: number): WebGLFramebuffer {
    const { gl } = this;
    const framebuffer = gl.createFramebuffer();

    if (!framebuffer) {
      throw new Error('Failed to create framebuffer');
    }

    // 创建颜色纹理
    const colorTexture = this.createTexture(`${name}_color`, width, height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);

    // 检查帧缓冲区完整性
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Framebuffer is not complete');
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.framebuffers.set(name, framebuffer);
    return framebuffer;
  }

  /**
   * 获取帧缓冲区
   */
  getFramebuffer(name: string): WebGLFramebuffer | undefined {
    return this.framebuffers.get(name);
  }

  /**
   * 设置视口
   */
  setViewport(x: number, y: number, width: number, height: number): void {
    this.gl.viewport(x, y, width, height);
  }

  /**
   * 清除画布
   */
  clear(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * 使用着色器程序
   */
  useProgram(name: string): ShaderProgram {
    const program = this.programs.get(name);
    if (!program) {
      throw new Error(`Program ${name} not found`);
    }

    this.gl.useProgram(program.program);
    return program;
  }

  /**
   * 获取统一变量位置
   */
  getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation {
    const location = this.gl.getUniformLocation(program, name);
    if (!location) {
      throw new Error(`Uniform ${name} not found in program`);
    }
    return location;
  }

  /**
   * 设置统一变量
   */
  setUniform(location: WebGLUniformLocation, type: string, value: number | Float32Array | Int32Array): void {
    const { gl } = this;

    switch (type) {
      case '1f':
        gl.uniform1f(location, value as number);
        break;
      case '2f':
        gl.uniform2f(location, (value as Float32Array)[0], (value as Float32Array)[1]);
        break;
      case '3f':
        gl.uniform3f(location, (value as Float32Array)[0], (value as Float32Array)[1], (value as Float32Array)[2]);
        break;
      case '4f':
        gl.uniform4f(location, (value as Float32Array)[0], (value as Float32Array)[1], (value as Float32Array)[2], (value as Float32Array)[3]);
        break;
      case '1i':
        gl.uniform1i(location, value as number);
        break;
      case 'matrix4fv':
        gl.uniformMatrix4fv(location, false, value as Float32Array);
        break;
      default:
        throw new Error(`Unknown uniform type: ${type}`);
    }
  }

  /**
   * 设置顶点属性
   */
  setAttribute(location: number, buffer: WebGLBuffer, size: number, type: number = this.gl.FLOAT): void {
    const { gl } = this;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type, false, 0, 0);
  }

  /**
   * 绘制点
   */
  drawPoints(count: number): void {
    this.gl.drawArrays(this.gl.POINTS, 0, count);
  }

  /**
   * 绘制三角形
   */
  drawTriangles(count: number): void {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, count);
  }

  /**
   * 调整画布大小
   */
  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.setViewport(0, 0, width, height);
  }

  /**
   * 获取 WebGL 上下文
   */
  getContext(): WebGL2RenderingContext {
    return this.gl;
  }

  /**
   * 获取画布
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * 销毁资源
   */
  dispose(): void {
    const { gl } = this;

    // 删除程序
    this.programs.forEach(({ program }) => {
      gl.deleteProgram(program);
    });
    this.programs.clear();

    // 删除缓冲区
    this.buffers.forEach(buffer => {
      gl.deleteBuffer(buffer);
    });
    this.buffers.clear();

    // 删除纹理
    this.textures.forEach(texture => {
      gl.deleteTexture(texture);
    });
    this.textures.clear();

    // 删除帧缓冲区
    this.framebuffers.forEach(framebuffer => {
      gl.deleteFramebuffer(framebuffer);
    });
    this.framebuffers.clear();
  }
}
