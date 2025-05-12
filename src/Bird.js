import * as cm from './common.js';
import * as gfx from './graphics.js';
export const jump_power = 600;
export const speed = 100;
const sin = Math.sin;
const cos = Math.cos;
export let cached_angle = 0;
export let position = new cm.Vec2(-300, 100);
export const base_velocity = new cm.Vec2(200, 0);
export let velocity = base_velocity.clone;
export let size = new cm.Vec2(70, 60);
export let acceleration = new cm.Vec2(5, -1500);
export function flap() {
    velocity.y = jump_power;
}

export function rect() {
    const padding_x = size.x / 1000;
    const padding_y = size.y / 100;
    return new cm.Rect(
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
export function apply_velocities(delta_seconds) {
    velocity.compound_add(acceleration.multiply(delta_seconds));
    position.compound_add(velocity.multiply(delta_seconds));
}
export function reset_velocity() {
    velocity = base_velocity.clone;
}
export function update(delta_seconds, state) {
    switch (state) {
        case cm.state_playing:
            break;
        case cm.state_gameover:
            if (highscore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", highscore);
            }
            bird.velocity = new cm.Vec2(speed, 0);
            break;
    }
}
/** @param{gfx.DrawRenderer} r */
export function draw(r) {
    const c = r.canvas;
    r.color = [.7, .5, .05];
    r.rotate((cached_angle + Math.PI / 30) * 1.5)
        .fill_rect(-size.x * 0.9 + size.x / 4, -size.y / 3, size.x * 0.7, size.y  * .6)
        .reset_transform()
        .rotate(cached_angle / 4)
        .translate(c.width / 2, position.y - size.y / 2);
    r.color = [10, .8, .1];
    r.fill_rect(-size.x / 2, -size.y / 2, size.x, size.y)
        .rotate(cached_angle / 8)
        .fill_rect(-size.x * 0.7, -size.y * 0.2, size.x, size.y / 2)
        .rotate(cached_angle / 9);
    r.color = [1, .5, .1];
    r.fill_rect(10, -size.y / 3, size.x / 1.6, size.y / 3);
    r.color = [1, 1, 1];
    r.fill_rect(5, 5, size.x / 3, size.y / 3);
    r.color = [0, 0, 0];
    r.fill_rect(10, 2.5, size.x / 4, size.y / 4);
    r.color = [1, .7, .1];
    r.rotation = 0;
    r.rotate(cached_angle * 1.2)
        .fill_rect(-size.x + size.x / 4, -size.y / 3, size.x * 0.7, size.y  * .6);
    r.rotation = 0;
    if (cm.draw_hitboxes) {
        r.color = [1, 0, 0];
        r.draw_rect(rect());
    }
}

