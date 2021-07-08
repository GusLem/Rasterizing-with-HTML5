//Vector functions
let VectorLength = (v) => {
    return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
}

let DotProduct = (v0,v1) => {
    return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
}

let CrossProduct = (v0,v1) => {    
    let vx = v0[1]*v1[2] - v0[2]*v1[1];
    let vy = v0[2]*v1[0] - v0[0]*v1[2];
    let vz = v0[0]*v1[1] - v0[1]*v1[0];

    return [vx,vy,vz]
}

let VectorMultiply = (k, v) => {
    return [
        k*v[0],
        k*v[1],
        k*v[2],
    ]
}

let VectorSubtract = (v0,v1) => {
    return [
        v0[0] - v1[0],
        v0[1] - v1[1],
        v0[2] - v1[2],
    ]
}

export { VectorLength, DotProduct, CrossProduct, VectorMultiply, VectorSubtract }
