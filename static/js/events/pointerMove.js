import { state } from "../state.js";
import { screenToWorld } from "../canvas/cameraFunction.js ";
import { updateCursor } from "../canvas/overlayCanvasFn.js";
import { scheduleRender } from "../helpers/scheduleRender.js";
import { getClickedShape, getClickedHandle } from "../pointer/hitTest.js";
import { resizeShape } from "../pointer/resize.js";
import { renderCurrentShape } from "../canvas/renderCurrentShape.js";
import { camera } from "../canvas/cameraFunction.js";






export function mouseMove(e, canvas, render) {
    if (state.isPanning) {
        canvas.style.cursor = "grabbing";

        const dx = e.offsetX - state.panStartX;
        const dy = e.offsetY - state.panStartY;



        const panSpeed = 1;

        camera.x -= dx * panSpeed / camera.zoom;
        camera.y -= dy * panSpeed / camera.zoom;

        state.panStartX = e.offsetX;
        state.panStartY = e.offsetY;

        scheduleRender(render)
        return;
    }

    const mouse = screenToWorld(e.offsetX, e.offsetY, camera);
    state.cursorX = e.offsetX;
    state.cursorY = e.offsetY;

    updateCursor(state.tool, state.cursorX, state.cursorY, state.selectedStrokeWidth)

    if (state.tool === "pencil" || state.tool === "eraser") {
        canvas.style.cursor = "none";
        scheduleRender(render)
    }

    if (state.tool == "eraser" && state.isErasing) {
        const hoveredShape = getClickedShape(mouse.x, mouse.y)

        if (hoveredShape) {
            const index = state.objects.indexOf(hoveredShape);

            if (!(index < 0)) {
                state.objects.splice(index, 1);
                scheduleRender(render)
            }

        }

        return
    }

    if (state.tool === "hand") {
        if (state.isPanning) {
            canvas.style.cursor = "grabbing";
        } else {
            canvas.style.cursor = "grab";
        }
    }
    if (state.tool === "pointer") {
        const hoveredShape = getClickedShape(mouse.x, mouse.y)
        const hoveredHandle = hoveredShape
            ? getClickedHandle(hoveredShape, mouse.x, mouse.y)
            : null

        if (hoveredHandle || state.isResizing) {
            switch (hoveredHandle) {
                case "n":
                    canvas.style.cursor = "n-resize";
                    break;

                case "ne":
                    canvas.style.cursor = "ne-resize";
                    break;

                case "e":
                    canvas.style.cursor = "e-resize";
                    break;

                case "se":
                    canvas.style.cursor = "se-resize";
                    break;

                case "s":
                    canvas.style.cursor = "s-resize";
                    break;

                case "sw":
                    canvas.style.cursor = "sw-resize";
                    break;

                case "w":
                    canvas.style.cursor = "w-resize";
                    break;

                case "nw":
                    canvas.style.cursor = "nw-resize";
                    break;

            }
        } else if (hoveredShape) {
            canvas.style.cursor = "grab"
        } else (
            canvas.style.cursor = "default"
        )
    }


    if (state.isDrawing && state.tool !== 'pencil' && state.tool !== "hand") {
        canvas.style.cursor = "crosshair"
    }

    if (state.isResizing) {
        if (state.selectedShape.type === "line" || state.selectedShape.type === "arrow") {
            if (state.resizeHandle === "start") {
                state.selectedShape.x1 = mouse.x;
                state.selectedShape.y1 = mouse.y;
            }

            if (state.resizeHandle === "end") {
                state.selectedShape.x2 = mouse.x;
                state.selectedShape.y2 = mouse.y;
            }
        } else {
            resizeShape(state.selectedShape, state.resizeHandle, mouse.x, mouse.y);
        }

        scheduleRender(render)
        return;
    }

    if (state.isDragging) {
        canvas.style.cursor = "grabbing"
        if (state.dragShape.type === "line" || state.dragShape.type === "arrow") {
            const dx = mouse.x - state.dragOffsetX
            const dy = mouse.y - state.dragOffsetY

           state.dragShape.x1 += dx
            state.dragShape.y1 += dy
            state.dragShape.x2 += dx
            state.dragShape.y2 += dy


            state.dragOffsetX = mouse.x
            state.dragOffsetY = mouse.y
        } else {
            state.dragShape.x = mouse.x - state.dragOffsetX
            state.dragShape.y = mouse.y - state.dragOffsetY
        }

        scheduleRender(render)
        return
    }

    if (state.tool !== "pointer" && state.tool !== "pencil" && state.tool !== "undo" && state.tool !== "redo" && state.tool !== "download" && state.tool !== "setting" && state.tool !== "eraser" && state.tool !== "hand") {
        canvas.style.cursor = "crosshair"
    }


    if (!state.isDrawing) return

    if (state.tool === "rectangle" || state.tool === "circle" || state.tool === "diamond" || state.tool === "triangle") {

        let width = mouse.x - state.startX
        let height = mouse.y - state.startY

        if (state.shiftPressed) {
            let size = Math.max(Math.abs(width), Math.abs(height))

            width = width < 0 ? -size : size
            height = height < 0 ? -size : size
        }

        state.currentShape.width = width
        state.currentShape.height = height
    }

    if (state.tool === "line" || state.tool === "arrow") {
        state.currentShape.x2 = mouse.x
        state.currentShape.y2 = mouse.y
    }

    if (state.tool === "pencil") {

        const last = state.currentShape.points[state.currentShape.points.length - 1]
        let smoothPressure
        let x = mouse.x;
        let y = mouse.y;

        if (last) {
            const dx = mouse.x - last.x
            const dy = mouse.y - last.y
            if (Math.hypot(dx, dy) < 4) {
                return;
            }

            const distance = Math.hypot(dx, dy)
            smoothPressure = last.pressure * 0.65 + e.pressure * 0.35


            x = last.x * 0.3 + mouse.x * 0.7
            y = last.y * 0.3 + mouse.y * 0.7
        } else {
            smoothPressure = e.pressure
        }
        state.currentShape.points.push({
            x,
            y,
            pressure: smoothPressure
        })

        renderCurrentShape()
        return
    }



    renderCurrentShape()
}
