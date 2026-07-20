import { state } from "../state.js";
import { cacheCanvas, cacheCtx } from "./canvas.js";
import { camera } from "./cameraFunction.js";
import { drawShape } from "./drawShapes.js";




export function renderCurrentShape() {
    cacheCtx.setTransform(
        camera.zoom,
        0,
        0,
        camera.zoom,
        -camera.x * camera.zoom,
        -camera.y * camera.zoom
    )

    cacheCtx.clearRect(
        camera.x,
        camera.y,
        cacheCanvas.width / camera.zoom,
        cacheCanvas.height / camera.zoom
    );


    if (state.currentShape) {
        drawShape(state.currentShape, cacheCtx);
    } else if (state.isDragging && state.dragShape) {
        drawShape(state.dragShape, cacheCtx);
    } else if (state.isResizing && state.selectedShape) {
        drawShape(state.selectedShape, cacheCtx);
    }

    cacheCtx.setTransform(1, 0, 0, 1, 0, 0);
}