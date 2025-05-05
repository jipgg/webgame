/** @typedef{Float32Array}Vec2*/
/** @returns{Vec2} */
const X = 0;
const Y = 1;
export function create(x = 0, y = 0) {
    let vec = new Float32Array(2);
    vec[X] = x;
    vec[Y] = y;
    return vec;
}
/** @param{Vec2}a @returns{number} */
export const x = (a) => a[X];
/** @param{Vec2}a @returns{number} */
export const y = (a) => a[X];
/** @param{Vec2}a @param{Vec2}b @returns{Vec2} */
export function add(a, b) {
    return create(a[X] + b[X], a[Y] + b[Y]);
}
/** @param{Vec2}a @param{Vec2}b @returns{Vec2} */
export function sub(a, b) {
    return create(a[X] - b[X], a[Y] - b[Y]);
}
/** @param{Vec2}a @param{number}b @returns{Vec2} */
export function mul(a, b) {
    return create(a[X] * b, a[Y] * b);
}
/** @param{Vec2}a @param{number}b @returns{Vec2} */
export function div(a, b) {
    return create(a[X] / b, a[Y] / b);
}
/** @param{Vec2}a @param{Vec2}b @returns{number} */
export function dot(a, b) {
    return a[X] * b[X] + a[Y] * b[Y];
}
/** @param{Vec2}a @returns{number} */
export function norm2(a) {
    return a[X] * a[X] + a[Y] * a[Y];
}
/** @param{Vec2}a @returns{number} */
export function norm(a) {
    return Math.sqrt(norm2(a));
}
