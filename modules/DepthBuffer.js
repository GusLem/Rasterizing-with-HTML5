import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./Canvas.js"

//Depth Buffer
let depthBuffer;

let ResetBuffer = () => {
    depthBuffer = new Array();
    depthBuffer.length = CANVAS_WIDTH * CANVAS_HEIGHT;
}

let checksDepthBuffer = (x,y,zInverted) => {
    let xx = CANVAS_WIDTH/2 + (Math.trunc(x));
    let yy = CANVAS_HEIGHT/2 - (Math.trunc(y)) - 1;

    if (xx < 0 || xx >= CANVAS_WIDTH || yy < 0 || yy >= CANVAS_HEIGHT) {
        return false;
    }

    let offset = xx + CANVAS_WIDTH*yy;

    if (typeof depthBuffer[offset] == 'undefined' || zInverted > depthBuffer[offset]) {
        depthBuffer[offset] = zInverted
        return true;
    }

    return false;
}

export { depthBuffer, ResetBuffer, checksDepthBuffer }