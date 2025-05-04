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
let aColor;
let uCanvas;
let uBlendMode;
/** @type{WebGLBuffer} **/
let positionBuffer;
let colorBuffer;
/** @type{WebGLVertexArrayObject} **/
let vao;

await init();
let quad = [
  0, 0,
  0, 100,
  100, 0,
  100, 100,
  100, 0,
  0, 100,
];
let triangle = [
  0, 0,
  0, 100,
  100, 0,
]
let color = [
    1, .5, 1, .4,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
]
gl.viewport(0, 0, canvas.width, canvas.height);
gl.uniform2f(uCanvas, canvas.width, canvas.height);
gl.uniform2f(uScale, 1, 1);

vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const POS = 0;
const COL = 1;
let buffer = gl.createBuffer();
positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(POS);
gl.vertexAttribPointer(POS, 2, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW);

colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.uniform4f(uColor, 1, 1, 1, 1);
gl.uniform2f(uTranslation, 100, 100);
gl.drawArrays(gl.TRIANGLES, 0, 6);

gl.uniform2f(uTranslation, 300, 300);
gl.uniform1f(uRotation, Math.PI / 0.3);
gl.uniform2f(uScale, 4, 4);
gl.uniform4f(uColor, 1, 0.5, 0, 1);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW);

gl.uniform1i(uBlendMode, 0);
gl.disableVertexAttribArray(COL);
gl.vertexAttrib4f(COL, 1, 0, 1, 1);

gl.drawArrays(gl.TRIANGLES, 0, 3);
gl.bindVertexArray(null);

async function init() {
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
    program = gl.createProgram();
    gl.attachShader(program, verShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
    gl.useProgram(program);
    aPosition = gl.getAttribLocation(program, "a_position");
    uTranslation = gl.getUniformLocation(program, "u_translation");
    uRotation = gl.getUniformLocation(program, "u_rotation");
    uScale = gl.getUniformLocation(program, "u_scale");
    uCanvas = gl.getUniformLocation(program, "u_clipSize");
    uColor = gl.getUniformLocation(program, 'u_blendColor');
    uBlendMode = gl.getUniformLocation(program, 'u_blendMode');
    aColor = gl.getAttribLocation(program, 'a_color');
}
async function fetchText(url) {
    return fetch(url)
        .then(r => r.ok ? r.text() : null)
        .catch(() => null);
}

