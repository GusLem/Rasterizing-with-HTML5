import { Model, Vertex, Triangle } from "./Classes.js";
import { SHADED, TEXTURED} from "./renderTypes.js"

//Colors
const RED = [255,0,0];
const GREEN = [0,255,0];
const BLUE = [0,0,255];
const YELLOW = [255,255,0];
const PURPLE = [255,0,255];
const CYAN = [0,255,255];


//Models
let Cube = () => {
    let cube = new Model();

    cube.vertices = [];

    cube.vertices.push(new Vertex(1,1,1),new Vertex(-1,1,1),)
    cube.vertices.push(new Vertex(-1,-1,1),new Vertex(1,-1,1))
    cube.vertices.push(new Vertex(1,1,-1),new Vertex(-1,1,-1))
    cube.vertices.push(new Vertex(-1,-1,-1),new Vertex(1,-1,-1))

    cube.triangles = [];

    cube.triangles.push(new Triangle([0,1,2],RED),new Triangle([0,2,3],RED))
    cube.triangles.push(new Triangle([4,0,3],GREEN),new Triangle([4,3,7],GREEN))
    cube.triangles.push(new Triangle([5,4,7],BLUE),new Triangle([5,7,6],BLUE))
    cube.triangles.push(new Triangle([1,5,6],YELLOW),new Triangle([1,6,2],YELLOW))
    cube.triangles.push(new Triangle([4,5,1],PURPLE),new Triangle([4,1,0],PURPLE))
    cube.triangles.push(new Triangle([2,6,7],CYAN),new Triangle([2,7,3],CYAN))

    return cube;
}

let TexturedCube = (texture) => {
    let cube = new Model();

    cube.vertices = [];

    cube.vertices.push(new Vertex(1,1,1),new Vertex(-1,1,1),)
    cube.vertices.push(new Vertex(-1,-1,1),new Vertex(1,-1,1))
    cube.vertices.push(new Vertex(1,1,-1),new Vertex(-1,1,-1))
    cube.vertices.push(new Vertex(-1,-1,-1),new Vertex(1,-1,-1))

    cube.triangles = [];

    cube.triangles.push(new Triangle([0,1,2],RED,texture,[[0,0],[1,0],[1,1]]))
    cube.triangles.push(new Triangle([0,2,3],RED,texture,[[0,0],[1,1],[0,1]]))
    cube.triangles.push(new Triangle([4,0,3],GREEN,texture,[[0,0],[1,0],[1,1]]))
    cube.triangles.push(new Triangle([4,3,7],GREEN,texture,[[0,0],[1,1],[0,1]]))
    cube.triangles.push(new Triangle([5,4,7],BLUE,texture,[[0,0],[1,0],[1,1]]))
    cube.triangles.push(new Triangle([5,7,6],BLUE,texture,[[0,0],[1,1],[0,1]]))
    cube.triangles.push(new Triangle([1,5,6],YELLOW,texture,[[0,0],[1,0],[1,1]]))
    cube.triangles.push(new Triangle([1,6,2],YELLOW,texture,[[0,0],[1,1],[0,1]]))
    cube.triangles.push(new Triangle([4,5,1],PURPLE,texture,[[0,0],[1,0],[1,1]]))
    cube.triangles.push(new Triangle([4,1,0],PURPLE,texture,[[0,0],[1,1],[0,1]]))
    cube.triangles.push(new Triangle([2,6,7],CYAN,texture,[[0,0],[1,0],[1,1]]))
    cube.triangles.push(new Triangle([2,7,3],CYAN,texture,[[0,0],[1,1],[0,1]]))

    cube.renderType = TEXTURED;

    return cube;
}

let Sphere = (divs) => {
        let sphere = new Model()

        sphere.vertices = [];
             
        let delta_angle = 2.0*Math.PI / divs;
      
        // Generate vertices
        for (let d = 0; d <= divs ; d++) {
          let y = (2.0 / divs) * (d - divs/2);
          let radius = Math.sqrt(1.0 - y*y);
          for (let i = 0; i < divs; i++) {
            let vertex = new Vertex(radius*Math.cos(i*delta_angle), y, radius*Math.sin(i*delta_angle));
            sphere.vertices.push(vertex);
          }
        }
      
        sphere.triangles = [];

        // Generate triangles.
        for (let d = 0; d < divs; d++) {
          for (let i = 0; i < divs - 1; i++) {
            let i0 = d*divs + i;
            sphere.triangles.push(new Triangle([i0, i0+divs+1, i0+1], GREEN));
            sphere.triangles.push(new Triangle([i0, i0+divs, i0+divs+1], GREEN));
          }
        }

        //Close sphere
        for (let d = 0; d < divs; d++) {
            let i0 = d*divs
            let iEnd = d*divs + divs-1;

            sphere.triangles.push(new Triangle([iEnd, i0+divs, i0], GREEN));
            sphere.triangles.push(new Triangle([iEnd, iEnd+divs, i0+divs], GREEN));
        }

        sphere.renderType = SHADED;

        return sphere;
}


/** Currently unused. Used for memes */
/*
let Pyramid = (texture) => {
    let pyramid = new Model();

    pyramid.vertices = [];

    pyramid.vertices.push(new Vertex(0,1,0))   //0
    pyramid.vertices.push(new Vertex(-1,-1,1)) //1
    pyramid.vertices.push(new Vertex(1,-1,1))  //2
    pyramid.vertices.push(new Vertex(-1,-1,-1))//3    
    pyramid.vertices.push(new Vertex(1,-1,-1)) //4

    pyramid.triangles = [];

    //Sides
    pyramid.triangles.push(new Triangle([2,0,1],CYAN,texture,[[0,1],[0.5,0],[1,1]]))
    pyramid.triangles.push(new Triangle([1,0,3],CYAN,texture,[[0,1],[0.5,0],[1,1]]))
    pyramid.triangles.push(new Triangle([3,0,4],CYAN,texture,[[0,1],[0.5,0],[1,1]]))
    pyramid.triangles.push(new Triangle([4,0,2],CYAN,texture,[[0,1],[0.5,0],[1,1]]))

    //Base
    pyramid.triangles.push(new Triangle([1,3,4],CYAN));
    pyramid.triangles.push(new Triangle([1,4,2],CYAN));

    pyramid.renderType = TEXTURED;

    return pyramid;
}
*/
/** Currently unused. Used to test sophisticated meshes */
/*let Thing = () => {
    let thing = new Model();

    thing.vertices = [];

    thing.vertices.push(new Vertex(1,1,1))
    thing.vertices.push(new Vertex(-1,1,1))
    thing.vertices.push(new Vertex(-2,-3,1))
    thing.vertices.push(new Vertex(1,-1,3))
    thing.vertices.push(new Vertex(1,1,-1))
    thing.vertices.push(new Vertex(-1,3,-1))
    thing.vertices.push(new Vertex(-1,-1,-1))
    thing.vertices.push(new Vertex(1,-0.5,-1))

    thing.triangles = [];

    thing.triangles.push(new Triangle([0,1,2],RED))
    thing.triangles.push(new Triangle([0,2,3],RED))
    thing.triangles.push(new Triangle([4,0,3],GREEN))
    thing.triangles.push(new Triangle([4,3,7],GREEN))
    thing.triangles.push(new Triangle([5,4,7],BLUE))
    thing.triangles.push(new Triangle([5,7,6],BLUE))
    thing.triangles.push(new Triangle([1,5,6],YELLOW))
    thing.triangles.push(new Triangle([1,6,2],YELLOW))
    thing.triangles.push(new Triangle([4,5,1],PURPLE))
    thing.triangles.push(new Triangle([4,1,0],PURPLE))
    thing.triangles.push(new Triangle([2,6,7],CYAN))
    thing.triangles.push(new Triangle([2,7,3],CYAN))

    return thing;
}*/

export { Cube, TexturedCube, Sphere }