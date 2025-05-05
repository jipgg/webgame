"use strict";
/** @returns{Promise<Renderer>} */
export async function create_renderer(canvas) {
    let api = new Renderer(canvas);
    await api.init();
    return api;
}

export class Renderer {
    constructor(canvas) {
        /** @type{HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type{WebGL2RenderingContext} */
        this.gl = canvas.getContext('webgl2');
    }
    async init() {
        const gl = this.gl;
        function createShader(type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
            } else return shader;
        }
        const dir = './shaders';
        const verShaderSrc = await fetch(`${dir}/vertex.glsl`).then(r => r.text());
        const fragShaderSrc = await fetch(`${dir}/fragment.glsl`).then(r => r.text());
        let verShader = createShader(gl.VERTEX_SHADER, verShaderSrc);
        let fragShader = createShader(gl.FRAGMENT_SHADER, fragShaderSrc);
        let program = gl.createProgram();
        gl.attachShader(program, verShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }
        /** @type{WebGLProgram} */
        this.program = gl;
        gl.useProgram(program);
        this.A_POSITION = 0;
        this.A_COLOR = 1;
        this.U_TRANSLATION = gl.getUniformLocation(program, "u_translation");
        this.U_ROTATION = gl.getUniformLocation(program, "u_rotation");
        this.U_SCALE = gl.getUniformLocation(program, "u_scale");
        this.U_CLIP_SIZE = gl.getUniformLocation(program, "u_clipSize");
        this.U_BLEND_COLOR = gl.getUniformLocation(program, 'u_blendColor');
        this.U_BLEND_MODE = gl.getUniformLocation(program, 'u_blendMode');

        let canvas = this.canvas;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(this.U_CLIP_SIZE, canvas.width, canvas.height);
        gl.uniform2f(this.U_SCALE, 1, 1);
        let draw_vao = gl.createVertexArray();
        gl.bindVertexArray(draw_vao);
        this.draw_vao = draw_vao;
        this.position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, 1024, gl.DYNAMIC_DRAW);
        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        // Indices for a triangle (clockwise or counterclockwise order)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 1024, gl.DYNAMIC_DRAW);
        this.color_buffer = gl.createBuffer();

        gl.enableVertexAttribArray(this.A_POSITION);
        gl.vertexAttribPointer(this.A_POSITION, 2, gl.FLOAT, false, 0, 0);
    }
    set_scale(sx, sy) {
        this.gl.uniform2f(this.U_SCALE, sx, sy ?? sx);
    }
    /** @param{number}v */
    set_rotation(r) {
        this.gl.uniform1f(this.U_ROTATION, r);
    }
    set_color(r, g, b, a) {
        const gl = this.gl;
        gl.vertexAttrib4f(this.A_COLOR, r, g, b, a ?? 1);
        this.gl
    }
    set_translation(x, y) {
        this.gl.uniform2f(this.U_TRANSLATION, x, y);
    }
    reset_transform() {
        this.set_translation(0, 0);
        this.set_scale(1, 1);
        this.set_rotation(0);
    }
    set_transform(x, y, r, sx, sy) {
        this.set_translation(x, y);
        this.set_rotation(r);
        this.set_scale(sx, sy);
    }
    fill_triangle(x1, y1, x2, y2, x3, y3) {
        const gl = this.gl;
        const data = new Float32Array([x1, y1, x2, y2, x3, y3]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
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
    }
    /** @param{Float32Array}arr */
    draw_lines(arr) {
        const gl = this.gl;
        this.bind_position_data(arr);
        gl.drawArrays(gl.LINES, 0, arr.length / 2);
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
        //gl.drawArrays(gl.LINES, 0, arr.length / 2);
    }
    fill_rect(x, y, w, h) {
        this.bind_position_data(rect_to_points(x, y, w, h));
        this.bind_index_data(FILL_RECT_INDICES);
        const gl = this.gl;
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
    draw_rect(x, y, w, h) {
        this.bind_position_data(rect_to_points(x, y, w, h))
        this.bind_index_data(DRAW_RECT_INDICES);
        const gl = this.gl;
        gl.drawElements(gl.LINES, 8, gl.UNSIGNED_SHORT, 0);
    }
    draw_triangle(x1, y1, x2, y2, x3, y3) {
        const gl = this.gl;
        const positions = new Float32Array([x1, y1, x2, y2, x3, y3]);
        this.bind_position_data(positions);
        //gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
        const indices = new Uint16Array([0, 1, 1, 2, 2, 0]);
        this.bind_index_data(indices);
        gl.drawElements(gl.LINES, 6, gl.UNSIGNED_SHORT, 0);
    }
    clear(r, g, b, a) {
        const gl = this.gl;
        gl.clearColor(r ?? 0, g ?? 0, b ?? 0, a ?? 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
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
