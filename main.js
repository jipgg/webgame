"use strict";
/** @type{HTMLCanvasElement} **/
const canvas = document.getElementById("main_canvas");
/** @type{WebGL2RenderingContext} **/
const gl = canvas.getContext('webgl2');
/** @type{WebGLProgram} */
let program;

let aPosition;
let uScale;
let uTranslation;
let uRotation;
let uColor;
let uSize;
/** @type{WebGLBuffer} **/
let buffer;
/** @type{WebGLVertexArrayObject} **/
let vao;

const dir = './shaders';
await init(`${dir}/vertex.glsl`, `${dir}/fragment.glsl`);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.uniform2f(uSize, canvas.width, canvas.height);
let positions = [
  0, 0,
  0, 100,
  100, 0,
  100, 100,
  100, 0,
  0, 100,
];
var transform = [
    1, 0, 100,
    0, 1, 100,
    0, 0, 1,
];
gl.uniform4f(uColor, 0.1, 1, 1, 1);
gl.uniform2f(uScale, 1, 1);
gl.uniform2f(uTranslation, 100, 100);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.drawArrays(gl.TRIANGLES, 0, 6);

async function init(verShaderUrl, fragShaderUrl) {
    function createShader(type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        } else return shader;
    }
    const verShaderSrc = await fetch(verShaderUrl).then(r => r.text());
    const fragShaderSrc = await fetch(fragShaderUrl).then(r => r.text());
    let verShader = createShader(gl.VERTEX_SHADER, verShaderSrc);
    let fragShader = createShader(gl.FRAGMENT_SHADER, fragShaderSrc);
    program = gl.createProgram();
    gl.attachShader(program, verShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
    aPosition = gl.getAttribLocation(program, "a_position");
    uTranslation = gl.getUniformLocation(program, "u_translation");
    uRotation = gl.getUniformLocation(program, "u_rotation");
    uScale = gl.getUniformLocation(program, "u_scale");
    uSize = gl.getUniformLocation(program, "u_canvas");
    uColor = gl.getUniformLocation(program, 'u_color');
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
}
async function fetchText(url) {
    return fetch(url)
        .then(r => r.ok ? r.text() : null)
        .catch(() => null);
}

class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(o) {
        return new V2(this.x + o.x, this.y + o.y);
    }
    sub(o) {
        return new V2(this.x - o.x, this.y - o.y);
    }
    mul(s) {
        return new V2(this.x * s, this.y * s);
    }
    div(s) {
        return new V2(this.x / s, this.y / s);
    }
    dot(o) {
        return this.x * o.x + this.y * o.y;
    }
    norm2() {
        return this.x * this.x + this.y * this.y;
    }
    norm() {
        return Math.sqrt(this.norm2());
    }
}

