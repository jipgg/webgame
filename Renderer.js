"use strict";
/** @returns{Promise<DrawApi>} */
export async function createApi(canvas) {
    let api = new DrawApi(canvas);
    await api._init();
    return api;
}

export class DrawApi {
    constructor(canvas) {
        /** @type{HTMLCanvasElement} */
        this._canvas = canvas;
        /** @type{WebGL2RenderingContext} */
        this._gl = canvas.getContext('webgl2');
    }
    async _init() {
        const gl = this._gl;
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
        this._program = gl;
        gl.useProgram(program);
        this.A_POSITION = 0;
        this.A_COLOR = 1;
        this.U_TRANSLATION = gl.getUniformLocation(program, "u_translation");
        this.U_ROTATION = gl.getUniformLocation(program, "u_rotation");
        this.U_SCALE = gl.getUniformLocation(program, "u_scale");
        this.U_CLIP_SIZE = gl.getUniformLocation(program, "u_clipSize");
        this.U_BLEND_COLOR = gl.getUniformLocation(program, 'u_blendColor');
        this.U_BLEND_MODE = gl.getUniformLocation(program, 'u_blendMode');

        let canvas = this._canvas;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(this.U_CLIP_SIZE, canvas.width, canvas.height);
        gl.uniform2f(this.U_SCALE, 1, 1);
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        this._vao = vao;
        this._positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 1024, gl.DYNAMIC_DRAW);
        this._indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        // Indices for a triangle (clockwise or counterclockwise order)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 1024, gl.DYNAMIC_DRAW);
        this._colorBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(this.A_POSITION);
        gl.vertexAttribPointer(this.A_POSITION, 2, gl.FLOAT, false, 0, 0);
    }
    setScale(x, y) {
        this._gl.uniform2f(this.U_SCALE, x, y);
    }
    setDrawColor(r, g, b, a) {
        const gl = this._gl;
        gl.vertexAttrib4f(this.A_COLOR, r, g, b, a | 1);
        this._gl
    }
    setTranslation(x, y) {
        const gl = this._gl;
        gl.uniform2f(this.U_TRANSLATION, x, y);
    }
    setRotation(r) {
        this._gl.uniform1f(this.U_ROTATION, r);
    }
    fillTriangle(x1, y1, x2, y2, x3, y3) {
        const gl = this._gl;
        const data = new Float32Array([x1, y1, x2, y2, x3, y3]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    bindPosBuf() {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    }
    drawLine(x1, y1, x2, y2) {
        const gl = this._gl;
        this.bindPosBuf();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([x1, y1, x2, y2]));
        gl.drawArrays(gl.LINES, 0, 2);
    }
    drawTriangle(x1, y1, x2, y2, x3, y3) {
        const gl = this._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        const data = new Float32Array([x1, y1, x2, y2, x3, y3]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        const indices = new Uint16Array([0, 1, 1, 2, 2, 0]);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices)
        //gl.drawArrays(gl.LINES, 0, 6);
        gl.drawElements(gl.LINES, 6, gl.UNSIGNED_SHORT, 0);
        //gl.disableVertexAttribArray(this.A_POSITION);
    }
    clear() {
        const gl = this._gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}
export class Col4 {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
export class V2 {
    constructor(x = 0, y = 0) {
        /** @type{number} */
        this.x = x;
        /** @type{number} */
        this.y = y;
    }
    add(o) {return new V2(this.x + o.x, this.y + o.y);}
    sub(o) {return new V2(this.x - o.x, this.y - o.y);}
    mul(s) {return new V2(this.x * s, this.y * s);}
    div(s) {return new V2(this.x / s, this.y / s);}
    dot(o) {return this.x * o.x + this.y * o.y;}
    norm2() {return this.x * this.x + this.y * this.y;}
    norm() {return Math.sqrt(this.norm2());}
}

