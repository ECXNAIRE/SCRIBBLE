import { state } from "../state.js";
import { drawEllipse, drawRectangle, drawLine, drawDiamond, drawTriangle, drawArrow, drawPencil, drawText } from "../toolBarTop/shapes.js"



export function drawShape(shape, ctx) {
    if (!shape) return;
    switch (shape.type) {
        case "rectangle":
            if (shape.selectedStroke === "stroke1") {
                drawRectangle(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke2") {
                drawRectangle(shape, ctx, 1.5)
            } else if (shape.selectedStroke === "stroke3") {
                drawRectangle(shape, ctx, 3)
            }
            break

        case "ellipse":
            if (shape.selectedStroke === "stroke1") {
                drawEllipse(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke2") {
                drawEllipse(shape, ctx, 1.5)
            } else if (shape.selectedStroke === "stroke3") {
                drawEllipse(shape, ctx, 3)
            }
            break

        case "line":
            if (shape.selectedStroke === "stroke1") {
                drawLine(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke2") {
                drawLine(shape, ctx, 1.5)
            } else if (shape.selectedStroke === "stroke3") {
                drawLine(shape, ctx, 3)
            }
            break

        case "diamond":
            if (shape.selectedStroke === "stroke1") {
                drawDiamond(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke2") {
                drawDiamond(shape, ctx, 1.5)
            } else if (shape.selectedStroke === "stroke3") {
                drawDiamond(shape, ctx, 3)
            }
            break

        case "triangle":
            if (shape.selectedStroke === "stroke1") {
                drawTriangle(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke2") {
                drawTriangle(shape, ctx, 1.5)
            } else if (shape.selectedStroke === "stroke3") {
                drawTriangle(shape, ctx, 3)
            }
            break

        case "arrow":
            if (shape.selectedStroke === "stroke1") {
                drawArrow(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke2") {
                drawArrow(shape, ctx, 1.5)
            } else if (shape.selectedStroke === "stroke3") {
                drawArrow(shape, ctx, 3)
            }
            break

        case "pencil":
            if (shape.selectedStroke === "stroke1") {
                drawPencil(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke2") {
                drawPencil(shape, ctx, 0)
            } else if (shape.selectedStroke === "stroke3") {
                drawPencil(shape, ctx, 0)
            }
            break


        case "text":
            if (!shape.editMode) {
                drawText(shape, ctx)
            }
    }


}
