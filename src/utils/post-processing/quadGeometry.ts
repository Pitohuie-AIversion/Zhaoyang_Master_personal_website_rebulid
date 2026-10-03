export function createFullscreenQuad(gl: WebGL2RenderingContext): {
  vao: WebGLVertexArrayObject | null;
  vbo: WebGLBuffer | null;
} {
  // 全屏四边形顶点数据 (位置 + UV)
  const quadVertices = new Float32Array([
    // 位置      UV
    -1, -1,    0, 0,
     1, -1,    1, 0,
    -1,  1,    0, 1,
     1,  1,    1, 1,
  ]);

  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

  // 位置属性
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

  // UV 属性
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

  gl.bindVertexArray(null);

  return { vao, vbo };
}
