"use strict";
import * as gfx from './src/graphics.js';
import * as game from './src/game.js';
const renderer = new gfx.DrawRenderer(document.getElementById("main_canvas"));
let last_time = performance.now();

game.use_renderer(renderer);
game.reset();
window.addEventListener("keydown", game.keydown);
window.addEventListener("keyup", game.keyup);
run();

function run() {
    let current_time = performance.now();
    let delta_seconds = (current_time - last_time) / 1000;
    last_time = current_time;
    game.update(delta_seconds);
    game.render();
    requestAnimationFrame(run);
}

