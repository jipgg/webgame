/** @typedef{Float32Array}Mat3*/
const sin = Math.sin;
const cos = Math.cos;

/** @type{Mat3} */
export const IDENTITY = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);
/** @returns{Mat3} */
export function from_scale(sx, sy = sx) {
    return new Float32Array([
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
    ]);
}
/** @returns{Mat3} */
export function from_rotation(r) {
    const cos_r = cos(r);
    const sin_r = sin(r);
    return new Float32Array([
        cos_r, -sin_r, 0,
        sin_r, cos_r, 0,
        0, 0, 1,
    ]);
}
/** @returns{Mat3} */
export function from_translation(x, y) {
    return new Float32Array([
        0, 0, x,
        0, 0, y,
        0, 0, 1,
    ]);
}
/**
 * Transposes a 3x3 matrix.
 * @param {Mat3} mat 
 * @returns {Mat3}
 */
export function transpose(mat) {
    return new Float32Array([
        mat[0], mat[3], mat[6],
        mat[1], mat[4], mat[7],
        mat[2], mat[5], mat[8],
    ]);
}

/**
 * Multiplies a 3x3 matrix with a 3D vector.
 * @param {Mat3} mat 
 * @param {Float32Array} vec A 3D vector [x, y, z].
 * @returns {Float32Array} Resultant vector.
 */
export function multiply_vec3(mat, vec) {
    return new Float32Array([
        mat[0] * vec[0] + mat[1] * vec[1] + mat[2] * vec[2],
        mat[3] * vec[0] + mat[4] * vec[1] + mat[5] * vec[2],
        mat[6] * vec[0] + mat[7] * vec[1] + mat[8] * vec[2],
    ]);
}

/**
 * Multiplies two 3x3 matrices.
 * @param {Mat3} a 
 * @param {Mat3} b 
 * @returns {Mat3} Resultant matrix.
 */
export function multiply_mat3(a, b) {
    return new Float32Array([
        a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
        a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
        a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

        a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
        a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
        a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

        a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
        a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
        a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    ]);
}

/**
 * Creates a scale matrix and multiplies it with an existing matrix.
 * @param {Mat3} mat 
 * @param {number} sx 
 * @param {number} sy 
 * @returns {Mat3}
 */
export function scale(mat, sx, sy = sx) {
    const scaleMat = from_scale(sx, sy);
    return multiply_mat3(mat, scaleMat);
}

/**
 * Creates a rotation matrix and multiplies it with an existing matrix.
 * @param {Mat3} mat 
 * @param {number} r Angle in radians.
 * @returns {Mat3}
 */
export function rotate(mat, r) {
    const rotMat = from_rotation(r);
    return multiply_mat3(mat, rotMat);
}

/**
 * Creates a translation matrix and multiplies it with an existing matrix.
 * @param {Mat3} mat 
 * @param {number} x 
 * @param {number} y 
 * @returns {Mat3}
 */
export function translate(mat, x, y) {
    const transMat = from_translation(x, y);
    return multiply_mat3(mat, transMat);
}
