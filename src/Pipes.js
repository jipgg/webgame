import * as cmm from './common.js';
import * as gfx from './graphics.js';
const Rect = cmm.Rect;
const Color = cmm.color;
export const width = 130;
export const opening_height = 250;
export const spacing = 600;
export const color = [0.1, .9, 0.2, 1];
/** @type{Array<Pipe>} */
export let entries = [];
export class Pipe {
    constructor(x, h) {
        this.opening_y = Math.random() * (h - opening_height);
        this.x = x;
        this.h = h;
    }
    upper_rect() {
        return new Rect(this.x, this.opening_y + opening_height, width, 100000);
    }
    lower_rect() {
        return new Rect(this.x, 0, width, this.opening_y);
    }
}
export function reset(c) {
    entries.length = 0;
    spawn(c.height, 2);
}

export function spawn(h, count = 1, sp = spacing) {
    for (let i=0; i < count; ++i) {
        const pipe = new Pipe(sp + sp * entries.length, h);
        entries.push(pipe);
    }
}
/** @param{gfx.DrawRenderer} renderer */
export function draw(renderer) {
    renderer.color = color;
    for (let pipe of entries) {
        const [lx, ly, lw, lh] = pipe.lower_rect().data;
        const [ux, uy, uw, uh] = pipe.upper_rect(renderer.canvas).data;
        renderer.fill_rects([lx, ly, lw, lh, ux, uy, uw, uh]);
    }
}
