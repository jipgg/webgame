#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec4 a_color;
//uniform mat3 u_transform;
uniform vec2 u_translation;
uniform vec2 u_scale;
uniform float u_rotation;
uniform vec2 u_clipSize;
out vec4 src_color;

void main() {
    float cosTheta = cos(u_rotation);
    float sinTheta = sin(u_rotation);
    mat3 transform = mat3(
        u_scale.x * cosTheta, u_scale.x * sinTheta, 0.0,
        -u_scale.y * sinTheta, u_scale.y * cosTheta, 0.0,
        u_translation.x, u_translation.y, 1.0
    );
    vec3 transformed = transform * vec3(a_position, 1.0);
    vec2 clipped = (transformed.xy / u_clipSize) * 2.0 - 1.0;
    gl_Position = vec4(clipped, 0.0, 1.0);
    src_color = a_color;
}
