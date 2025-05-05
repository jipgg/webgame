"use strict";
import {Renderer, point} from './Renderer.js';
const cos = Math.cos;
const sin = Math.sin;
const renderer = new Renderer(document.getElementById("main_canvas"));
await renderer.init();
let lastTime = performance.now();
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

let angle = 0;
function update(deltaTime) {
    angle += deltaTime / 1000;
}

function render() {
    renderer.clear_canvas(.1, .1, .2, 1)
        .color_brush(1, sin(angle), sin(angle * 2));
    const scale = 3;
    renderer.reset_transformation(
        300, 100, sin(angle),
        scale * cos(angle),
        scale * sin(angle)
    );
    renderer.draw_triangle(0, 0, 0, 100, 100, 0);
    const canvas = renderer.canvas;
    renderer.reset_transformation()
        .translate(canvas.width / 2, canvas.height / 2)
        .rotate(angle * 3)
        .scale(1, sin(angle) * 3)
        .color_brush(cos(angle / 2), sin(angle), 1)
        .rotate_degrees(10)
        .draw_rectangle(-50, -50, 100, 100)
        .rotate_degrees(15)
        .draw_rectangle(-45, -45, 90, 90)
        .rotate_degrees(20)
        .draw_rectangle(-40, -40, 80, 80)
        .rotate_degrees(25)
        .draw_rectangle(-35, -35, 70, 70)
        .rotate_degrees(30)
        .draw_rectangle(-30, -30, 60, 60)
        .rotate_degrees(35)
        .fill_rectangle(-25, -25, 50, 50)
        .reset_rotation(cos(angle));
    const polygon = new Float32Array([-20, 50, 100, 100, 150, 40, 100, 10, 200, -100]);
    //renderer.draw_polygon(polygon)
    //    .reset_transformation()
    //    .reset_translation(10, 10)
    //    .reset_rotation(angle * 10)
    //    .color_brush(1, .4, .4)
    //    .fill_triangle(-50, 50, 50, 50, -50, -50);
    //renderer.get_uniform(renderer.U_SCALE);
}
function run() {
    let currTime = performance.now();
    let deltaTime = currTime - lastTime;
    lastTime = currTime;
    update(deltaTime);
    render();
    requestAnimationFrame(run);
}
run();

