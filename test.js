// Setup
const canvas = document.getElementById("main_canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
  console.error("WebGL2 not supported in this browser.");
}

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

// Shaders
const vertexShaderSource = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec3 aColor;

out vec3 vColor;

void main() {
    vColor = aColor;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 vColor;
out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}`;

// Compile shaders
function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Use program
gl.useProgram(program);

// Data
const positions = [
  // Triangle 1
  -0.5, -0.5,
   0.5, -0.5,
   0.0,  0.5,

  // Triangle 2
  -0.7,  0.7,
   0.7,  0.7,
   0.0,  0.2,
];

const colors = [
  // Colors for Triangle 1
  1.0, 0.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 0.0, 1.0,

  // Colors for Triangle 2
  1.0, 1.0, 0.0,
  0.0, 1.0, 1.0,
  1.0, 0.0, 1.0,
];

// Buffers and VAO
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

gl.bindVertexArray(null);

// Game Loop
let lastTime = 0;
function gameLoop(time) {
  const deltaTime = (time - lastTime) / 1000; // Seconds
  lastTime = time;

  update(deltaTime);
  render();

  requestAnimationFrame(gameLoop);
}

// Update
function update(deltaTime) {
  // Game logic goes here
}

// Render
function render() {
  gl.clearColor(0.2, 0.3, 0.4, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
  gl.bindVertexArray(null);
}

// Start game loop
requestAnimationFrame(gameLoop);

