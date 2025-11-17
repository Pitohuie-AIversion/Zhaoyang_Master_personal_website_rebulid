#version 300 es

// 顶点着色器 - 粒子系统
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
uniform float u_noiseScale;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_mouseInfluence;

// 输出到片段着色器
out vec3 v_color;
out float v_life;
out vec2 v_uv;

// Perlin Noise 函数
vec3 permute(vec3 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    // 计算噪声偏移
    vec2 noisePos = a_position * u_noiseScale + u_time * 0.1;
    float noise = snoise(noisePos);
    
    // 应用噪声到位置
    vec2 noiseOffset = vec2(
        snoise(noisePos + vec2(100.0, 0.0)),
        snoise(noisePos + vec2(0.0, 100.0))
    ) * 0.5;
    
    // 鼠标交互影响
    vec2 mouseDir = a_position - u_mouse;
    float mouseDist = length(mouseDir);
    float mouseEffect = exp(-mouseDist * 0.001) * u_mouseInfluence;
    vec2 mouseForce = normalize(mouseDir) * mouseEffect * 50.0;
    
    // 最终位置计算
    vec2 finalPosition = a_position + noiseOffset + mouseForce;
    
    // 转换到屏幕坐标
    vec4 position = u_projection * u_view * vec4(finalPosition, 0.0, 1.0);
    gl_Position = position;
    
    // 粒子大小（基于生命值和距离）
    float sizeMultiplier = a_life * (1.0 + mouseEffect * 0.5);
    gl_PointSize = a_size * sizeMultiplier * (u_resolution.y / 800.0);
    
    // 传递给片段着色器
    v_color = a_color;
    v_life = a_life;
    v_uv = a_position / u_resolution;
}