import { Interpolate } from "./Interpolate.js"
import { DrawLine } from "./Lines.js"
import { checksDepthBuffer } from "./DepthBuffer.js"
import { PutPixel } from "./Canvas.js"

//Drawing Triangles
let SortPoints = (p0,p1,p2) => {
    if (p0.y > p1.y) {
        [p0,p1] = [p1,p0];
    }
    if (p0.y > p2.y) {
        [p0,p2] = [p2,p0];
    }
    if (p1.y > p2.y) {
        [p1,p2] = [p2,p1];
    }

    return [p0,p1,p2];
}

let EdgeInterpolate = (y0,d0,y1,d1,y2,d2) => {
    let d01 = Interpolate(y0,d0,y1,d1);
    let d02 = Interpolate(y0,d0,y2,d2);
    let d12 = Interpolate(y1,d1,y2,d2);

    let d012 = d01.concat(d12);
    return [d02,d012];
}

let SegmentInterpolate = (xL,iL,xR,iR,y,y0) => {
    return Interpolate(
        xL[Math.trunc(y-y0)],
        iL[Math.trunc(y-y0)],
        xR[Math.trunc(y-y0)],
        iR[Math.trunc(y-y0)]
    );
}

let CalculateEdges = (p) => {
    let [x0,x1,x2] = [p[0].x,p[1].x,p[2].x];
    let [y0,y1,y2] = [p[0].y,p[1].y,p[2].y];

    let [iz0,iz1,iz2] = [p[0].iz,p[1].iz,p[2].iz]

    let [x02,x012] = EdgeInterpolate(y0,x0,y1,x1,y2,x2);
    let [iz02,iz012] = EdgeInterpolate(y0,iz0,y1,iz1,y2,iz2);

    return [x02,x012,iz02,iz012]
}

let CalculateUVEdges = (p) => {
    let [y0,y1,y2] = [p[0].y,p[1].y,p[2].y];
    let [iz0,iz1,iz2] = [p[0].iz,p[1].iz,p[2].iz]
    
    let [u0,u1,u2] = [p[0].uvs[0],p[1].uvs[0],p[2].uvs[0]];
    let [v0,v1,v2] = [p[0].uvs[1],p[1].uvs[1],p[2].uvs[1]];

    var [u02,u012] = EdgeInterpolate(y0,u0*iz0,y1,u1*iz1,y2,u2*iz2);
    var [v02,v012] = EdgeInterpolate(y0,v0*iz0,y1,v1*iz1,y2,v2*iz2);

    return [u02,u012,v02,v012];
}

let DefineLeftRight = (x02,x012,iz02,iz012) => {
    let middle = Math.trunc(x02.length/2);

    let xLeft, xRight, izLeft, izRight;

    if (x02[middle] < x012[middle]) {

        [xLeft,xRight] = [x02,x012];
        [izLeft,izRight] = [iz02,iz012];
    }
    else {
        [xLeft,xRight] = [x012,x02];
        [izLeft,izRight] = [iz012,iz02];
    }

    return [xLeft, xRight, izLeft,izRight]
}

let DefineUVLeftRight = (u02,u012,v02,v012,x02,x012) => {
    let middle = Math.trunc(x02.length/2);

    let uLeft, uRight, vLeft, vRight;

    if (x02[middle] < x012[middle]) {
        [uLeft,uRight] = [u02,u012];
        [vLeft,vRight] = [v02,v012];
    }
    else {
        [uLeft,uRight] = [u012,u02];
        [vLeft,vRight] = [v012,v02];
    }

    return [uLeft,uRight,vLeft,vRight];
}

let DrawTriangle = (p0,p1,p2,color) => {
    DrawLine(p0,p1,color);
    DrawLine(p1,p2,color);
    DrawLine(p2,p0,color);
}

let DrawTriangleFilled = (p0,p1,p2,color) => {
    let p = SortPoints(p0,p1,p2)

    let [x02,x012,iz02,iz012] = CalculateEdges(p);

    let [xLeft, xRight, izLeft,izRight] = DefineLeftRight(x02,x012,iz02,iz012);

    let [y0,y2] = [p[0].y,p[2].y];

    for(let y = y0; y <= y2; y++) {
        let izSegment = SegmentInterpolate(xLeft,izLeft,xRight,izRight,y,y0)

        let [xL,xR] = [xLeft[Math.trunc(y-y0)],xRight[Math.trunc(y-y0)]]

        for (let x = xL; x <= xR; x++) {
            let zInverted = izSegment[Math.trunc(x-xL)];
            if (checksDepthBuffer(x,y,zInverted)) {
                PutPixel(x,y,color);
            }
            
        }
    }
}

let DrawTriangleTextured = (p0,p1,p2,texture,uvs) => {
    [p0.uvs,p1.uvs,p2.uvs] = uvs

    let p = SortPoints(p0,p1,p2)

    let [x02,x012,iz02,iz012] = CalculateEdges(p);

    let [u02,u012,v02,v012] = CalculateUVEdges(p);

    let [xLeft, xRight, izLeft,izRight] = DefineLeftRight(x02,x012,iz02,iz012);

    let [uLeft,uRight,vLeft,vRight] = DefineUVLeftRight(u02,u012,v02,v012,x02,x012)

    let [y0,y2] = [p[0].y,p[2].y];

    for(let y = y0; y <= y2; y++) {
        let izSegment = SegmentInterpolate(xLeft,izLeft,xRight,izRight,y,y0)
        let uSegment =  SegmentInterpolate(xLeft,uLeft,xRight,uRight,y,y0)
        let vSegment =  SegmentInterpolate(xLeft,vLeft,xRight,vRight,y,y0)

        let [xL,xR] = [xLeft[Math.trunc(y-y0)],xRight[Math.trunc(y-y0)]]

        for (let x = xL; x <= xR; x++) {
            let zInverted = izSegment[Math.trunc(x-xL)];
            if (checksDepthBuffer(x,y,zInverted)) {
                let u = uSegment[Math.trunc(x-xL)]
                let v = vSegment[Math.trunc(x-xL)]

                let txl = texture.GetTexel(u/zInverted,v/zInverted);
                PutPixel(x,y,txl);
            }
            
        }
    }
}

/** Currently unused. Function for more sophisticated shaders */
/* 
let DrawTriangleShaded = (p0,p1,p2,color) => {
    let p = SortPoints(p0,p1,p2)

    let x0 = p[0].x;
    let x1 = p[1].x;
    let x2 = p[2].x;
    let y0 = p[0].y;
    let y1 = p[1].y;
    let y2 = p[2].y;

    let h0 = p[0].h;
    let h1 = p[1].h;
    let h2 = p[2].h;


    let x01 = Interpolate(y0,x0,y1,x1);
    let x02 = Interpolate(y0,x0,y2,x2);
    let x12 = Interpolate(y1,x1,y2,x2);

    let h01 = Interpolate(y0,h0,y1,h1);
    let h02 = Interpolate(y0,h0,y2,h2);
    let h12 = Interpolate(y1,h1,y2,h2);

    x01.pop();
    let x012 = x01.concat(x12);

    h01.pop();
    let h012 = h01.concat(h12);

    let middle = Math.trunc(x02.length/2);

    let xLeft;
    let xRight;

    if (x02[middle] < x012[middle]) {
        xLeft = x02;
        xRight = x012;

        hLeft = h02;
        hRight = h012;
    }
    else {
        xLeft = x012;
        xRight = x02;

        hLeft = h012;
        hRight = h02;
    }

    for(let y = y0; y <= y2; y++) {
        let hSegment = Interpolate(xLeft[Math.trunc(y-y0)],hLeft[Math.trunc(y-y0)],xRight[Math.trunc(y-y0)],hRight[Math.trunc(y-y0)])

        let xL = xLeft[Math.trunc(y-y0)];

        for (let x = xL; x <= xRight[Math.trunc(y-y0)]; x++) {
            PutPixel(x,y,[color[0]*hSegment[Math.trunc(x-xL)],color[1]*hSegment[Math.trunc(x-xL)],color[2]*hSegment[Math.trunc(x-xL)]]);
        }
    }
}*/

export { DrawTriangle, DrawTriangleFilled, DrawTriangleTextured }