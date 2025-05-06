import {Point, Rect, Color} from './primitives.js';

/** @param{rect} a @param{rect} b @returns{boolean} */
//export function rects_overlap(a, b) {
//    const a_top_right_x = a.x + a.w;
//    const a_top_right_y = a.y + a.h;
//    const b_top_right_x = b.x + b.w;
//    const b_top_right_y = b.y + b.h;
//    if (a.x > b.x + b.w || b.x > a.x + a.w) return false;
//    if (b.y < a.y + a.h || a.y < b.y + b.h) return false;
//    return true;
//}

/** @param{rect} a @param{rect} b @returns{boolean} */
export function rects_overlap(a, b) {
    const a_top_right_x = a.x + a.w;
    const a_top_right_y = a.y + a.h;
    const b_top_right_x = b.x + b.w;
    const b_top_right_y = b.y + b.h;

    // Check for non-overlap conditions:
    if (a.x > b_top_right_x || b.x > a_top_right_x) return false; // No overlap in x-axis
    if (a.y > b_top_right_y || b.y > a_top_right_y) return false; // No overlap in y-axis

    return true; // Overlap exists
}
