"use strict";
/** @type{HTMLCanvasElement} */
const Canvas = undefined;
/** @type{WebGL2RenderingContext} */
const Gl = undefined;
/** @type{WebGLProgram} */
const Program = undefined;
const VERTEX_SHADER_SOURCE = `#version 300 es
    precision highp float;
    in vec2 a_position;
    uniform mat3 u_transform;
    void main() {
        vec3 transformed = u_transform * vec3(a_position, 1.0);
        gl_Position = vec4(transformed.xy, 0.0, 1.0);
    }
`;
const FRAGMENT_SHADER_SOURCE = `#version 300 es
    precision highp float;

    uniform vec4 u_color;
    

    void main() {
        gl_FragColor = u_color;
    }
`;
function create_shader(type, source) {
    let shader = Gl.createShader(type);
    Gl.shaderSource(shader, source);
    Gl.compileShader(shader);
    if (!Gl.getShaderParameter(shader, Gl.COMPILE_STATUS)) {
        console.log(Gl.getShaderInfoLog(shader));
        Gl.deleteShader(shader);
    } else return shader;
}
export function setup(canvas_elem) {
    Canvas = canvas_elem;
    Gl = Canvas.getContext('webgl2');
    let vertex_shader = create_shader(Gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    let fragment_shader = create_shader(Gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    let program = Gl.createProgram();
    Gl.attachShader(program, vertex_shader);
    Gl.attachShader(program, fragment_shader);
    Gl.linkProgram(program);
    if (!Gl.getProgramParameter(program, Gl.LINK_STATUS)) {
        console.log(Gl.getProgramInfoLog(program));
        Gl.deleteProgram(program);
    }
    Program = program;
}
