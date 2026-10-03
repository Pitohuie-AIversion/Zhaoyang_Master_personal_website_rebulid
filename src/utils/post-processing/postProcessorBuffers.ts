export interface MainFramebufferGroup {
  framebuffer: WebGLFramebuffer | null;
  texture: WebGLTexture | null;
  depthBuffer: WebGLRenderbuffer | null;
}

export interface BloomFramebufferGroup {
  framebuffers: WebGLFramebuffer[];
  textures: WebGLTexture[];
}

export function createMainFramebuffer(
  gl: WebGL2RenderingContext,
  width: number,
  height: number
): MainFramebufferGroup {
  const framebuffer = gl.createFramebuffer();
  const texture = gl.createTexture();
  const depthBuffer = gl.createRenderbuffer();

  // 设置颜色纹理
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA16F,
    width,
    height,
    0,
    gl.RGBA,
    gl.FLOAT,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // 设置深度缓冲区
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, width, height);

  // 绑定到帧缓冲区
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthBuffer
  );

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('Main framebuffer is not complete');
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { framebuffer, texture, depthBuffer };
}

export function createBloomFramebuffers(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels = 4
): BloomFramebufferGroup {
  const framebuffers: WebGLFramebuffer[] = [];
  const textures: WebGLTexture[] = [];

  for (let i = 0; i < levels; i++) {
    const scale = Math.pow(0.5, i + 1);
    const levelWidth = Math.max(1, Math.floor(width * scale));
    const levelHeight = Math.max(1, Math.floor(height * scale));

    const framebuffer = gl.createFramebuffer();
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA16F,
      levelWidth,
      levelHeight,
      0,
      gl.RGBA,
      gl.FLOAT,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    if (framebuffer) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );

      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(`Bloom framebuffer ${i} is not complete`);
      }

      framebuffers.push(framebuffer);
    }
    if (texture) {
      textures.push(texture);
    }
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { framebuffers, textures };
}
