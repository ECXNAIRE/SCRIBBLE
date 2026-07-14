import { selectionBox } from "./handle&selectionbox.js";
import { distanceToLine, lineSelectionBox } from "./lineTools.js";

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
        lineSelectionBox(shape, ctx)
    }

    ctx.stroke()
}



//DIAMOND

export function drawDiamond(shape, ctx){
    ctx.beginPath();

    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2
    

    ctx.moveTo(cx, shape.y)
    ctx.lineTo(shape.x + shape.width, cy)
    ctx.lineTo(cx, shape.y + shape.height)
    ctx.lineTo(shape.x, cy)


    ctx.closePath()
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();


    if(shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

}



///TRIANGLE

export function drawTriangle(shape, ctx) {
    ctx.beginPath()


    const cx = shape.x + shape.width / 2

    ctx.moveTo(cx, shape.y)

    ctx.lineTo(shape.x + shape.width, shape.y + shape.height)

    ctx.lineTo(shape.x, shape.y + shape.height)


    ctx.closePath()


    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.stroke()


    if(shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }
}






export function drawArrow(shape, ctx) {
    const { x1, y1, x2, y2 } = shape

    const headLength = 15

    const angle = Math.atan2(y2 - y1, x2 - x1)

    ctx.beginPath()


    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)


    ctx.moveTo(x2, y2)
    ctx.lineTo(
        x2 - headLength * Math.cos(angle - Math.PI / 6),
        y2 - headLength * Math.sin(angle - Math.PI / 6)
    )



    ctx.moveTo(x2, y2)
    ctx.lineTo(
        x2 - headLength * Math.cos(angle + Math.PI / 6),
        y2 - headLength * Math.sin(angle + Math.PI / 6)
    )

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.stroke();


    if(shape.selected && shape.editMode) {
        lineSelectionBox(shape, ctx)
    }
}

