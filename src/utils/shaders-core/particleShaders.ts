/**
 * 粒子顶点着色器
 */
export const particleVertexShader = `#version 300 es
precision highp float;

// 顶点属性
in vec2 a_position;
in vec2 a_velocity;
in float a_life;
in float a_size;
in vec3 a_color;

// 统一变量
uniform mat4 u_projection;
uniform mat4 u_view;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pointSize;

// 输出到片段着色器
out float v_life;
out vec3 v_color;
out vec2 v_velocity;

void main() {
  // 计算位置
  vec4 position = u_projection * u_view * vec4(a_position, 0.0, 1.0);
  gl_Position = position;
  
  // 计算点大小（基于生命值和速度）
  float velocityMagnitude = length(a_velocity);
  float sizeMultiplier = 1.0 + velocityMagnitude * 0.01;
  gl_PointSize = a_size * u_pointSize * a_life * sizeMultiplier;
  
  // 传递变量到片段着色器
  v_life = a_life;
  v_color = a_color;
  v_velocity = a_velocity;
}
`;

/**
 * 粒子片段着色器
 */
export const particleFragmentShader = `#version 300 es
precision highp float;

// 从顶点着色器输入
in float v_life;
in vec3 v_color;
in vec2 v_velocity;

// 统一变量
uniform float u_time;
uniform float u_opacity;
uniform vec2 u_resolution;

// 输出颜色
out vec4 fragColor;

void main() {
  // 计算点的距离中心的距离
  vec2 coord = gl_PointCoord - vec2(0.5);
  float distance = length(coord);
  
  // 创建圆形粒子
  if (distance > 0.5) {
    discard;
  }
  
  // 计算透明度（基于距离和生命值）
  float alpha = (1.0 - distance * 2.0) * v_life * u_opacity;
  
  // 添加发光效果
  float glow = 1.0 - smoothstep(0.0, 0.5, distance);
  alpha *= glow;
  
  // 基于速度调整颜色强度
  float velocityMagnitude = length(v_velocity);
  vec3 finalColor = v_color * (1.0 + velocityMagnitude * 0.02);
  
  // 添加时间变化的闪烁效果
  float flicker = 0.8 + 0.2 * sin(u_time * 3.0 + gl_FragCoord.x * 0.01);
  finalColor *= flicker;
  
  fragColor = vec4(finalColor, alpha);
}
`;
