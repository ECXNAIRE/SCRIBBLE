import { drawHandle } from "./handle&selectionbox.js"

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

    return Math.hypot(dx * dx + dy * dy)
}


export function lineSelectionBox(shape, ctx) {
    const handleSize = 8
    const padding = 6

    const left = Math.min(shape.x1, shape.x2)
    const right = Math.max(shape.x1, shape.x2)

    const top = Math.min(shape.y1, shape.y2)
    const bottom = Math.max(shape.y1, shape.y2)
    
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])

    ctx.strokeRect(
        left - padding,
        top - padding,
        right - left + padding * 2,
        bottom - top + padding * 2
    );

    ctx.setLineDash([]);



    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1;

    drawHandle(shape.x1, shape.y1, handleSize, ctx)
    drawHandle(shape.x2, shape.y2, handleSize, ctx)
}