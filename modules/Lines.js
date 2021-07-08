import { Interpolate } from "./Interpolate.js"
import { PutPixel } from "./Canvas.js"

//Drawing Lines
let DrawLineH = (p0,p1,color) => {
    if (p0.x > p1.x) {
        [p0,p1] = [p1,p0];
    }

    let [x0,x1,y0,y1] = [p0.x,p1.x,p0.y,p1.y];

    let ys = Interpolate(x0,y0,x1,y1);
    for (let x = x0; x <= x1; x++) {
        PutPixel(x,ys[Math.trunc((x - x0))],color);
    }
}

let DrawLineV = (p0,p1,color) => {
    if (p0.y > p1.y) {
        [p0,p1] = [p1,p0];
    }

    let [x0,x1,y0,y1] = [p0.x,p1.x,p0.y,p1.y];

    let xs = Interpolate(y0,x0,y1,x1);
    for (let y = y0; y <= y1; y++) {
        PutPixel(xs[Math.trunc((y-y0))],y,color);
    }
}

let DrawLine = (p0,p1,color) => {
    let dx = p1.x-p0.x;
    let dy = p1.y-p0.y;

    if (Math.abs(dx) > Math.abs(dy)) {
        DrawLineH(p0,p1,color);
    }
    else {
        DrawLineV(p0,p1,color);
    }
    
}

export { DrawLine }