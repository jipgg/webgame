import * as Common from './common.js' 
const Rect = Common.Rect;
const Color = Common.Color;
export const WIDTH = 130;
export const OPENING_HEIGHT = 250;
export const SPACING = 500;
export const COLOR = Color(0, .9, 0);
/** @type{Array<Pipe>} */
export let entries = [];
export class Pipe {
    constructor(x, h) {
        this.opening_y = Math.random() * (h - OPENING_HEIGHT);
        this.x = x;
    }
    upper_rect(max_height) {
        return new Rect(this.x, this.opening_y + OPENING_HEIGHT, WIDTH, 100000);
    }
    lower_rect() {
        return new Rect(this.x, 0, WIDTH, this.opening_y);
    }
}
export function spawn(h, count = 1, spacing = SPACING) {
    for (let i=0; i < count; ++i) {
        entries.push(new Pipe(spacing * entries.length, h))
    }
}
export function draw(renderer) {
    renderer.color(COLOR);
    for (let pipe of entries) {
        renderer.fill_rect(pipe.lower_rect())
            .fill_rect(pipe.upper_rect(renderer.canvas.height));
        if (Common.DRAW_HITBOXES) {
            renderer.color(Color(0, 0, 1))
                .draw_rect(pipe.lower_rect())
                .draw_rect(pipe.upper_rect(renderer.canvas.height))
                .color(COLOR);
        }
    }
}
