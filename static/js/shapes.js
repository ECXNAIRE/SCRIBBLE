import { selectionBox } from "./handle&selectionbox.js";
import { distanceToLine, lineSelectionBox } from "./lineTools.js";
import { roughEllipse, roughLine } from "./roughness.js";
import { drawHachure } from "./fillType.js";

//RECTANGLE

export function drawRectangle(shape, ctx, sloppiness) {

    if (shape.fill) {
        if (shape.fillType === "solid") {
            ctx.fillStyle = shape.fillColor;
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        } else if(shape.fillType === "hachure") {
            drawHachure(ctx, ()=> {
                ctx.beginPath();
                ctx.rect(shape.x, shape.y, shape.width, shape.height)
            }, shape)
        }
    }
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

    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

    ctx.restore()

}









//ELLIPSE
export function drawEllipse(shape, ctx, sloppiness) {

    if (sloppiness === 0) {
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

        if (shape.fill) {
            if (shape.fillType === "solid") {
                ctx.fillStyle = shape.fillColor;
                ctx.fill();
            }
        }

        ctx.strokeStyle = shape.strokeColor
        ctx.lineWidth = shape.strokeWidth
        ctx.stroke()
    } else roughEllipse(ctx, shape, sloppiness)

    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

    ctx.restore()
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

    if (shape.selected && shape.editMode) {
        lineSelectionBox(shape, ctx)
    }

    ctx.restore()
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

    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath();

    if (shape.fill) {
        if (shape.fillType === "solid") {
            ctx.fillStyle = shape.fillColor;
            ctx.fill();
        }
    }


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
    ctx.restore()
}



///TRIANGLE

export function drawTriangle(shape, ctx, sloppiness) {

    ctx.beginPath()


    const top = { x: shape.x + shape.width / 2, y: shape.y }
    const right = { x: shape.x + shape.width, y: shape.y + shape.height }
    const left = { x: shape.x, y: shape.y + shape.height }

    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath()

    if (shape.fill) {
        if (shape.fillType === "solid") {
            ctx.fillStyle = shape.fillColor;
            ctx.fill();
        }
    }


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

    ctx.restore()
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


    if (shape.selected && shape.editMode) {
        lineSelectionBox(shape, ctx)
    }

    ctx.restore()
}




export function drawPencil(shape, ctx, sloppiness) {

    for (let i = 1; i < shape.points.length; i++) {
        roughLine(
            ctx,
            shape.points[i - 1].x,
            shape.points[i - 1].y,
            shape.points[i].x,
            shape.points[i].y,
            shape,
            sloppiness
        );
    }
}