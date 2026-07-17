
export function drawGrid(ctx, canvas, camera) {
    const gridSize = 50

    ctx.save()

    ctx.strokeStyle = "#E8EEF5"
    ctx.lineWidth = 0.5 / camera.zoom

    const startX = Math.floor(camera.x / gridSize) * gridSize 
    const  startY = Math.floor(camera.y / gridSize) * gridSize


    const endX = camera.x + canvas.width / camera.zoom
    const endY = camera.y + canvas.height / camera.zoom

    for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, camera.y);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }


    for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(camera.x, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }


    ctx.restore();
}