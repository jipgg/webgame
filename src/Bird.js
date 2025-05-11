import * as cm from './common.js';
import * as rn from './rendering.js';
export const jump_power = 400;
export const speed = 200;
const sin = Math.sin;
const cos = Math.cos;
export let cached_angle = 0;
export let position = new cm.vec2(-300, 100);
export let velocity = new cm.vec2(speed, 0);
export let size = new cm.vec2(70, 60);
export function flap() {
    velocity.y = jump_power;
}

export function rect() {
    const padding_x = size.x / 1000;
    const padding_y = size.y / 100;
    return new cm.rect(
        position.x,
        position.y - size.y,
        Math.cos(cached_angle / 2) * size.x,
        Math.cos(cached_angle / 2) * size.y,
    );
}
export function is_hit(upper, lower) {
    const r = rect();
    return cm.rects_overlap(r, upper) | cm.rects_overlap(r, lower) | position.y < size.y;
}
export function save_angle(angle) {
    cached_angle = Math.atan2(velocity.y, velocity.x);
}
export function apply_velocities(delta_seconds, gravity, x_speed_modifier) {
    position.compound_add(velocity.multiply(delta_seconds));
    velocity.compound_add(gravity.multiply(delta_seconds));
    velocity.x = speed * x_speed_modifier;
}
export function reset_velocity() {
    velocity = new cm.vec2();
}
export function update(delta_seconds, state) {
    switch (state) {
        case cm.state_playing:
            break;
        case cm.state_gameover:
            if (highscore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", highscore);
            }
            bird.velocity = new cm.vec2(0, 0);
            break;
    }
}
export function draw(renderer) {
    const c = renderer.canvas;
    renderer.color(cm.color(.7, .5, .05))
        .translate(c.width / 2, position.y - size.y / 2)
        .rotation_raw(0)
        .rotate((cached_angle + Math.PI / 30) * 1.5)
        .fill_rect_raw(-size.x *0.9 + size.x / 4, -size.y / 3, size.x * 0.7, size.y  * .6)
        //.fill_rect_raw(-size.x, -size.y / 3, size.x * .8, size.y / 2)
        .translation_raw(0)
        .rotation_raw(0)
        .rotate(cached_angle / 4)
        .translate(c.width / 2, position.y - size.y / 2)
        .color(cm.color(10, .8, .1))
        .fill_rect_raw(-size.x / 2, -size.y / 2, size.x, size.y)
        .rotate(cached_angle / 8)
        .fill_rect_raw(-size.x * 0.7, -size.y * 0.2, size.x, size.y / 2)
        .rotate(cached_angle / 9)
        .color(cm.color(1, .5, .1))
        .fill_rect_raw(10, -size.y / 3, size.x / 1.6, size.y / 3)
        .color(cm.color(1, 1, 1))
        .fill_rect_raw(5, 5, size.x / 3, size.y / 3)
        .color(cm.color(0, 0, 0))
        .fill_rect_raw(10, 2.5, size.x / 4, size.y / 4)
        .color(cm.color(10, .7, .1))
        .rotation_raw(0)
        .rotate(cached_angle * 1.2)
        .fill_rect_raw(-size.x + size.x / 4, -size.y / 3, size.x * 0.7, size.y  * .6)
        .rotation_raw(0)
        .translation_raw(c.width / 2 - position.x - size.x / 2, 0);
    if (cm.draw_hitboxes) {
        renderer.color(cm.hitbox_color)
        renderer.draw_rect(rect());
    }
}

