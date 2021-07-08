import { Texture, Instance } from "./modules/Classes.js"
import { Cube, TexturedCube, Sphere } from "./modules/Models.js"
import { RenderInstance } from "./modules/Render.js"
import { WIREFRAME } from "./modules/renderTypes.js"
import { ResetBuffer } from "./modules/DepthBuffer.js"
import { UpdateCanvas } from "./modules/Canvas.js"

//Render
let Render = () => {
    
    ResetBuffer();

    instances.forEach(inst => {
        RenderInstance(inst,inst.transform)
    });
    
    UpdateCanvas();
}

let rotation = 0

//Animate
let Animate = () => {
    requestAnimationFrame( Animate )

    rotation+=2
    
    wBox.rot = rotation
    tBox.rot = -rotation
    Box.rot = rotation
    planet.rot = rotation/3

    Render();
}

//Main Code
let cube            = Cube();
let wireFrameCube   = Cube();
let sphere          = Sphere(16)
let tCube           = TexturedCube(new Texture("crate.png"));

wireFrameCube.renderType = WIREFRAME

let wBox = new Instance(wireFrameCube,[-1.5,1.5,7],30,0.8);
let Box = new Instance(cube,[1.5,1.5,7],30,0.8);
let planet = new Instance(sphere,[-1.5,-1.5,7],0,0.8);
let tBox = new Instance(tCube,[1.5,-1.5,7],60,0.8);

let instances = [wBox,tBox,Box,planet]

window.addEventListener('load', (event) => {
    Render(0);
    Animate();
});




 