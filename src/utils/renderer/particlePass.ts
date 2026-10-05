import { ParticleUniforms } from './types';

export const drawParticles = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  particleCount: number,
  uniforms: ParticleUniforms
): void => {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.useProgram(program);

  const u_projection = gl.getUniformLocation(program, 'u_projection');
  const u_view = gl.getUniformLocation(program, 'u_view');
  const u_time = gl.getUniformLocation(program, 'u_time');
  const u_resolution = gl.getUniformLocation(program, 'u_resolution');
  const u_pointSize = gl.getUniformLocation(program, 'u_pointSize');
  const u_opacity = gl.getUniformLocation(program, 'u_opacity');

  if (u_projection) gl.uniformMatrix4fv(u_projection, false, uniforms.projectionMatrix);
  if (u_view) gl.uniformMatrix4fv(u_view, false, uniforms.viewMatrix);
  if (u_time) gl.uniform1f(u_time, uniforms.time);
  if (u_resolution) gl.uniform2f(u_resolution, uniforms.width, uniforms.height);
  if (u_pointSize) gl.uniform1f(u_pointSize, uniforms.pointSize ?? 2.0);
  if (u_opacity) gl.uniform1f(u_opacity, uniforms.opacity ?? 1.0);

  const a_position = gl.getAttribLocation(program, 'a_position');
  const a_velocity = gl.getAttribLocation(program, 'a_velocity');
  const a_life = gl.getAttribLocation(program, 'a_life');
  const a_size = gl.getAttribLocation(program, 'a_size');
  const a_color = gl.getAttribLocation(program, 'a_color');

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const stride = 9 * 4;

  if (a_position >= 0) {
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, stride, 0);
  }
  if (a_velocity >= 0) {
    gl.enableVertexAttribArray(a_velocity);
    gl.vertexAttribPointer(a_velocity, 2, gl.FLOAT, false, stride, 8);
  }
  if (a_life >= 0) {
    gl.enableVertexAttribArray(a_life);
    gl.vertexAttribPointer(a_life, 1, gl.FLOAT, false, stride, 16);
  }
  if (a_size >= 0) {
    gl.enableVertexAttribArray(a_size);
    gl.vertexAttribPointer(a_size, 1, gl.FLOAT, false, stride, 20);
  }
  if (a_color >= 0) {
    gl.enableVertexAttribArray(a_color);
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, stride, 24);
  }

  gl.drawArrays(gl.POINTS, 0, particleCount);

  if (a_position >= 0) gl.disableVertexAttribArray(a_position);
  if (a_velocity >= 0) gl.disableVertexAttribArray(a_velocity);
  if (a_life >= 0) gl.disableVertexAttribArray(a_life);
  if (a_size >= 0) gl.disableVertexAttribArray(a_size);
  if (a_color >= 0) gl.disableVertexAttribArray(a_color);
};
