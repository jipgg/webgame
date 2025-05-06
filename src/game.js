import {Renderer} from './Renderer.js';
//import * as Vec2 from './vec2.js';
import {Point, Rect, Color, V2} from './primitives.js';
import * as Mat3 from './mat3.js';
const DRAW_HITBOXES = true;
const HITBOX_COLOR = Color(0, 0, 0);
/** @type{HTMLLabelElement} */
const FPS_LABEL = document.getElementById("fps");
const SCORE_LABEL = document.getElementById("score");
/** @type{HTMLCanvasElement} */
let canvas = undefined;
const PAUSED = 0;
const PLAYING = 1;
const GAME_OVER = 2;
const GRAVITY = new V2(0, -1000);
const PIPE_WIDTH = 100;
const PIPE_OPENING_HEIGHT = 200;
const PIPE_SPACE = 300;
const PIPE_COLOR = Color(0, .9, 0);
const BIRD_JUMP_POWER = 350;
const BIRD_SPEED = 200;
const sin = Math.sin;
const cos = Math.cos;
let game_state = PLAYING;
let cached_bird_angle = 0;

let score = 0;
const bird = {
    position: new V2(-300, 100),
    velocity: new V2(BIRD_SPEED, 0),
    size: new V2(70, 60)
};
class Pipe {
    constructor(x, h) {
        this.opening_y = Math.random() * (h - PIPE_OPENING_HEIGHT);
        this.x = x;
    }
    upper_rect(max_height) {
        return new Rect(this.x, this.opening_y + PIPE_OPENING_HEIGHT, PIPE_WIDTH, max_height);
    }
    lower_rect() {
        return new Rect(this.x, 0, PIPE_WIDTH, this.opening_y);
    }
}
/** @type{Array<Pipe>} */
let pipes = [];

/** @param{HTMLCanvasElement} c */
function bird_rect(c) {
    const padding_x = bird.size.x / 10;
    const padding_y = bird.size.y / 10;
    return new Rect(
        bird.position.x - padding_x / 2,
        bird.position.y - bird.size.y - padding_y / 2,
        bird.size.x + padding_x,
        bird.size.y + padding_y,
    );
}
function spawn_next_pipe(h, count = 1) {
    for (let i=0; i < count; ++i) {
        pipes.push(new Pipe(PIPE_SPACE * pipes.length, h))
    }
}
const current_pipe = () => pipes[score];

export function reset() {
    bird.position.replace(0, canvas.height / 2);
    bird.velocity.replace(BIRD_SPEED, 0);
}

export function init(c, _) {
    canvas = c;
    bird.position.y = canvas.height / 2;
    spawn_next_pipe(c.height, 100);
}

export function update(delta_seconds) {
    console.log(game_state)
    if (game_state != GAME_OVER) {
        cached_bird_angle = Math.atan2(bird.velocity.y, bird.velocity.x);
    }
    if (bird.position.x > pipes[score].x + PIPE_WIDTH) {
        ++score;
        SCORE_LABEL.textContent = `Score: ${score}`;
    }
    const pipe = current_pipe();
    const rect = bird_rect();
    if (rects_overlap(bird_rect(), pipe.lower_rect())) {
        game_state = GAME_OVER;
    }
    if (rects_overlap(bird_rect(), pipe.upper_rect())) {
        game_state = GAME_OVER;
    }

    if (bird.position.y < bird.size.y) {
        game_state = GAME_OVER;
    }
    
    switch (game_state) {
        case PLAYING:
            bird.position.compound_add(bird.velocity.multiply(delta_seconds));
            bird.velocity.compound_add(GRAVITY.multiply(delta_seconds));
            //Vec2.compound_add(bird.pos, Vec2.multiply(bird.vel, delta_seconds));
            //Vec2.compound_add(bird.vel, Vec2.multiply(GRAVITY, delta_seconds));
            break;
        case GAME_OVER:
        bird.velocity = new V2(0, 0);
            break;
    }
    FPS_LABEL.textContent = `${Math.floor(1 / delta_seconds)} FPS`;
}

/** @param{KeyboardEvent} e */
export function keydown(e) {
    switch(e.key) {
        case ' ':
            bird.velocity.y = BIRD_JUMP_POWER;
            break;
        case 'r':
            game_state = PLAYING;
    }
}
/** @param{KeyboardEvent} e */
export function keyup(e) {

}

/** @param{Renderer} renderer */
export function render(renderer) {
    const c = renderer.canvas;
    renderer.clear(.4, .6, .9)
        .reset_transform()
        .draw_rect_raw(0, 0, canvas.width, canvas.height)
        .rotate(cached_bird_angle / 2)
        .translate(c.width / 2, bird.position.y - bird.size.y / 2)
        .color(Color(10, .8, .1))
        .fill_rect_raw(-bird.size.x / 2, -bird.size.y / 2, bird.size.x, bird.size.y)
        .rotation_raw(0)
        .translation_raw(c.width / 2 - bird.position.x - bird.size.x / 2, 0);
    if (DRAW_HITBOXES) {
        renderer.color(HITBOX_COLOR)
        renderer.draw_rect(bird_rect());
    }
    renderer.color(PIPE_COLOR);
    for (let pipe of pipes) {
        renderer.fill_rect(pipe.lower_rect())
            .fill_rect(pipe.upper_rect(c.height));
        if (DRAW_HITBOXES) {
            renderer.color(HITBOX_COLOR)
                .draw_rect(pipe.lower_rect())
                .draw_rect(pipe.upper_rect(c.height))
                .color(PIPE_COLOR);
        }
    }
}
function rects_overlap(a, b) {
    const a_top_right_x = a.x + a.w;
    const a_top_right_y = a.y + a.h;
    const b_top_right_x = b.x + b.w;
    const b_top_right_y = b.y + b.h;

    // Check for non-overlap conditions:
    if (a.x > b_top_right_x || b.x > a_top_right_x) return false; // No overlap in x-axis
    if (a.y > b_top_right_y || b.y > a_top_right_y) return false; // No overlap in y-axis

    return true; // Overlap exists
}
