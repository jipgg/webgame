import * as cmm from './common.js' 
const Rect = cmm.Rect;
const Color = cmm.color;
export const WIDTH = 130;
export const OPENING_HEIGHT = 250;
export const SPACING = 600;
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
export function reset(c) {
    entries = new Array();
    spawn(c.height, 2);
}
export function spawn(h, count = 1, spacing = SPACING) {
    for (let i=0; i < count; ++i) {
        entries.push(new Pipe(spacing + spacing * entries.length, h))
    }
}
export function draw(renderer) {
    renderer.color = [COLOR.r, COLOR.g, COLOR.b, COLOR.a];
    for (let pipe of entries) {
        const [lx, ly, lw, lh] = pipe.lower_rect().data;
        const [ux, uy, uw, uh] = pipe.upper_rect(renderer.canvas).data;
        renderer.fill_rect(lx, ly, lw, lh)
            .fill_rect(ux, uy, uw, uh);
        if (cmm.draw_hitboxes) {
            renderer.color(Color(0, 0, 1))
                .draw_rect(pipe.lower_rect())
                .draw_rect(pipe.upper_rect(renderer.canvas.height))
                .color(COLOR);
        }
    }
}
