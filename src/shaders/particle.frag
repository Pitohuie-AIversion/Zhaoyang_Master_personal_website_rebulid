#version 300 es

// 片段着色器 - 粒子系统
precision highp float;

// 从顶点着色器接收
in vec3 v_color;
in float v_life;
in vec2 v_uv;

// 统一变量
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_opacity;
uniform bool u_bloomEnabled;
uniform float u_contrast;

// 输出颜色
out vec4 fragColor;

// 生成圆形粒子
float circle(vec2 coord, float radius) {
    vec2 center = vec2(0.5);
    float dist = distance(coord, center);
    return 1.0 - smoothstep(radius - 0.1, radius, dist);
}

// 发光效果
float glow(vec2 coord, float radius, float intensity) {
    vec2 center = vec2(0.5);
    float dist = distance(coord, center);
    return intensity / (1.0 + dist * dist * 100.0);
}

// 色彩增强
vec3 enhanceColor(vec3 color, float contrast) {
    // 应用对比度
    color = (color - 0.5) * contrast + 0.5;
    
    // 饱和度增强
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luminance), color, 1.2);
    
    return clamp(color, 0.0, 1.0);
}

void main() {
    // 计算粒子坐标（0-1范围）
    vec2 coord = gl_PointCoord;
    
    // 基础圆形形状
    float alpha = circle(coord, 0.5);
    
    // 生命值影响透明度
    alpha *= v_life;
    
    // 发光效果
    if (u_bloomEnabled) {
        float glowEffect = glow(coord, 0.3, 0.8);
        alpha += glowEffect * 0.3;
    }
    
    // 颜色处理
    vec3 finalColor = v_color;
    
    // 应用色彩增强
    finalColor = enhanceColor(finalColor, u_contrast);
    
    // 时间相关的闪烁效果
    float flicker = 0.9 + 0.1 * sin(u_time * 2.0 + v_uv.x * 10.0);
    finalColor *= flicker;
    
    // 边缘柔化
    float edgeSoftness = smoothstep(0.0, 0.1, alpha) * smoothstep(1.0, 0.9, alpha);
    alpha *= edgeSoftness;
    
    // 最终透明度
    alpha *= u_opacity;
    
    // 输出最终颜色
    fragColor = vec4(finalColor, alpha);
    
    // 丢弃完全透明的像素
    if (fragColor.a < 0.01) {
        discard;
    }
}