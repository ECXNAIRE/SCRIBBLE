import { state } from "../state.js";
import { saveState } from "../toolBarTop/history.js";
import { cacheCtx, canvas, cacheCanvas } from "../canvas/canvas.js";
import { scheduleRender } from "../helpers/scheduleRender.js";

export function mouseUp(e, render) {
    canvas.releasePointerCapture(e.pointerId);

    if (state.isPanning) {
        state.isPanning = false;
        canvas.style.cursor = "grab";
        return;
    }

    if (state.isResizing) {
        state.isResizing = false;
        state.resizeHandle = null;
        canvas.style.cursor = "default";
        return
    }

    if (state.isDragging) {
        state.isDragging = false;
        state.dragShape = null
        return
    }

    if (state.isErasing) {
        state.isErasing = false
        return
    }



    if (!state.isDrawing) return

    saveState(state.objects)

    state.isDrawing = false

    state.objects.push(state.currentShape)
    cacheCtx.clearRect(
        0, 0, cacheCanvas.width, cacheCanvas.height
    )
    state.currentShape = null

    scheduleRender(render)
}





