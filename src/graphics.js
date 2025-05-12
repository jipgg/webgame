"use strict";
import * as cm from './common.js';
export class DrawRenderer {
    constructor(canvas) {
        /** @type{HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type{WebGL2RenderingContext} */
        this.gl = canvas.getContext('webgl2');
        this.#init();
    }
    #init() {
        const gl = this.gl;
        function create_shader(type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
            } else return shader;
        }
        const dir = './shaders';
        let verShader = create_shader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        let fragShader = create_shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        let program = gl.createProgram();
        gl.attachShader(program, verShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }
        /** @type{WebGLProgram} */
        this.program = program;
        gl.useProgram(program);
        this.A_POS = gl.getAttribLocation(program, "position");
        this.A_COL = gl.getAttribLocation(program, "color");
        this.U_TRANS = gl.getUniformLocation(program, "translation");
        this.U_ROT = gl.getUniformLocation(program, "rotation");
        this.U_SCAL = gl.getUniformLocation(program, "scale");
        this.U_CANVAS_SIZE = gl.getUniformLocation(program, "canvas_size");
        this.U_COLOR_MOD = gl.getUniformLocation(program, 'color_mod');
        this.U_BLEND_MODE = gl.getUniformLocation(program, 'blend_mode');

        let canvas = this.canvas;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(this.U_CANVAS_SIZE, canvas.width, canvas.height);
        gl.uniform2f(this.U_SCAL, 1, 1);
        gl.uniform4f(this.U_COLOR_MOD, 1, 1, 1, 1);
        let draw_vao = gl.createVertexArray();
        gl.bindVertexArray(draw_vao);
        this.draw_vao = draw_vao;
        this.position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, 1024, gl.DYNAMIC_DRAW);
        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 1024, gl.DYNAMIC_DRAW);
        this.color_buffer = gl.createBuffer();

        gl.enableVertexAttribArray(this.A_POS);
        gl.vertexAttribPointer(this.A_POS, 2, gl.FLOAT, false, 0, 0);
    }
    get_uniform(uniform) {
        return this.gl.getUniform(this.program, uniform);
    }
    /** @param {(v: number[]) => number[]} transformer */ 
    transform_scale(transformer) {
        const v = transformer(this.get_uniform(this.U_SCAL));
        this.scale = v;
        //return this.set_scale(v[0], v[1]);
        return this;
    }
    /** @returns{ArrayLike<number>} */
    get scale() {
        return this.get_uniform(this.U_SCAL);
    }
    set scale(v) {
        this.gl.uniform2f(this.U_SCAL, v[0] ?? 0, v[1] ?? 0);
        return this;
    }
    /** @param {(old: number) => number} transformer */ 
    transform_rotation(transformer) {
        this.rotation = transformer(this.get_uniform(this.U_ROT));
        return this;
    } 
    /** @returns{number} */
    get blend_mode() {
        return this.get_uniform(this.U_BLEND_MODE);
    }
    set blend_mode(v) {
        this.gl.uniform1i(this.U_BLEND_MODE, v);
        return this;
    }
    get rotation() {
        return this.get_uniform(this.U_ROT);
    }
    /** @param{number}v */
    set rotation(v) {
        this.gl.uniform1f(this.U_ROT, v ?? 0);
    }
    /** @param{ArrayLike<number>} v */
    set color(v) {
        const gl = this.gl;
        gl.vertexAttrib4f(this.A_COL, v[0] ?? 0, v[1] ?? 0, v[2] ?? 0, v[3] ?? 1);
    }
    /** @param{ArrayLike<number>} v */
    set blend_color(v) {
        const gl = this.gl;
        gl.uniform4f(this.U_COLOR_MOD, v[0] ?? 0, v[1] ?? 0, v[2] ?? 0, v[3] ?? 1);
    }
    /** @param{ArrayLike<number>} v */
    set translation(v) {
        this.gl.uniform2f(this.U_TRANS, v[0] ?? 0, v[1] ?? 0);
    }
    rotate(r) {
        return this.transform_rotation(e => e + r);
    }
    rotate_degrees(r) {
        return this.transform_rotation(e => e + (r / 180 * Math.PI));
    }
    scale(x, y) {
        return this.transform_scale(e => {
            e[0] += x;
            e[1] += y;
            return e;
        });
    }
    translate(x, y) {
        return this.transform_translation(e => {
            e[0] += x;
            e[1] += y;
            return e;
        });
    }
    /** @param {(before: number[]) => number[]} transformer */ 
    transform_translation(transformer) {
        const v = transformer(this.get_uniform(this.U_TRANS));
        this.translation = v;
        return this;
    }
    reset_transform(x = 0, y = 0, r = 0, sx = 1, sy = 1) {
        this.translation = [x , y];
        this.scale = [sx, sy];
        this.rotation = r;
        return this;
    }
    fill_triangle(x1, y1, x2, y2, x3, y3) {
        const gl = this.gl;
        const data = new Float32Array([x1, y1, x2, y2, x3, y3]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return this;
    }
    /** @param{Float32Array?} floats @param{number?} offset */
    bind_position_data(floats, offset) {
        const gl = this.gl;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.position_buffer);
        if (floats) gl.bufferSubData(gl.ARRAY_BUFFER, offset ?? 0, floats);
    }
    /** @param{Uint16Array?} ui16s @param{number?} offset */
    bind_index_data(ui16s, offset) {
        const gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        if (ui16s) gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset ?? 0, ui16s);
    }
    draw_line(x1, y1, x2, y2) {
        const gl = this.gl;
        this.bind_position_data(new Float32Array([x1, y1, x2, y2]));
        gl.drawArrays(gl.LINES, 0, 2);
        return this;
    }
    /** @param{Float32Array}arr */
    draw_lines(arr) {
        const gl = this.gl;
        this.bind_position_data(arr);
        gl.drawArrays(gl.LINES, 0, arr.length / 2);
        return this;
    }
    /** @param{Float32Array}arr */
    draw_polygon(arr) {
        const gl = this.gl;
        const size = arr.length;
        this.bind_position_data(arr);
        let indices = new Uint16Array(size * 2);
        for (let i = 0; i < size; ++i) {
            const j = i * 2;
            indices[j] = i;
            indices[j + 1] = (i + 1) % size;
        }
        this.bind_index_data(indices);
        gl.drawElements(gl.LINES, size * 2, gl.UNSIGNED_SHORT, 0);
        return this;
    }
    fill_rect(x, y, w, h) {
        this.bind_position_data(rect_to_points(x, y, w, h));
        this.bind_index_data(FILL_RECT_INDICES);
        const gl = this.gl;
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        return this;
    }
    draw_rect(x, y, w, h) {
        this.bind_position_data(rect_to_points(x, y, w, h))
        this.bind_index_data(DRAW_RECT_INDICES);
        const gl = this.gl;
        gl.drawElements(gl.LINES, 8, gl.UNSIGNED_SHORT, 0);
        return this;
    }
    draw_triangle(x1, y1, x2, y2, x3, y3) {
        const gl = this.gl;
        const positions = new Float32Array([x1, y1, x2, y2, x3, y3]);
        this.bind_position_data(positions);
        //gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
        const indices = new Uint16Array([0, 1, 1, 2, 2, 0]);
        this.bind_index_data(indices);
        gl.drawElements(gl.LINES, 6, gl.UNSIGNED_SHORT, 0);
        return this;
    }
    reset() {
        return this.clear().reset_transform();
    }
    clear(r = 0, g = 0, b = 0, a = 0) {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return this;
    }
}
const FILL_RECT_INDICES = new Uint16Array([0, 1, 2, 3, 1, 2]);
const DRAW_RECT_INDICES = new Uint16Array([0, 1, 1, 3, 3, 2, 2, 0]);
export const rect_to_points = (x, y, w, h) => new Float32Array([
    x, y,
    x + w, y,
    x, y + h,
    x + w, y + h,
]);

const VERTEX_SHADER_SOURCE =
    `#version 300 es
    precision highp float;
    layout(location = 0) in vec2 position;
    layout(location = 1) in vec4 color;
    uniform vec2 translation;
    uniform vec2 scale;
    uniform float rotation;
    uniform vec2 canvas_size;
    out vec4 src_color;
    void main() {
        float cos_r = cos(rotation);
        float sin_r = sin(rotation);
        mat3 transform = mat3(
            scale.x * cos_r, scale.x * sin_r, 0.0,
            -scale.y * sin_r, scale.y * cos_r, 0.0,
            translation.x, translation.y, 1.0
        );
        vec3 transformed = transform * vec3(position, 1.0);
        vec2 canvas_space = (transformed.xy / canvas_size) * 2.0 - 1.0;
        gl_Position = vec4(canvas_space, 0.0, 1.0);
        src_color = color;
    }
`;

const FRAGMENT_SHADER_SOURCE =
    `#version 300 es
    precision highp float;

    const int BLEND_MULTIPLY = 0;
    const int BLEND_NONE = 1;
    const int BLEND_DESATURATE = 2;
    const int BLEND_SCREEN = 3;
    const int BLEND_ADD = 4;
    const int BLEND_ALPHA = 5;
    in vec4 src_color;
    uniform vec4 color_mod;
    uniform int blend_mode;
    out vec4 dst_color;

    void main() {
        switch (blend_mode) {
            case BLEND_MULTIPLY:
                dst_color.rgb = src_color.rgb * color_mod.rgb;
                dst_color.a = src_color.a;
                break;
            case BLEND_DESATURATE:
                float luminance = dot(src_color.rgb, vec3(0.299, 0.587, 0.114));
                vec3 gray = vec3(luminance);
                float desaturation = color_mod.a;
                dst_color.rgb = mix(src_color.rgb, gray, desaturation);
                dst_color.a = src_color.a;
                break;
            case BLEND_SCREEN:
                dst_color = 1.0 - (1.0 - src_color) * (1.0 - color_mod);
                break;
            case BLEND_ADD:
                dst_color.rgb = src_color.rgb + color_mod.rgb;
                dst_color.a = src_color.a;
                break;
            case BLEND_ALPHA:
                float src_a = src_color.a;
                float inv_a = 1.0 - src_a;
                dst_color.rgb = src_color.rgb * src_a + color_mod.rgb * inv_a;
                dst_color.a = src_a + color_mod.a * inv_a;
                break;
            default:
                dst_color = src_color;
                break;
        }
    }
`;
export const BlendMode = {
    MULTIPLY: 0,
    NONE: 1,
    DESATURATE: 2,
    SCREEN: 3,
    ADD: 4,
    ALPHA_BLEND: 5,
}
