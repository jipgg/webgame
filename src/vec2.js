/** @typedef{Float32Array}vec2*/
/** @returns{vec2} */
const X = 0;
const Y = 1;
export function create(x = 0, y = 0) {
    let vec = new Float32Array(2);
    vec[X] = x;
    vec[Y] = y;
    return vec;
}
export function replace(vec, x = 0, y = 0) {
    vec[X] = x;
    vec[Y] = y;
    return vec;
}
/** @param{vec2}v @returns{vec2} */
export function copy(v) {
    return create(v[X], v[Y]);
}
/** @param{vec2}a @returns{number} */
export const x = (a) => a[X];
/** @param{vec2}a @returns{number} */
export const y = (a) => a[X];
/** @param{vec2}a @param{vec2}b @returns{vec2} */
export function add(a, b) {
    return create(a[X] + b[X], a[Y] + b[Y]);
}
/** @param{vec2}a @param{vec2}b @returns{vec2} */
export function compound_add(a, b) {
    a[X] += b[X];
    a[Y] += b[Y];
    return a;
}
/** @param{vec2}a @param{vec2}b @returns{vec2} */
export function subtract(a, b) {
    return create(a[X] - b[X], a[Y] - b[Y]);
}
/** @param{vec2}a @param{number}b @returns{vec2} */
export function multiply(a, b) {
    return create(a[X] * b, a[Y] * b);
}
/** @param{vec2}a @param{number}b @returns{vec2} */
export function divide(a, b) {
    return create(a[X] / b, a[Y] / b);
}
/** @param{vec2}a @param{vec2}b @returns{vec2} */
export function compound_subtract(a, b) {
    a[X] -= b[X];
    a[Y] -= b[Y];
    return a;
}
/** @param{vec2}a @param{number}b @returns{vec2} */
export function compound_multiply(a, b) {
    a[X] *= b;
    a[Y] *= b;
    return a;
}
/** @param{vec2}a @param{number}b @returns{vec2} */
export function compound_divide(a, b) {
    a[X] /= b;
    a[Y] /= b;
    return a;
}
/** @param{vec2}a @param{vec2}b @returns{number} */
export function dot(a, b) {
    return a[X] * b[X] + a[Y] * b[Y];
}
/** @param{vec2}a @returns{number} */
export function norm_squared(a) {
    return a[X] * a[X] + a[Y] * a[Y];
}
/** @param{vec2}a @returns{number} */
export function norm(a) {
    return Math.sqrt(norm_squared(a));
}
