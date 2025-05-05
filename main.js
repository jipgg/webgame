"use strict";
import {Renderer} from './Renderer.js';
const cos = Math.cos;
const sin = Math.sin;
const rr = new Renderer(document.getElementById("main_canvas"));
await rr.init();
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
    rr.clear(.1, .1, .2, 1);
    rr.set_color(1, sin(angle), sin(angle * 2));
    const scale = 3;
    rr.set_transform(
        300, 100, sin(angle),
        scale * cos(angle),
        scale * sin(angle)
    );
    rr.draw_triangle(0, 0, 0, 100, 100, 0);
    const canvas = rr.canvas;
    rr.set_transform(
        canvas.width / 2, canvas.height, sin(angle),
        1, 1
    )
    rr.set_translation(
        rr.canvas.width / 2,
        rr.canvas.height / 2
    );
    rr.set_scale(10, 1);
    rr.set_rotation(angle);
    rr.set_scale(1, sin(angle) * 3);
    rr.set_color(cos(angle / 2), sin(angle), 1);
    rr.set_rotation(angle * 3);
    rr.set_translation(300, 100);
    rr.draw_rect(-50, -50, 100, 100);
    rr.draw_rect(-45, -45, 90, 90);
    rr.draw_rect(-40, -40, 80, 80);
    rr.draw_rect(-35, -35, 70, 70);
    rr.draw_rect(-30, -30, 60, 60);
    rr.fill_rect(-25, -25, 50, 50);
    rr.set_rotation(cos(angle));
    const polygon = new Float32Array([-20, 50, 100, 100, 150, 40, 100, 10, 200, -100]);
    rr.draw_polygon(polygon);
    rr.reset_transform();
    rr.set_translation(10, 10);
    rr.set_rotation(angle * 10);
    rr.set_color(1, .4, .4);
    rr.fill_triangle(-50, 50, 50, 50, -50, -50);
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

