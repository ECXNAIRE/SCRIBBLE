import { drawHandle } from "../pointer/selection.js"

export function distanceToLine(px, py, x1, y1, x2, y2) {
    const a = px - x1
    const b = py - y1
    const c = x2 - x1
    const d = y2 - y1


    const lenSq = c * c + d * d

    if (lenSq === 0) {
        return Math.hypot(px - x1, py - y1)
    }


    const dot = a * c + b * d

    let t = dot / lenSq


    t = Math.max(0, Math.min(1, t))


    const closestX = x1 + t * c
    const closestY = y1 + t * d

    const dx = px - closestX
    const dy = py - closestY

    return Math.sqrt(dx * dx + dy * dy)
}


export function lineSelectionBox(shape, ctx) {
    const handleSize = 8
    const padding = 9

    const left = Math.min(shape.x1, shape.x2)
    const right = Math.max(shape.x1, shape.x2)

    const top = Math.min(shape.y1, shape.y2)
    const bottom = Math.max(shape.y1, shape.y2)


    const cx = (shape.x1 + shape.x2) / 2
    const cy = (shape.y1 + shape.y2) / 2

    const angle = Math.atan2(
        shape.y2 - shape.y1,
        shape.x2 - shape.x1
    )

    const length = Math.hypot(
        shape.x2 - shape.x1,
        shape.y2 - shape.y1
    );




    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)

    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 1

    ctx.strokeRect(
        -length / 2 - padding,
        -padding,
        length + padding * 2,
        padding * 2
    );

    ctx.restore()



    const dx = shape.x2 - shape.x1;
    const dy = shape.y2 - shape.y1;

    const len = Math.hypot(dx, dy);

    const ux = dx / len;
    const uy = dy / len;

    const offset = -9;


    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1;


    drawHandle(
        shape.x1 + ux * offset,
        shape.y1 + uy * offset,
        handleSize,
        ctx
    );

    drawHandle(
        shape.x2 - ux * offset,
        shape.y2 - uy * offset,
        handleSize,
        ctx
    );
}