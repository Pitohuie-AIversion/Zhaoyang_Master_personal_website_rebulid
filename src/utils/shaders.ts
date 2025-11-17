/**
 * WebGL 着色器定义
 * 包含粒子渲染和后处理效果的着色器
 */

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

/**
 * 后处理顶点着色器（全屏四边形）
 */
export const postProcessVertexShader = `#version 300 es
precision highp float;

// 顶点属性
in vec2 a_position;

// 输出到片段着色器
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = (a_position + 1.0) * 0.5;
}
`;

/**
 * 模糊效果片段着色器
 */
export const blurFragmentShader = `#version 300 es
precision highp float;

// 从顶点着色器输入
in vec2 v_texCoord;

// 统一变量
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_blurAmount;
uniform vec2 u_direction; // (1,0) 为水平，(0,1) 为垂直

// 输出颜色
out vec4 fragColor;

void main() {
  vec2 texelSize = 1.0 / u_resolution;
  vec4 color = vec4(0.0);
  
  // 高斯模糊权重
  float weights[5];
  weights[0] = 0.227027;
  weights[1] = 0.1945946;
  weights[2] = 0.1216216;
  weights[3] = 0.054054;
  weights[4] = 0.016216;
  
  // 中心像素
  color += texture(u_texture, v_texCoord) * weights[0];
  
  // 周围像素
  for (int i = 1; i < 5; i++) {
    vec2 offset = float(i) * u_blurAmount * u_direction * texelSize;
    color += texture(u_texture, v_texCoord + offset) * weights[i];
    color += texture(u_texture, v_texCoord - offset) * weights[i];
  }
  
  fragColor = color;
}
`;

/**
 * 发光效果片段着色器
 */
export const bloomFragmentShader = `#version 300 es
precision highp float;

// 从顶点着色器输入
in vec2 v_texCoord;

// 统一变量
uniform sampler2D u_texture;
uniform sampler2D u_blurTexture;
uniform float u_bloomStrength;
uniform float u_bloomThreshold;

// 输出颜色
out vec4 fragColor;

void main() {
  vec4 originalColor = texture(u_texture, v_texCoord);
  vec4 blurColor = texture(u_blurTexture, v_texCoord);
  
  // 提取亮部
  float brightness = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));
  vec4 bloomColor = vec4(0.0);
  
  if (brightness > u_bloomThreshold) {
    bloomColor = originalColor * (brightness - u_bloomThreshold) / (1.0 - u_bloomThreshold);
  }
  
  // 混合原始颜色和发光效果
  vec4 finalColor = originalColor + blurColor * u_bloomStrength + bloomColor * 0.5;
  
  fragColor = vec4(finalColor.rgb, originalColor.a);
}
`;

/**
 * 色彩校正片段着色器
 */
export const colorCorrectionFragmentShader = `#version 300 es
precision highp float;

// 从顶点着色器输入
in vec2 v_texCoord;

// 统一变量
uniform sampler2D u_texture;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_saturation;
uniform vec3 u_colorTint;

// 输出颜色
out vec4 fragColor;

void main() {
  vec4 color = texture(u_texture, v_texCoord);
  
  // 对比度调整
  color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
  
  // 亮度调整
  color.rgb += u_brightness;
  
  // 饱和度调整
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, u_saturation);
  
  // 色调调整
  color.rgb *= u_colorTint;
  
  // 确保颜色在有效范围内
  color.rgb = clamp(color.rgb, 0.0, 1.0);
  
  fragColor = color;
}
`;

/**
 * 最终合成片段着色器
 */
export const finalCompositeFragmentShader = `#version 300 es
precision highp float;

// 从顶点着色器输入
in vec2 v_texCoord;

// 统一变量
uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_vignette;
uniform float u_filmGrain;

// 输出颜色
out vec4 fragColor;

// 随机数生成器
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec4 color = texture(u_texture, v_texCoord);
  
  // 添加暗角效果
  vec2 center = v_texCoord - 0.5;
  float vignetteFactor = 1.0 - dot(center, center) * u_vignette;
  color.rgb *= vignetteFactor;
  
  // 添加胶片颗粒效果
  if (u_filmGrain > 0.0) {
    float grain = random(v_texCoord + u_time) * 2.0 - 1.0;
    color.rgb += grain * u_filmGrain * 0.1;
  }
  
  // 添加微妙的色彩偏移（模拟老式显示器）
  vec2 offset = vec2(sin(u_time * 0.5) * 0.001, cos(u_time * 0.3) * 0.001);
  vec4 offsetColor = texture(u_texture, v_texCoord + offset);
  color.rgb = mix(color.rgb, offsetColor.rgb, 0.05);
  
  fragColor = color;
}
`;

/**
 * 全屏四边形顶点数据
 */
export const fullscreenQuadVertices = new Float32Array([
  -1.0, -1.0,
   1.0, -1.0,
  -1.0,  1.0,
   1.0,  1.0
]);

/**
 * 着色器程序配置
 */
export interface ShaderConfig {
  name: string;
  vertexShader: string;
  fragmentShader: string;
}

/**
 * 所有着色器程序配置
 */
export const shaderConfigs: ShaderConfig[] = [
  {
    name: 'particle',
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader
  },
  {
    name: 'blur',
    vertexShader: postProcessVertexShader,
    fragmentShader: blurFragmentShader
  },
  {
    name: 'bloom',
    vertexShader: postProcessVertexShader,
    fragmentShader: bloomFragmentShader
  },
  {
    name: 'colorCorrection',
    vertexShader: postProcessVertexShader,
    fragmentShader: colorCorrectionFragmentShader
  },
  {
    name: 'finalComposite',
    vertexShader: postProcessVertexShader,
    fragmentShader: finalCompositeFragmentShader
  }
];