export function drawGrid(ctx, canvas) {
    const cells = 9;
    const gridSize = Math.min(canvas.width, canvas.height) / cells;

    ctx.save()
    ctx.strokeStyle = "#E8EEF5"
    ctx.lineWidth = 0.5


    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
    }


    for (let y = 0; y <= canvas.width; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
    }

    ctx.restore()
}