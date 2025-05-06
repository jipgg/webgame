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

/**
 * @typedef {object} Rect
 * @property {number} x - x-coordinate
 * @property {number} y - y-coordinate
 * @property {number} w - width
 * @property {number} h - height
 */
/** @returns{Point} */
export const Point = (x = 0, y = 0) => ({x: x, y: y});
/** @returns{Color} */
export const Color = (r = 0, g = 0, b = 0, a = 0) => ({r: r, g: g, b: b, a: a});
/** @returns{Rect} */
//export const Rect = (x = 0, y = 0, w = 0, h = 0) => ({x: x, y: y, w: w, h: h});

export class Rect {
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
    get size() {return new V2(w, h);}
    get position() {return new V2(x, y);}

    vertices(rotation, center = new V2(0, 0)) {
        const h_w = this.w / 2;
        const h_h = this.h / 2;
        const cos_r = Math.cos(rotation);
        const sin_r = Math.sin(rotation);
        return [
            new V2(
                center.x + (h_w * cos_r - h_h * sin_r),
                center.y + (h_w * sin_r + h_h * cos_r)
            ),
            new V2(
                center.x + (-h_w * cos_r - h_h * sin_r),
                center.y + (-h_w * sin_r + h_h * cos_r)
            ),
            new V2(
                center.x + (-h_w * cos_r - -h_h * sin_r),
                center.y + (-h_w * sin_r + -h_h * cos_r)
            ),
            new V2(
                center.x + (h_w * cos_r - -h_h * sin_r),
                center.y + (h_w * sin_r + -h_h * cos_r)
            ),
        ];
    }
}


export class V2 {
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

    /** @param {V2} v */
    add(v) {return new V2(this.x + v.x, this.y + v.y);}
    /** @param {V2} v */
    compound_add(v) {
        this.data[0] += v.data[0];
        this.data[1] += v.data[1];
        return this;
    }
    /** @param {V2} v */
    subtract(v) {return new V2(this.x - v.x, this.y - v.y);}
    /** @param {V2} v */
    compound_subtract(v) {
        this.data[0] -= v.data[0];
        this.data[1] -= v.data[1];
        return this;
    }
    /** @param {number} v */
    multiply(v) {return new V2(this.x * v, this.y * v);}
    /** @param {number} v */
    compound_multiply(v) {
        this.data[0] *= v;
        this.data[1] *= v;
        return this;
    }
    /** @param {V2} v */
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
