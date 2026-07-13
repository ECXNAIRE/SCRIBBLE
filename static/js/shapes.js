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
export function drawEllipse(shape, ctx) {
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

    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }


    ctx.stroke()
}




//line
export function drawLine(shape, ctx) {
    ctx.beginPath();


    ctx.moveTo(shape.x1, shape.y1)
    ctx.lineTo(shape.x2, shape.y2)

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (shape.selected && shape.editMode) {
        selectionBox({
            x: Math.min(shape.x1, shape.x2),
            y: Math.min(shape.y1, shape.y2),
            width: Math.abs(shape.x2 - shape.x1),
            height: Math.abs(shape.y2 - shape.y1)
        }, ctx)
    }

    ctx.stroke()
}