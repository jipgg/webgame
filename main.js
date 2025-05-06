"use strict";
import {Renderer} from './src/Renderer.js';
import * as game from './src/game.js';
const renderer = new Renderer(document.getElementById("main_canvas"));
let last_time = performance.now();

game.init(renderer.canvas, renderer);
window.addEventListener("keydown", game.keydown);
window.addEventListener("keyup", game.keyup);
run();

function run() {
    let current_time = performance.now();
    let delta_seconds = (current_time - last_time) / 1000;
    last_time = current_time;
    game.update(delta_seconds);
    game.render(renderer);
    requestAnimationFrame(run);
}

