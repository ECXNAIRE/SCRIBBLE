export function selectionBox(rect, ctx) {
    const padding = 6
    const handleSize = 8

    const left = Math.min(rect.x, rect.x + rect.width) - padding
    const top = Math.min(rect.y, rect.y + rect.height) - padding

    const width = Math.abs(rect.width) + padding * 2
    const height = Math.abs(rect.height) + padding * 2

    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top, width, height);


    ctx.fillStyle = "#FFFFFF"
    ctx.strokeStyle = "#3B82F6"

    drawHandle(left, top, handleSize, ctx)
    drawHandle(left + width, top, handleSize, ctx)
    drawHandle(left, top + height, handleSize, ctx)
    drawHandle(left + width, top + height, handleSize, ctx)
    drawHandle(left + width / 2, top, handleSize, ctx)
    drawHandle(left, top + height / 2, handleSize, ctx)
    drawHandle(left + width, top + height / 2, handleSize, ctx)
    drawHandle(left + width / 2, top + height, handleSize, ctx)

}



export function drawHandle(x, y, size, ctx) {
    ctx.beginPath();
    ctx.rect(
        x - size / 2,
        y - size / 2,
        size,
        size
    )

    ctx.fill();
    ctx.stroke()
}