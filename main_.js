"use strict";
import * as drawing from './Renderer.js';
const V2 = drawing.V2;
const api = await drawing.createApi(document.getElementById("main_canvas"));
const gl = api._gl;
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

function render() {
    api.setDrawColor(1, 0, 0);
    api.drawLine(0, 0, 1000, 1000);
    api.setDrawColor(1, 1, 0);
    api.setTranslation(100, 100)
    api.setRotation(30);
    api.fillTriangle(0, 0, 0, 100, 100, 0);
}
render();

// gl.viewport(0, 0, canvas.width, canvas.height);
// gl.uniform2f(api.U_CLIP_SIZE, canvas.width, canvas.height);
// gl.uniform2f(uScale, 1, 1);

// let vao = gl.createVertexArray();
// gl.bindVertexArray(vao);

// const POS = 0;
// const COL = 1;
// let positionBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.enableVertexAttribArray(POS);
// gl.vertexAttribPointer(POS, 2, gl.FLOAT, false, 0, 0);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW);
//
// let colorBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.enableVertexAttribArray(api.A_COLOR);
// gl.vertexAttribPointer(api.A_COLOR, 4, gl.FLOAT, false, 0, 0)
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
//
// gl.clear(gl.COLOR_BUFFER_BIT);
// gl.uniform4f(uColor, 1, 1, 1, 1);
// gl.uniform2f(uTranslation, 100, 100);
// gl.drawArrays(gl.TRIANGLES, 0, 6);
//
// gl.uniform2f(uTranslation, 300, 300);
// gl.uniform1f(uRotation, Math.PI / 0.3);
// gl.uniform2f(uScale, 4, 4);
// gl.uniform4f(uColor, 1, 0.5, 0, 1);
//
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW);
//
// gl.uniform1i(uBlendMode, 0);
// gl.disableVertexAttribArray(COL);
// gl.vertexAttrib4f(COL, 1, 0, 1, 1);
//
// gl.drawArrays(gl.TRIANGLES, 0, 3);
// gl.bindVertexArray(null);
