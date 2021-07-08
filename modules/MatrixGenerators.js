import { Matrix } from "./Classes.js"

//Matrix Generators
let MakeRotationYMatrix = (rotationDegrees) => {

    let rotationRadians = rotationDegrees*Math.PI/180;

    let cos = Math.cos(rotationRadians);
    let sin = Math.sin(rotationRadians);

    return new Matrix(
        [
            [cos, 0, -sin, 0],
            [  0, 1,    0, 0],
            [sin, 0,  cos, 0],
            [  0, 0,    0, 1]
        ]
    )
  }
  
let MakeTranslationMatrix = (translation) => {
    return new Matrix(
        [
            [ 1, 0, 0, translation[0]],
            [ 0, 1, 0, translation[1]],
            [ 0, 0, 1, translation[2]],
            [ 0, 0, 0,             1]
        ]
    )
}
  
let MakeScalingMatrix = (scale) => {
    return new Matrix(
        [
            [ scale,     0,     0, 0],
            [     0, scale,     0, 0],
            [     0,     0, scale, 0],
            [     0,     0,     0, 1]
        ]
    )
}

export { MakeRotationYMatrix, MakeTranslationMatrix, MakeScalingMatrix }