import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./Canvas.js";
import { NORMAL, SHADED, TEXTURED, WIREFRAME } from "./renderTypes.js"
import { DrawTriangle, DrawTriangleFilled, DrawTriangleTextured } from "./Triangles.js"
import { DotProduct, CrossProduct, VectorLength, VectorSubtract, VectorMultiply} from "./Vector.js"
import { Point } from "./Classes.js"

//Viewport constants
const VIEWPORT_SIZE = 1;
const VIEWPORT_DISTANCE = 1;

//Perspective Projection
let ViewportToCanvas = (x,y,z) => {
    let xx = (x*CANVAS_WIDTH)/VIEWPORT_SIZE
    let yy = (y*CANVAS_HEIGHT)/VIEWPORT_SIZE
    return new Point(xx,yy,1.0/z)
}

let ProjectVertex = (v) => {
    return ViewportToCanvas(v.x * VIEWPORT_DISTANCE / v.z, v.y * VIEWPORT_DISTANCE / v.z, v.z)
}

//Rendering
let VertexToVector = (v) => {
    return [v.x,v.y,v.z]
}

let CalculateNormalTriangle = (vertices,triangle) => {
    let a = VertexToVector(vertices[triangle.vertices[0]]);
    let b = VertexToVector(vertices[triangle.vertices[1]]);
    let c = VertexToVector(vertices[triangle.vertices[2]]);
 
    let v0 = VectorSubtract(b,a);
    let v1 = VectorSubtract(c,a);

    return CrossProduct(v0,v1);
}

let CalculateLighting = (triangle, normal) => {
    let i = 0;
    let light = [1,1,0]
    let dot = DotProduct(normal,light)
    if (dot > 0) {
        i = dot/(VectorLength(normal) * VectorLength(light));
    }

    return VectorMultiply(i,triangle.color);

}

let ChecksFrontFace =(vertices,triangle,normal) => {
    let directionToCamera = VectorMultiply(-1,VertexToVector(vertices[triangle.vertices[0]]));

    let dot = DotProduct(normal,directionToCamera)

    return (dot > 0);
    
}

let RenderTriangle = (triangle, projected, normal,type) => {

    switch (type) {

        case NORMAL:
            DrawTriangleFilled(
                projected[triangle.vertices[0]],
                projected[triangle.vertices[1]],
                projected[triangle.vertices[2]],
                triangle.color
            );
        break;

        case TEXTURED:
            DrawTriangleTextured(
                projected[triangle.vertices[0]],
                projected[triangle.vertices[1]],
                projected[triangle.vertices[2]],
                triangle.texture,
                triangle.uvs
            );
        break;

        case SHADED:
            DrawTriangleFilled(
                projected[triangle.vertices[0]],
                projected[triangle.vertices[1]],
                projected[triangle.vertices[2]],
                CalculateLighting(triangle,normal)
            );
        break;

        case WIREFRAME:
            DrawTriangle(
                projected[triangle.vertices[0]],
                projected[triangle.vertices[1]],
                projected[triangle.vertices[2]],
                triangle.color
            );
        break;

        

    }
}

let RenderInstance = (instance,transform) => {
    let transformedVertices = [];
    let projectedVertices = [];

    let vertices = instance.model.vertices;
    let triangles = instance.model.triangles;

    vertices.forEach(V => {
        let vInVec4 = [V.x,V.y,V.z,1];
        let vTransformed = transform.multiplyByVector(vInVec4);
        transformedVertices.push(vTransformed); 
        projectedVertices.push(ProjectVertex(vTransformed));
    });

    triangles.forEach(T => {
        let normal = CalculateNormalTriangle(transformedVertices,T)
        let renderType = instance.model.renderType;
        if (renderType == WIREFRAME || ChecksFrontFace(transformedVertices,T,normal))
            RenderTriangle(T, projectedVertices,normal,renderType);
    });

}

//Clipping
/** Clipping not used currently because every mesh is in front of camera */
/*
let SignedDistance =(position) => {
    let normal   = nearPlane.normal;
    let distance = nearPlane.distance; 
    return (
        (position.x * normal[0]) +
        (position.y * normal[1]) +
        (position.z * normal[2]) +
        + distance
    );
}

let ClipInstanceAgainstPlane = (position,radius) => {
    let distance = SignedDistance(position)
    return (distance >= radius)
}*/

export { RenderInstance }
