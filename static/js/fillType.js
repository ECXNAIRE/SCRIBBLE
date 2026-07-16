import { roughLine, randomOffset } from "./roughness.js";


export function drawHachure(ctx, pathFunction, bounds, shape, sloppiness) {
    const spacing = 20

    ctx.save()

    pathFunction();

    ctx.clip()
    ctx.strokeStyle = shape.fillColor


    const left = Math.min(shape.x, shape.x + shape.width)
    const right = Math.max(shape.x, shape.x + shape.width)
    const top = Math.min(shape.y, shape.y + shape.height)
    const bottom = Math.max(shape.y, shape.y + shape.height)

    const diagonal = Math.max(right - left, bottom - top)

    for (let i = 0, y = top - diagonal; y < bottom + diagonal; y += spacing, i++) {

        const lineSeed = shape.seed + Math.floor(y / spacing) * 1000;

        const angleFactor = 1.3;


        roughLine(
            ctx,
            left - diagonal,
            y,
            right + diagonal,
            y + diagonal * angleFactor,
            {
                ...shape,
                seed: lineSeed,
                strokeColor: shape.fillColor,
                strokeWidth: shape.strokeWidth - (( shape.strokeWidth * 50) / 100)
            },
            sloppiness
        );
    }

    ctx.stroke()
    ctx.restore()
}