import * as gfx from './graphics.js';
//import * as Vec2 from './vec2.js';
import * as cmm from './common.js';
import * as pipes from './pipes.js';
import * as bird from './bird.js';
class Multicall {
    constructor() {
        this.functions = [];
    }
    bind(callback) {
        if (typeof callback === "function") {
            this.functions.push(callback);
            return true;
        } else return false;
    }
    get length() {return this.functions.length;}
    get empty() {return this.length = 0;}
    clear() {this.functions = [];}

    unbind(callback) {
        this.functions = this.functions.filter(subscriber => subscriber !== callback);
    }
    call(...v) {
        for (let cb of this.functions) cb(...v);
    }
}


const fps_label = cmm.LabelWrapper.from_id("fps");
const score_label = cmm.LabelWrapper.from_id("score");
const highscore_label = cmm.LabelWrapper.from_id("highscore");
const play_label = cmm.LabelWrapper.from_id("play");
const gameover_label = cmm.LabelWrapper.from_id("gameover");
const state_paused = 0;
const state_playing = 1;
const state_gameover = 2;
/** @type{HTMLCanvasElement} */
//const BIRD_JUMP_POWER = 400;
//const BIRD_SPEED = 200;
const sin = Math.sin;
const cos = Math.cos;
let state = state_paused;
let elapsed_spawn_time = 0;

let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
pipes.entries
const current_pipe = () => pipes.entries[score];
//const modifier = () => score / 20 + 1;
/** @type{gfx.DrawRenderer} */
let renderer;
const canv = () => renderer.canvas;

/** @param{gfx.DrawRenderer} r */
export function use_renderer(r) {
    renderer = r;
}
export function reset() {
    bird.position.replace(0, canv().height / 2);
    bird.reset_velocity();
    pipes.spawn(canv().height, 2);
    highscore = localStorage.getItem("highscore") || 0;
    highscore_label.text = `HI ${highscore}`;
    score_label.text = '0';
    score = 0;
}


export function update(delta_seconds) {
    elapsed_spawn_time += delta_seconds;
    if (state != state_gameover) {
        bird.save_angle(Math.atan2(bird.velocity.y, bird.velocity.x));
    }
    if (bird.position.x > pipes.entries[score].x + pipes.width) {
        pipes.spawn(canv().height);
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
        state = state_gameover;
    }
    
    switch (state) {
        case state_playing:
            bird.apply_velocities(delta_seconds);
            break;
        case state_gameover:
            if (highscore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", highscore);
            }
            break;
    }
    fps_label.text = `${Math.floor(10 / delta_seconds) / 10} FPS`;
}

/** @param{KeyboardEvent} e */
export function keydown(e) {
    switch(e.key) {
        case ' ':
            if (state != state_playing) {
                if (state == state_gameover) reset();
                state = state_playing;
            }
            bird.flap();
            break;
        case 'r':
            state = state_playing;
    }
}
/** @param{KeyboardEvent} e */
export function keyup(e) {
    switch(e.key) {
        case ' ':
            break;
    }

}

/** @param{gfx.DrawRenderer} renderer */
export function render() {
    switch (state) {
        case state_gameover:
            gameover_label.visible = true;
            play_label.visible = false;
            break;
        case state_playing:
            gameover_label.visible = false;
            play_label.visible = false;
            break;
        default:
            gameover_label.visible = false;
            play_label.visible = true;
    }
    const c = renderer.canvas;
    renderer.clear()
        .reset_transform()
        .set_color(.4, .6, .9, 1)
        .fill_rect(0, 0, c.width, c.height);
    renderer.push_translation(c.width / 2 - bird.position.x, 0);
    bird.draw(renderer);
    pipes.draw(renderer);
    renderer.pop_matrix();
}
