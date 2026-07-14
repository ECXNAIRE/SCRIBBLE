import { selectionBox } from "./handle&selectionbox.js";
import { distanceToLine, lineSelectionBox } from "./lineTools.js";


export function drawRectangle2(shape, ctx) {
    ctx.beginPath();

    roughLine(
        ctx,
        shape.x,
        shape.y,
        shape.x + shape.width,
        shape.y
    );

    roughLine(
        ctx,
        shape.x + shape.width,
        shape.y,
        shape.x + shape.width,
        shape.y + shape.height
    );

    roughLine(
        ctx,
        shape.x + shape.width,
        shape.y + shape.height,
        shape.x,
        shape.y + shape.height
    );

    roughLine(
        ctx,
        shape.x,
        shape.y + shape.height,
        shape.x,
        shape.y
    );

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();


    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

    ctx.stroke();
}







//HELPER FUNCTION 
function randomOffset(amount) {
    return (Math.random() - 0.5) * amount * 2;
}


function roughLine(ctx, x1, y1, x2, y2) {

    for (let pass = 0; pass < 2; pass++) {

        ctx.beginPath();

        ctx.moveTo(
            x1 + randomOffset(1.5),
            y1 + randomOffset(1.5)
        );

        const steps = 8;

        for (let i = 1; i <= steps; i++) {

            const t = i / steps;

            const x =
                x1 + (x2 - x1) * t +
                randomOffset(1.2);

            const y =
                y1 + (y2 - y1) * t +
                randomOffset(1.2);

            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }
}