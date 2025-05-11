/**
 * @typedef {object} Point
 * @property {number} x - x-coordinate
 * @property {number} y - y-coordinate
 */
/**
 * @typedef {object} Color
 * @property {number} r - red
 * @property {number} g - green
 * @property {number} b - blue
 * @property {number} a - alpha
 */

/** @returns{Point} */
export const point = (x = 0, y = 0) => ({x: x, y: y});
/** @returns{Color} */
export const color = (r = 0, g = 0, b = 0, a = 0) => ({r: r, g: g, b: b, a: a});
export const draw_hitboxes = false;
export const hitbox_color = color(0, 0, 1);

export class rect {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.data = new Float32Array([x, y, w, h]);
    }
    get x() {return this.data[0];}
    get y() {return this.data[1];}
    get w() {return this.data[2];}
    get h() {return this.data[3];}
    set x(v) {this.data[0] = v;}
    set y(v) {this.data[1] = v;}
    set w(v) {this.data[2] = v;}
    set h(v) {this.data[3] = v;}
    get size() {return new vec2(w, h);}
    get position() {return new vec2(x, y);}

}


export class vec2 {
    constructor(x = 0, y = 0) {
        this.data = new Float32Array(2);
        this.data[0] = x;
        this.data[1] = y;
    }

    replace(x = 0, y = 0) {
        const v = this.data;
        v[0] = x;
        v[1] = y;
        return v;
    }
    get x() {return this.data[0];}
    get y() {return this.data[1];}
    /** @param {number} v */
    set x(v) {this.data[0] = v;}
    /** @param {number} v */
    set y(v) {this.data[1] = v;}

    /** @param {vec2} v */
    add(v) {return new vec2(this.x + v.x, this.y + v.y);}
    /** @param {vec2} v */
    compound_add(v) {
        this.data[0] += v.data[0];
        this.data[1] += v.data[1];
        return this;
    }
    /** @param {vec2} v */
    subtract(v) {return new vec2(this.x - v.x, this.y - v.y);}
    /** @param {vec2} v */
    compound_subtract(v) {
        this.data[0] -= v.data[0];
        this.data[1] -= v.data[1];
        return this;
    }
    /** @param {number} v */
    multiply(v) {return new vec2(this.x * v, this.y * v);}
    /** @param {number} v */
    compound_multiply(v) {
        this.data[0] *= v;
        this.data[1] *= v;
        return this;
    }
    /** @param {vec2} v */
    dot(v) {
        const a = this.data;
        const b = v.data;
        return a[0] * b[0] + a[1] * b[1];
    }
    get length_squared() {
        const v = this.data;
        return v[0] * v[0] + v[1] * v[1];
    }
    get length() {
        return Math.sqrt(this.length_squared);
    }
}
export function rects_overlap(a, b) {
    const a_top_right_x = a.x + a.w;
    const a_top_right_y = a.y + a.h;
    const b_top_right_x = b.x + b.w;
    const b_top_right_y = b.y + b.h;

    if (a.x > b_top_right_x || b.x > a_top_right_x) return false;
    if (a.y > b_top_right_y || b.y > a_top_right_y) return false;

    return true;
}
export function circle_intersects_rect(center, radius, rect) {
    let circleDistance = {};
    circleDistance.x = Math.abs(center.x - rect.x);
    circleDistance.y = Math.abs(center.y - rect.y);

    if (circleDistance.x > (rect.w/2 + radius)) { return false; }
    if (circleDistance.y > (rect.h/2 + radius)) { return false; }

    if (circleDistance.x <= (rect.w/2)) { return true; } 
    if (circleDistance.y <= (rect.h/2)) { return true; }

    cornerDistance_sq = (circleDistance.x - rect.w/2)^2 +
                         (circleDistance.y - rect.h/2)^2;

    return (cornerDistance_sq <= (radius^2));
}
