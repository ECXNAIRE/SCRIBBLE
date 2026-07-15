import { roughLine } from "./roughness.js";


export function drawHachure(ctx, pathFunction, shape, sloppiness) {
    const spacing = 20

    ctx.save()

    pathFunction();

    ctx.clip()

    ctx.beginPath()

    ctx.strokeStyle = shape.fillColor


    const left = Math.min(shape.x, shape.x + shape.width)
    const right = Math.max(shape.x, shape.x + shape.width)
    const top = Math.min(shape.y, shape.y + shape.height)
    const bottom = Math.max(shape.y, shape.y + shape.height)

    const diagonal = Math.max(right - left, bottom - top) * 2

    for (let y = shape.y - shape.height; y < shape.y + shape.height; y += spacing) {
        ctx.moveTo(left - diagonal, y)
        ctx.lineTo(left + diagonal, y + diagonal)
    }

    ctx.stroke()
    ctx.restore()
}