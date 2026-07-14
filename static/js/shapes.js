import { selectionBox } from "./handle&selectionbox.js";
import { distanceToLine, lineSelectionBox } from "./lineTools.js";
import { roughLine } from "./roughness.js";

//RECTANGLE

export function drawRectangle(shape, ctx, sloppiness) {
    ctx.beginPath();

    roughLine(
        ctx,
        shape.x,
        shape.y,
        shape.x + shape.width,
        shape.y,
        shape,
        sloppiness
    );

    roughLine(
        ctx,
        shape.x + shape.width,
        shape.y,
        shape.x + shape.width,
        shape.y + shape.height,
        shape,
        sloppiness
    );

    roughLine(
        ctx,
        shape.x + shape.width,
        shape.y + shape.height,
        shape.x,
        shape.y + shape.height,
        shape,
        sloppiness
    );

    roughLine(
        ctx,
        shape.x,
        shape.y + shape.height,
        shape.x,
        shape.y,
        shape,
        sloppiness
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
export function drawLine(shape, ctx, sloppiness) {
    ctx.beginPath();


    roughLine(
        ctx,
        shape.x1,
        shape.y1,
        shape.x2,
        shape.y2,
        shape,
        sloppiness
    );

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (shape.selected && shape.editMode) {
        lineSelectionBox(shape, ctx)
    }

    ctx.stroke()
}



//DIAMOND

export function drawDiamond(shape, ctx, sloppiness) {
    ctx.beginPath();

    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2


    const top = { x: cx, y: shape.y }
    const right = { x: shape.x + shape.width, y: cy }
    const bottom = { x: cx, y: shape.y + shape.height }
    const left = { x: shape.x, y: cy }


    roughLine(
        ctx,
        top.x,
        top.y,
        right.x,
        right.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx, 
        right.x,
        right.y,
        bottom.x,
        bottom.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx, 
        bottom.x,
        bottom.y,
        left.x,
        left.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx,
        left.x,
        left.y,
        top.x,
        top.y,
        shape,
        sloppiness
    )

    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

}



///TRIANGLE

export function drawTriangle(shape, ctx, sloppiness) {
    ctx.beginPath()


    const top = {x: shape.x + shape.width / 2, y: shape.y}
    const right = {x: shape.x + shape.width, y: shape.y + shape.height}
    const left = {x: shape.x, y: shape.y + shape.height}



    roughLine(
        ctx, 
        top.x,
        top.y,
        right.x,
        right.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx,
        right.x,
        right.y,
        left.x,
        left.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx,
        left.x,
        left.y,
        top.x,
        top.y,
        shape,
        sloppiness
    )
    


    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }
}






export function drawArrow(shape, ctx, sloppiness) {
    const { x1, y1, x2, y2 } = shape

    const headLength = 15

    const angle = Math.atan2(y2 - y1, x2 - x1)


    roughLine(
        ctx,
        x1,
        y1,
        x2,
        y2,
        shape,
        sloppiness
    );


    const leftX = x2 - headLength * Math.cos(angle - Math.PI / 6)
    const leftY = y2 - headLength * Math.sin(angle - Math.PI / 6)

    const rightX = x2 - headLength * Math.cos(angle + Math.PI / 6)
    const rightY = y2 - headLength * Math.sin(angle + Math.PI / 6)

    roughLine(
        ctx,
        x2,
        y2,
        leftX,
        leftY,
        shape,
        sloppiness
    );

    roughLine(
        ctx,
        x2,
        y2,
        rightX,
        rightY,
        shape,
        sloppiness
    );


    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.stroke();


    if (shape.selected && shape.editMode) {
        lineSelectionBox(shape, ctx)
    }
}

