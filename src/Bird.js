import * as cm from './common.js';
import * as gfx from './graphics.js';
export const jump_power = 700;
export const speed = 100;
const sin = Math.sin;
const cos = Math.cos;
export let cached_angle = 0;
export let position = new cm.Vec2(-300, 100);
export const base_velocity = new cm.Vec2(200, 0);
export let velocity = base_velocity.clone;
export let size = new cm.Vec2(70, 60);
export let acceleration = new cm.Vec2(5, -1600);
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
/** @param{gfx.DrawRenderer} renderer */
export function draw(renderer) {
    const c = renderer.canvas;
    const p = position;
    const s = size;
    const a = cached_angle;
    renderer.push_translation(0, 0)
        .push_translation(p.x + s.x / 2, p.y - s.y / 2)
            .set_color(1, .8, .1)
            .push_rotation(a / 10)
                .fill_rect(-s.x / 2, -s.y / 2, s.x, s.y)
            .pop_matrix()
            .push_rotation(a / 8)
                .fill_rect(-s.x * .7, -s.y * .2, s.x, s.y / 2)
                .push_rotation(a / 9)
                    .set_color(1, .5, .1)
                    .fill_rect(10, -s.y / 3, s.x / 1.6, s.y / 3)
                    .set_color(1, 1, 1)
                    .fill_rect(5, 5, s.x / 3, s.y / 3)
                    .set_color(0, 0, 0)
                    .fill_rect(10, 2.5, s.x / 4, s.y / 4)
                .pop_matrix()
            .pop_matrix()
            .set_color(1, .7, .1)
            .push_rotation((a + Math.PI / 30) * 1.3)
                .fill_rect(-s.x * .9 + s.x / 4, -s.y / 3, s.x * .5, s.y * .6)
            .pop_matrix()
        .pop_matrix()
    .pop_matrix()
}

