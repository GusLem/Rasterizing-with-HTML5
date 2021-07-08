//Canvas dimensions
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

//Canvas Setup
let canvas = document.getElementById("canvas");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let canvas_context = canvas.getContext("2d");
let canvas_buffer = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
let canvas_pitch = canvas_buffer.width * 4;

//Canvas Handling
let PutPixel = (x, y, color) => {
    x = canvas.width/2 + (Math.trunc(x));
    y = canvas.height/2 - (Math.trunc(y)) - 1;
  
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      return;
    }
  
    let offset = 4*x + canvas_pitch*y;
    canvas_buffer.data[offset++] = color[0];
    canvas_buffer.data[offset++] = color[1];
    canvas_buffer.data[offset++] = color[2];
    canvas_buffer.data[offset++] = 255; // Alpha = 255 (full opacity)
  }
  
let UpdateCanvas = () => {
    canvas_context.putImageData(canvas_buffer, 0, 0);
    ClearCanvas();
}
  
let ClearCanvas = () => {
    for (let i = -canvas.width/2; i <= canvas.width/2; i++) {
        for (let j = -canvas.width/2; j <= canvas.width/2; j++) {
            PutPixel(i,j,[0,0,0]);
        } 
    }
}

export {CANVAS_WIDTH, CANVAS_HEIGHT, PutPixel, UpdateCanvas }