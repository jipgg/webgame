#version 300 es

const int NONE = 0;
const int MUL = 1;
precision highp float;
in vec4 src_color;
uniform vec4 u_blendColor;
uniform int u_blendMode;
out vec4 dst_color;

void main() {
    switch (u_blendMode) {
        case MUL:
            dst_color = src_color * u_blendColor;
            break;
        default:
            dst_color = src_color;
            break;
    }
}
