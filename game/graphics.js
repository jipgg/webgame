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
        /** @type{Array<cm.Mat3>} */
        this.matrix_stack = [];
        function create_shader(type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
            } else return shader;
        }
        let ver_shader = create_shader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        let frag_shader = create_shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        let program = gl.createProgram();
        gl.attachShader(program, ver_shader);
        gl.attachShader(program, frag_shader);
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
        this.U_TRANSFORM = gl.getUniformLocation(program, "transformation");
        this.U_RESOLUTION = gl.getUniformLocation(program, "resolution");
        this.U_BLEND_COLOR = gl.getUniformLocation(program, 'blend_color');
        this.U_BLEND_MODE = gl.getUniformLocation(program, 'blend_mode');

        let canvas = this.canvas;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(this.U_RESOLUTION, canvas.width, canvas.height);
        gl.uniformMatrix3fv(this.U_TRANSFORM, true, cm.Mat3.identity.data);
        gl.uniform4f(this.U_BLEND_COLOR, 1, 1, 1, 1);
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
    cache_transform() {
        let trs = cm.Mat3.identity;
        for (let m of this.matrix_stack) trs = trs.multiply(m);
        this.gl.uniformMatrix3fv(this.U_TRANSFORM, true, trs.data);
        return trs;
    }
    /** @param{cm.Mat3} */
    push_matrix(mat) {
        this.matrix_stack.push(mat);
        this.cache_transform();
        return this;
    }
    pop_matrix() {
        if (this.matrix_stack.length != 0) {
            this.matrix_stack.pop();
        }
        this.cache_transform();
        return this;
    } 
    push_rotation(r) {
        this.push_matrix(cm.Mat3.from_rotation(r));
        return this;
    }
    push_translation(x, y) {
        this.push_matrix(cm.Mat3.from_translation(x, y));
        return this;
    }
    push_scalar(sx, sy) {
        this.push_matrix(cm.Mat3.from_scale(sx, sy));
        return this
    }
    push_transform(x, y, r, sx, sy) {
        this.push_matrix(cm.Mat3.from_transform(x, y, r, sx, sy));
    }
    set_color(r=0, g=0, b=0, a=1) {
        const gl = this.gl;
        gl.vertexAttrib4f(this.A_COL, r, g, b, a);
        return this;
    }
    /** @returns{number} */
    get blend_mode() {
        return this.gl.getUniform(this.U_BLEND_MODE);
    }
    set blend_mode(v) {
        this.gl.uniform1i(this.U_BLEND_MODE, v);
        return this;
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
    /** @param {ArrayLike<number>} arr */
    fill_rects(arr) {
        const gl = this.gl;
        const vertex_width = 2;
        const float_bytesize = 4;
        const floats_per_vertex = 4 * vertex_width;
        let pos_offset = 0;
        let idx_offset = 0;
        let ver_offset = 0;
        for (let i = 0; i < arr.length; i += 4) {
            const positions = rect_to_points(arr[i], arr[i + 1], arr[i + 2], arr[i + 3]);
            this.bind_position_data(
                new Float32Array(positions),
                pos_offset * float_bytesize
            );
            const indices = new Uint16Array([
                ver_offset, ver_offset + 1, ver_offset + 2,
                ver_offset + 2, ver_offset + 1, ver_offset + 3,
            ]);
            this.bind_index_data(indices, idx_offset * 2);
            pos_offset += floats_per_vertex;
            idx_offset += 6;
            ver_offset += 4;
        }
        gl.drawElements(gl.TRIANGLES, idx_offset, gl.UNSIGNED_SHORT, 0);
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
    reset_transform() {
        this.matrix_stack.length = 0;
        return this;
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
    uniform mat3 transformation;
    uniform vec2 resolution;
    out vec4 src_color;
    void main() {
        vec3 transformed = transformation * vec3(position, 1.0);
        vec2 canvas_space = (transformed.xy / resolution) * 2.0 - 1.0;
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
    uniform vec4 blend_color;
    uniform int blend_mode;
    out vec4 dst_color;

    void main() {
        switch (blend_mode) {
            case BLEND_MULTIPLY:
                dst_color.rgb = src_color.rgb * blend_color.rgb;
                dst_color.a = src_color.a;
                break;
            case BLEND_DESATURATE:
                float luminance = dot(src_color.rgb, vec3(0.299, 0.587, 0.114));
                vec3 gray = vec3(luminance);
                float desaturation = blend_color.a;
                dst_color.rgb = mix(src_color.rgb, gray, desaturation);
                dst_color.a = src_color.a;
                break;
            case BLEND_SCREEN:
                dst_color = 1.0 - (1.0 - src_color) * (1.0 - blend_color);
                break;
            case BLEND_ADD:
                dst_color.rgb = src_color.rgb + blend_color.rgb;
                dst_color.a = src_color.a;
                break;
            case BLEND_ALPHA:
                float src_a = src_color.a;
                float inv_a = 1.0 - src_a;
                dst_color.rgb = src_color.rgb * src_a + blend_color.rgb * inv_a;
                dst_color.a = src_a + blend_color.a * inv_a;
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
