import { selectionBox } from "./handle&selectionbox.js";

//RECTANGLE
export function drawRectangle(shape, ctx) {
    ctx.beginPath();

    ctx.rect(
        shape.x,
        shape.y,
        shape.width,
        shape.height
    );

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();


    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

    ctx.stroke();
}




//ELLIPSE
export function drawEllipse (shape,ctx) {
    ctx.beginPath();

    ctx.ellipse(
        shape.x + shape.width / 2,
        shape.y + shape.height / 2,

        Math.abs(shape.width / 2),
        Math.abs(shape.height / 2),

        0,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    if(shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }


    ctx.stroke()
}
