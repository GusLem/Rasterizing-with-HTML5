let Interpolate = (i0,d0,i1,d1) => {
    if (i0 == i1) {
        return [ d0 ];
    }

    let values = [];
    let a = (d1 - d0) / (i1 - i0);
    let d = d0;
    for (let i = i0; i <= i1; i++) {
        values.push(d)
        d += a;
    }

    return values;
}

export { Interpolate }