
export const init = (canvas, context) => {
}

/** @param{number}delta_sec **/
export const update = (delta_sec) => {
}

/** @param{CanvasRenderingContext2D}rc **/
export const draw = (rc) => {
    rc.clearRect(0, 0, rc.canvas.width, rc.canvas.height);

    rc.fillStyle = 'read';
    rc.fillRect(100, 100, 50, 50);
}
