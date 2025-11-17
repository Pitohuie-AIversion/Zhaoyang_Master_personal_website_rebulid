#version 300 es

// 后处理片段着色器
precision highp float;

// 从顶点着色器接收
in vec2 v_texCoord;

// 统一变量
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_blurAmount;
uniform float u_bloomIntensity;
uniform float u_contrast;
uniform bool u_bloomEnabled;

// 输出颜色
out vec4 fragColor;

// 高斯模糊
vec4 blur(sampler2D tex, vec2 uv, vec2 resolution, float amount) {
    vec4 color = vec4(0.0);
    vec2 texelSize = 1.0 / resolution;
    
    // 9点采样高斯模糊
    float weights[9];
    weights[0] = 0.0625; weights[1] = 0.125; weights[2] = 0.0625;
    weights[3] = 0.125;  weights[4] = 0.25;  weights[5] = 0.125;
    weights[6] = 0.0625; weights[7] = 0.125; weights[8] = 0.0625;
    
    int index = 0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 offset = vec2(float(x), float(y)) * texelSize * amount;
            color += texture(tex, uv + offset) * weights[index];
            index++;
        }
    }
    
    return color;
}

// Bloom 效果
vec4 bloom(sampler2D tex, vec2 uv, vec2 resolution, float intensity) {
    vec4 original = texture(tex, uv);
    
    // 提取亮部
    vec4 bright = max(original - 0.8, 0.0) * 2.0;
    
    // 多层模糊
    vec4 blur1 = blur(tex, uv, resolution, 2.0);
    vec4 blur2 = blur(tex, uv, resolution, 4.0);
    vec4 blur3 = blur(tex, uv, resolution, 8.0);
    
    // 合成 Bloom
    vec4 bloomColor = (blur1 + blur2 + blur3) * 0.33 * intensity;
    
    return original + bloomColor * bright;
}

// 色调映射
vec3 toneMapping(vec3 color) {
    // ACES 色调映射
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    
    return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
}

// 颜色校正
vec3 colorCorrection(vec3 color, float contrast) {
    // 对比度调整
    color = (color - 0.5) * contrast + 0.5;
    
    // 饱和度增强
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luminance), color, 1.1);
    
    // 轻微的色温调整（偏冷色调）
    color.rgb *= vec3(0.95, 1.0, 1.05);
    
    return clamp(color, 0.0, 1.0);
}

// 添加噪点（增加质感）
float noise(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec4 color;
    
    // 基础纹理采样
    if (u_bloomEnabled) {
        color = bloom(u_texture, uv, u_resolution, u_bloomIntensity);
    } else {
        color = texture(u_texture, uv);
    }
    
    // 应用模糊
    if (u_blurAmount > 0.0) {
        vec4 blurred = blur(u_texture, uv, u_resolution, u_blurAmount);
        color = mix(color, blurred, 0.3);
    }
    
    // 色彩校正
    color.rgb = colorCorrection(color.rgb, u_contrast);
    
    // 色调映射
    color.rgb = toneMapping(color.rgb);
    
    // 添加轻微噪点
    float noiseValue = noise(uv + u_time * 0.1) * 0.02;
    color.rgb += noiseValue;
    
    // 暗角效果
    vec2 center = uv - 0.5;
    float vignette = 1.0 - dot(center, center) * 0.3;
    color.rgb *= vignette;
    
    fragColor = color;
}