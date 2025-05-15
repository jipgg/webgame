import * as gfx from './game/graphics.js';
import * as cmm from './game/common.js';
import * as pipes from './game/pipes.js';
import * as bird from './game/bird.js';
const canvas = document.getElementById("main_canvas");
const renderer = new gfx.DrawRenderer(canvas);
const fps_label = cmm.LabelWrapper.from_id("fps");
const score_label = cmm.LabelWrapper.from_id("score");
const highscore_label = cmm.LabelWrapper.from_id("highscore");
const play_label = cmm.LabelWrapper.from_id("play");
const gameover_label = cmm.LabelWrapper.from_id("gameover");
const paused = 0;
const playing = 1;
const game_over = 2;
let state = paused;

let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
pipes.entries
const current_pipe = () => pipes.entries[score];

export function init() {
    let last_time = performance.now();
    function run() {
        let current_time = performance.now();
        let delta_seconds = (current_time - last_time) / 1000;
        last_time = current_time;
        update(delta_seconds);
        render();
        requestAnimationFrame(run);
    }
    reset();
    window.addEventListener("keydown", keydown);
    run();
}

export function reset() {
    bird.position.replace(0, canvas.height / 2);
    bird.reset_velocity();
    pipes.spawn(canvas.height, 2);
    highscore = localStorage.getItem("highscore") || 0;
    highscore_label.text = `HI ${highscore}`;
    score_label.text = '0';
    score = 0;
}


export function update(delta_seconds) {
    if (bird.position.x > pipes.entries[score].x + pipes.width) {
        pipes.spawn(canvas.height);
        ++score;
        score_label.text = `${score}`;
        highscore_label.text = `HI ${highscore}`;
        if (score > highscore) {
            highscore = score;
            score_label.color = {r: 1, g: .4};
            //score_label.style.color = 'rgb(255, 180, 0)';
        } else {
            score_label.color = {r: 1, g: 1, b: 1};
        }
    }
    const pipe = current_pipe();
    if (bird.is_hit(pipe.upper_rect(), pipe.lower_rect())) {
        state = game_over;
    }
    switch (state) {
        case playing:
            bird.save_angle(Math.atan2(bird.velocity.y, bird.velocity.x));
            bird.apply_velocities(delta_seconds);
            break;
        case game_over:
            if (highscore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", highscore);
            }
            break;
    }
    fps_label.text = `${Math.floor(10 / delta_seconds) / 10} FPS`;
}

/** @param{KeyboardEvent} e */
export function keydown(e) {
    if (e.key == ' ') {
        if (state != playing) {
            if (state == game_over) reset();
            state = playing;
        }
        bird.flap();
    }
    switch(e.key) {
        case ' ':
            break;
    }
}
/** @param{gfx.DrawRenderer} renderer */
export function render() {
    switch (state) {
        case game_over:
            gameover_label.visible = true;
            play_label.visible = false;
            break;
        case playing:
            gameover_label.visible = false;
            play_label.visible = false;
            break;
        default:
            gameover_label.visible = false;
            play_label.visible = true;
    }
    renderer.clear()
        .reset_transform()
        .set_color(.4, .6, .9, 1)
        .fill_rect(0, 0, canvas.width, canvas.height);
    renderer.push_translation(canvas.width / 2 - bird.position.x, 0);
    bird.draw(renderer);
    pipes.draw(renderer);
    renderer.pop_matrix();
}

init();
