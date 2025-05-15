export class Color {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.data = new Float32Array([r, g, b, a]);
    }
    static get white() {
        return new Color(1, 1, 1);
    }
    get r() {return this.data[0];}
    get g() {return this.data[1];}
    get b() {return this.data[2];}
    get a() {return this.data[3];}
    set r(v) {this.data[0] = v;}
    set g(v) {this.data[1] = v;}
    set b(v) {this.data[2] = v;}
    set a(v) {this.data[3] = v;}
}

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
    get size() {return new Vec2(w, h);}
    get position() {return new Vec2(x, y);}

}

export class Mat3 {
    constructor(data = new Float32Array(9)) {
        this.data = data;
    }
    static get identity() {
        return new Mat3(new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]));
    }
    static from_scale(sx = 1, sy = 1) {
        return new Mat3(new Float32Array([
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]));
    }
    static from_translation(x = 0, y = 0) {
        return new Mat3(new Float32Array([
            1, 0, x,
            0, 1, y,
            0, 0, 1
        ]));
    }
    static from_rotation(r = 0) {
        const cos_r = Math.cos(r);
        const sin_r = Math.sin(r);
        return new Mat3(new Float32Array([
            cos_r, -sin_r, 0,
            sin_r, cos_r, 0,
            0, 0, 1
        ]));
    }
    static from_transform(x = 0, y = 0, r = 0, sx = 1, sy = 1) {
        const cos_r = Math.cos(r);
        const sin_r = Math.sin(r);
        return new Mat3(new Float32Array([
            sx * cos_r, -sin_r * sy, x,
            sx * sin_r, sy * cos_r, y,
            0, 0, 1
        ]));
    }
    add(mat) {
        const result = new Float32Array(9);
        for (let i = 0; i < 9; i++) {
            result[i] = this.data[i] + mat.data[i];
        }
        return new Mat3(result);
    }
    subtract(mat) {
        const result = new Float32Array(9);
        for (let i = 0; i < 9; i++) {
            result[i] = this.data[i] - mat.data[i];
        }
        return new Mat3(result);
    }
    multiply_scalar(scalar) {
        const result = new Float32Array(9);
        for (let i = 0; i < 9; i++) {
            result[i] = this.data[i] * scalar;
        }
        return new Mat3(result);
    }
    multiply(mat) {
        const a = this.data;
        const b = mat.data;
        const result = new Float32Array(9);
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                result[row * 3 + col]
                    = a[row * 3 + 0] * b[0 * 3 + col]
                    + a[row * 3 + 1] * b[1 * 3 + col]
                    + a[row * 3 + 2] * b[2 * 3 + col];
            }
        }
        return new Mat3(result);
    }
    transform_vec3(vec) {
        const x = this.data[0] * vec.x + this.data[1] * vec.y + this.data[2] * vec.z;
        const y = this.data[3] * vec.x + this.data[4] * vec.y + this.data[5] * vec.z;
        const z = this.data[6] * vec.x + this.data[7] * vec.y + this.data[8] * vec.z;
        return new Vec3(x, y, z);
    }
}
export class Vec3 {
    constructor(x = 0, y = 0, z = 1) {
        this.data = new Float32Array(3);
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
    }

    get x() {return this.data[0];}
    get y() {return this.data[1];}
    get z() {return this.data[2];}

    set x(value) {this.data[0] = value;}
    set y(value) {this.data[1] = value;}
    set z(value) {this.data[2] = value;}
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    compound_add(v) {
        this.data[0] += v.x;
        this.data[1] += v.y;
        this.data[2] += v.z;
        return this;
    }
    subtract(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    compound_subtract(v) {
        this.data[0] -= v.x;
        this.data[1] -= v.y;
        this.data[2] -= v.z;
        return this;
    }
    multiply(scalar) {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    compound_multiply(scalar) {
        this.data[0] *= scalar;
        this.data[1] *= scalar;
        this.data[2] *= scalar;
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    get length_squared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    get length() {
        return Math.sqrt(this.length_squared);
    }
    normalize() {
        const len = this.length;
        if (len > 0) {
            this.data[0] /= len;
            this.data[1] /= len;
            this.data[2] /= len;
        }
        return this;
    }
}

export class Vec2 {
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
    get clone() {
        return new Vec2(this.x, this.y);
    }
    /** @param {number} v */
    set y(v) {this.data[1] = v;}

    /** @param {Vec2} v */
    add(v) {return new Vec2(this.x + v.x, this.y + v.y);}
    /** @param {Vec2} v */
    compound_add(v) {
        this.data[0] += v.data[0];
        this.data[1] += v.data[1];
        return this;
    }
    /** @param {Vec2} v */
    subtract(v) {return new Vec2(this.x - v.x, this.y - v.y);}
    /** @param {Vec2} v */
    compound_subtract(v) {
        this.data[0] -= v.data[0];
        this.data[1] -= v.data[1];
        return this;
    }
    /** @param {number} v */
    multiply(v) {return new Vec2(this.x * v, this.y * v);}
    /** @param {number} v */
    compound_multiply(v) {
        this.data[0] *= v;
        this.data[1] *= v;
        return this;
    }
    /** @param {Vec2} v */
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
export class LabelWrapper {
    /** @param{HTMLLabelElement} l */
    constructor(l) {
        this.label = l;
    }
    /** @param{string}id @returns{LabelWrapper} */
    static from_id(id) {return new LabelWrapper(document.getElementById(id)); }
    
    /** @param{{r: number, g: number, b: number, a: number}} {r, g, b, a} */
    set color({r=0, g=0, b=0}) {this.label.style.color = `rgb(${r * 255},${g * 255},${b * 255})`;}
    get visible() {
        return this.label.style.visibility == "visible";
    }
    set visible(v) {
        return this.label.style.visibility = v ? "visible" : "hidden";
    }
    get text() {
        return this.label.textContent;
    }
    set text(t) {
        this.label.textContent = t;
    }
}
