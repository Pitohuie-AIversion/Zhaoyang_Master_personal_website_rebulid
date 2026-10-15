/**
 * 创建投影矩阵
 */
export function createProjectionMatrix(width: number, height: number): Float32Array {
  const matrix = new Float32Array(16);

  // 正交投影矩阵
  const left = 0;
  const right = width;
  const bottom = height;
  const top = 0;
  const near = -1;
  const far = 1;

  matrix[0] = 2 / (right - left);
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;

  matrix[4] = 0;
  matrix[5] = 2 / (top - bottom);
  matrix[6] = 0;
  matrix[7] = 0;

  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = -2 / (far - near);
  matrix[11] = 0;

  matrix[12] = -(right + left) / (right - left);
  matrix[13] = -(top + bottom) / (top - bottom);
  matrix[14] = -(far + near) / (far - near);
  matrix[15] = 1;

  return matrix;
}

/**
 * 创建视图矩阵
 */
export function createViewMatrix(): Float32Array {
  // 单位矩阵
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}
