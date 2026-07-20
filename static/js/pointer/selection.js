export function selectionBox(rect, ctx) {
    ctx.save()
    const padding = 6
    const handleSize = 10

    const left = Math.min(rect.x, rect.x + rect.width) - padding
    const top = Math.min(rect.y, rect.y + rect.height) - padding

    const width = Math.abs(rect.width) + padding * 2
    const height = Math.abs(rect.height) + padding * 2

    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(left, top, width, height);


    ctx.fillStyle = "#FFFFFF"
    ctx.shadowColor = "rgba(0,0,0,.15)";
    ctx.strokeStyle = "#3B82F6"
    ctx.shadowBlur = 3;

    drawHandle(left, top, handleSize, ctx)
    drawHandle(left + width, top, handleSize, ctx)
    drawHandle(left, top + height, handleSize, ctx)
    drawHandle(left + width, top + height, handleSize, ctx)
    drawHandle(left + width / 2, top, handleSize, ctx)
    drawHandle(left, top + height / 2, handleSize, ctx)
    drawHandle(left + width, top + height / 2, handleSize, ctx)
    drawHandle(left + width / 2, top + height, handleSize, ctx)


    ctx.restore()

}


export function textSelectionBox(shape, ctx) {
    ctx.save() 

    const padding = 6
    const handleSize = 10

    const left = shape.x - padding
    const top = shape.y - padding

    const width = shape.width + padding * 2
    const height = shape.height + padding * 2


    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(left, top, width, height);

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#3B82F6";
    ctx.shadowColor = "rgba(0,0,0,.15)";
    ctx.shadowBlur = 3;



    drawHandle(left, top, handleSize, ctx);                    
    drawHandle(left + width, top, handleSize, ctx);            
    drawHandle(left, top + height, handleSize, ctx);           
    drawHandle(left + width, top + height, handleSize, ctx);  


    ctx.restore()
}

export function drawHandle(x, y, size, ctx) {
    ctx.beginPath();
    ctx.arc(
        x,
        y,
        size / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();
    ctx.stroke()
}