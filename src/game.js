import {Renderer} from './Renderer.js';
//import * as Vec2 from './vec2.js';
import * as Common from './common.js';
import * as Pipes from './Pipes.js';
/** @type{HTMLLabelElement} */
const Rect = Common.Rect;
const Color = Common.Color;
const FPS_LABEL = document.getElementById("fps");
const SCORE_LABEL = document.getElementById("score");
const HIGHSCORE_LABEL = document.getElementById("highscore");
/** @type{HTMLCanvasElement} */
let canvas = undefined;
const PAUSED = 0;
const PLAYING = 1;
const GAME_OVER = 2;
const GRAVITY = new Common.V2(0, -1200);
const BIRD_JUMP_POWER = 400;
const BIRD_SPEED = 200;
const sin = Math.sin;
const cos = Math.cos;
let game_state = PLAYING;
let cached_bird_angle = 0;
let space_down = false;

let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
const bird = {
    position: new Common.V2(-300, 100),
    velocity: new Common.V2(BIRD_SPEED, 0),
    size: new Common.V2(70, 60)
};

/** @param{HTMLCanvasElement} c */
function bird_rect(c) {
    const padding_x = bird.size.x / 1000;
    const padding_y = bird.size.y / 100;
    return new Common.Rect(
        bird.position.x,
        bird.position.y - bird.size.y,
        Math.cos(cached_bird_angle / 2) * bird.size.x,
        Math.cos(cached_bird_angle / 2) * bird.size.y,
    );
}
const current_pipe = () => Pipes.entries[score];
const modifier = () => score / 20 + 1;

export function reset() {
    bird.position.replace(0, canvas.height / 2);
    bird.velocity.replace(BIRD_SPEED, 0);
}

export function init(c, _) {
    canvas = c;
    bird.position.y = canvas.height / 2;
    Pipes.spawn(c.height, 2);
    highscore = localStorage.getItem("highscore") || 0;
    HIGHSCORE_LABEL.textContent = `HI ${highscore}`;
}

let elapsed_spawn_time = 0;
//let center = bird.position.subtract(bird.size.multiply(.5));
//let radius = 40;
export function update(delta_seconds) {
    //if (space_down) bird.velocity.y = BIRD_JUMP_POWER;
    elapsed_spawn_time += delta_seconds;
    if (game_state != GAME_OVER) {
        cached_bird_angle = Math.atan2(bird.velocity.y, bird.velocity.x);
    }
    if (bird.position.x > Pipes.entries[score].x + Pipes.WIDTH) {
        Pipes.spawn(canvas.height, 1, Pipes.SPACING + 50 * modifier());
        ++score;
        SCORE_LABEL.textContent = `${score}`;
        HIGHSCORE_LABEL.textContent = `HI ${highscore}`;
        if (score > highscore) {
            highscore = score;
            SCORE_LABEL.style.color = 'rgb(255, 120, 0)';
        } else {
            SCORE_LABEL.style.color = 'white';
        }
    }
    const pipe = current_pipe();
    const rect = bird_rect();
    if (Common.rects_overlap(bird_rect(), pipe.lower_rect())) {
        game_state = GAME_OVER;
    }
    if (Common.rects_overlap(bird_rect(), pipe.upper_rect())) {
        game_state = GAME_OVER;
    }
    if (bird.position.y < bird.size.y) {
        game_state = GAME_OVER;
    }
    
    switch (game_state) {
        case PLAYING:
            bird.position.compound_add(bird.velocity.multiply(delta_seconds));
            bird.velocity.compound_add(GRAVITY.multiply(delta_seconds));
            bird.velocity.x = BIRD_SPEED * modifier();
            //Vec2.compound_add(bird.pos, Vec2.multiply(bird.vel, delta_seconds));
            //Vec2.compound_add(bird.vel, Vec2.multiply(GRAVITY, delta_seconds));
            break;
        case GAME_OVER:
            if (highscore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", highscore);
            }
            bird.velocity = new Common.V2(0, 0);
            break;
    }
    FPS_LABEL.textContent = `${Math.floor(1 / delta_seconds)} FPS`;
}

/** @param{KeyboardEvent} e */
export function keydown(e) {
    switch(e.key) {
        case ' ':
            space_down = true;
            bird.velocity.y = BIRD_JUMP_POWER;
            break;
        case 'r':
            game_state = PLAYING;
    }
}
/** @param{KeyboardEvent} e */
export function keyup(e) {
    switch(e.key) {
        case ' ':
            space_down = false;
            brea;
    }

}

/** @param{Renderer} renderer */
export function render(renderer) {
    const c = renderer.canvas;
    renderer.clear(.4, .6, .9)
        .reset_transform()
        .draw_rect_raw(0, 0, canvas.width, canvas.height)
        .color(Color(.7, .5, .05))
        .translate(c.width / 2, bird.position.y - bird.size.y / 2)
        .rotation_raw(0)
        .rotate((cached_bird_angle - Math.PI/50) * 0.9)
        .fill_rect_raw(-bird.size.x, -bird.size.y / 3, bird.size.x * .8, bird.size.y / 2)
        .translation_raw(0)
        .rotation_raw(0)
        .rotate(cached_bird_angle / 4)
        .translate(c.width / 2, bird.position.y - bird.size.y / 2)
        .color(Color(10, .8, .1))
        .fill_rect_raw(-bird.size.x / 2, -bird.size.y / 2, bird.size.x, bird.size.y)
        .rotate(cached_bird_angle / 8)
        .fill_rect_raw(-bird.size.x * 0.7, -bird.size.y * 0.2, bird.size.x, bird.size.y / 2)
        .rotate(cached_bird_angle / 9)
        .color(Color(1, .5, .1))
        .fill_rect_raw(10, -bird.size.y / 3, bird.size.x / 1.6, bird.size.y / 3)
        .color(Color(1, 1, 1))
        .fill_rect_raw(5, 5, bird.size.x / 3, bird.size.y / 3)
        .color(Color(0, 0, 0))
        .fill_rect_raw(10, 2.5, bird.size.x / 4, bird.size.y / 4)
        .color(Color(10, .7, .1))
        .rotation_raw(0)
        .rotate(cached_bird_angle * 1.2)
        .fill_rect_raw(-bird.size.x, -bird.size.y / 3, bird.size.x * 0.9, bird.size.y / 2)
        .rotation_raw(0)
        .translation_raw(c.width / 2 - bird.position.x - bird.size.x / 2, 0);
    if (Common.DRAW_HITBOXES) {
        renderer.color(Common.HITBOX_COLOR)
        //const r = new Rect(center.x - radius, center.y - radius, radius * 2, radius * 2);
        //renderer.draw_rect(r);
        renderer.draw_rect(bird_rect());
    }
    Pipes.draw(renderer);
}
