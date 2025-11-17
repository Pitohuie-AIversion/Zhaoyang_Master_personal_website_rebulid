#version 300 es

// 后处理顶点着色器
precision highp float;

// 顶点属性
in vec2 a_position;
in vec2 a_texCoord;

// 输出到片段着色器
out vec2 v_texCoord;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
}