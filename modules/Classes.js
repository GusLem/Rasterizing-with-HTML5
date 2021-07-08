import { MakeRotationYMatrix, MakeScalingMatrix, MakeTranslationMatrix } from "./MatrixGenerators.js"
import { NORMAL } from "./renderTypes.js";

//Classes
class Point  {
    constructor(x,y,iz = 0,h = 1) {
        this.x = x;
        this.y = y;
        this.iz = iz;
        this.h = h;
    }
}

class Vertex  {
    constructor(x,y,z,w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

class Triangle {
    constructor(vertices, color, texture = null, uvs = null) {
        this.vertices = vertices;
        this.color = color;
        this.texture = texture;
        this.uvs = uvs;
    }
}

class Matrix {
    constructor(data) {
        this.data = data
    }

    transpose() {
        let result = new Matrix([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
            result.data[i][j] = this.data[j][i];
            }
        }
        return result;
    }

    multiplyByMatrix(matrix) {
        let result = new Matrix([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result.data[i][j] += this.data[i][k]*matrix.data[k][j];
                }
            }
        }

        return result;
    }

    multiplyByVector(vec) {
        let result = [0, 0, 0, 0];
      
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            result[i] += this.data[i][j]*vec[j];
          }
        }
      
        //Intuitively this would return a vector, but it's returning a vertex because this is mainly used for transforms
        return new Vertex(result[0], result[1], result[2], result[3]);
    }
}

class Texture {
    constructor(url) {
        this.image = new Image();
        this.image.src = url;

        var texture = this;

        this.image.onload = function() {
            texture.iw = texture.image.width;
            texture.ih = texture.image.height;

            texture.canvas = document.createElement("canvas");
            texture.canvas.width = texture.iw;
            texture.canvas.height = texture.ih;
            let c2d = texture.canvas.getContext("2d");
            c2d.drawImage(texture.image, 0, 0, texture.iw, texture.ih);
            texture.pixel_data = c2d.getImageData(0, 0, texture.iw, texture.ih);
        }
    }

    GetTexel(u,v) {
        let iu = Math.trunc(u*this.iw);
        let iv = Math.trunc(v*this.ih);

        let offset = (iv*this.iw*4 + iu*4);

        return [
            this.pixel_data.data[offset + 0],
            this.pixel_data.data[offset + 1],
            this.pixel_data.data[offset + 2]
        ]
    }
}

class Model {
    constructor() {
        this.vertices = []
        this.triangles = []
        this.renderType = NORMAL;
    }
}

class Instance {
    constructor(model,position,rotation = 0,scale = 1.0) {
        this.model = model;
        this.rotation = rotation;
        this.position = position;
        this.scale = scale;

        this.transform = this.calculateTransform();
    }

    set pos(value) {
        this.position = value
        this.transform = this.calculateTransform();
    }

    set rot(value) {
        this.rotation = value
        this.transform = this.calculateTransform();
    }

    set scl(value) {
        this.scale = value
        this.transform = this.calculateTransform();
    }

    calculateTransform() {
        return MakeTranslationMatrix(this.position).
        multiplyByMatrix(MakeRotationYMatrix(this.rotation).
        multiplyByMatrix(MakeScalingMatrix(this.scale)));
    }
}

/** Unused Class, Camera is fixed */
/*class Camera {
    constructor(position,rotation) {
        this.position = position;
        this.rotationMatrix = MakeRotationYMatrix(rotation)
    }

    set rot(value) {
        this.rotationMatrix = MakeRotationYMatrix(value)
    }
}*/

/** Unused Class, originally for clipping but clipping is not used in this demo */
/*
class Plane {
    constructor(normal, distance) {
        this.normal = normal
        this.distance = distance
    }
}
*/

export { Point, Vertex, Triangle, Matrix, Texture, Model, Instance };