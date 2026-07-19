import { drawEllipse, drawRectangle, drawLine, drawDiamond, drawTriangle, drawArrow, drawPencil, drawText } from "./toolBarTop/shapes.js"
import { Path, drawPath } from "./helpers/pathArch.js"
import { distanceToLine } from "./helpers/lineTools.js"
import { selectionBox } from "./helpers/handle&selectionbox.js"
import { drawGrid } from "./canvas/grid.js"
import { overlayCanvas, drawBrushCursor, updateCursor, overlayCtx, setCursorVisible } from "./canvas/overlayCanvas.js"
import { screenToWorld } from "./canvas/cameraFunction.js"
import { startTextEditing } from "./toolBarTop/shapes.js"
import { updateToolBar } from "./leftToolBar/updateToolBar.js"
import { setLayerOption } from "./leftToolBar/updateToolBar.js"
import { undo, redo, saveState } from "./toolBarTop/history.js"
import { scheduleRender } from "./helpers/scheduleRender.js"
import { renderState } from "./helpers/renderstate.js"
import { setupClipbaord } from "./keyboardFunctions/clipboard.js"
import { state } from "./state.js"


const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const canvasArea = document.getElementById("canvasArea")
const cacheCanvas = document.getElementById("cacheCanvas")
const cacheCtx = cacheCanvas.getContext("2d")


const camera = {
    x: 0,
    y: 0,
    zoom: 1
}


canvas.addEventListener("pointerenter", () => {
    setCursorVisible(true)
})

canvas.addEventListener("pointerleave", () => {
    setCursorVisible(false)

    scheduleRender(render)
})



document.querySelectorAll(".pressureBtn").forEach(button => {
    button.addEventListener("click", () => {
        state.pressure = button.dataset.pressure

        document
            .querySelector(".pressureBtn.active")
            ?.classList.remove("active")

        button.classList.add("active")
    })
})


document.querySelectorAll(".fontStyleBtn").forEach(button => {
    button.addEventListener("click", () => {
        state.selectedFont = button.dataset.fontstyle

        document
            .querySelector(".fontStyleBtn.active")
            ?.classList.remove("active")

        button.classList.add("active")

    })
})
const zoomInBtn = document.getElementById("zoomInBtn")
const zoomValue = document.getElementById("zoomValue")
const zoomOutBtn = document.getElementById("zoomOutBtn")

canvas.addEventListener("wheel", zoomCanvas, { passive: false });

let gridToggleBtn = document.getElementById("gridToggleBtn")

gridToggleBtn.addEventListener("click", () => {
    state.gridToggle = !state.gridToggle;

    if (state.gridToggle) {
        gridToggleBtn.classList.add("active");
    } else {
        gridToggleBtn.classList.remove("active");
    }

    scheduleRender(render)
});

document.querySelectorAll(".layerToggleBtn").forEach(button => {
    button.addEventListener("click", () => {
        const doFunction = button.dataset.function
        const index = state.objects.indexOf(state.selectedShape)

        if (index < 0) return


        if (doFunction === "top") {
            state.objects.splice(index, 1)
            state.objects.push(state.selectedShape)

        } else if (doFunction === "up") {
            if (index < state.objects.length - 1) {
                [state.objects[index], state.objects[index + 1]] =
                    [state.objects[index + 1], state.objects[index]];
            }

        } else if (doFunction === "down") {
            if (index > 0) {
                [state.objects[index], state.objects[index - 1]] =
                    [state.objects[index - 1], state.objects[index]];
            }

        } else if (doFunction === "bottom") {
            state.objects.splice(index, 1);
            state.objects.unshift(state.selectedShape);

        }


        scheduleRender(render)
    })
})


document.querySelectorAll(".edgeStyleBtn").forEach(button => {
    button.addEventListener("click", () => {
        state.edgeStyle = Number(button.dataset.edgestyle)
        document
            .querySelector(".edgeStyleBtn.active")
            ?.classList.remove("active")

        button.classList.add("active")

        if (state.selectedShape) {
            state.selectedShape.edgeStyle = state.edgeStyle
            scheduleRender(render)
        }

    })
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        state.shiftPressed = true
    }
})

window.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
        state.shiftPressed = false
    }
})

document.querySelectorAll(".fillTypeBtn").forEach(button => {
    button.addEventListener("click", () => {

        state.selectedFillType = button.dataset.filltype
        document
            .querySelector(".fillTypeBtn.active")
            ?.classList.remove("active")

        button.classList.add("active")

        if (state) {
            state.selectedShape.fillType = state.selectedFillType
            scheduleRender(render)
        }

    })
})

const strokePicker = document.getElementById("strokeColorPicker")
const fillPicker = document.getElementById("fillColorPicker")
const fillPickerPreview = document.getElementById("fillPickerPreview");
const strokePickerPreview = document.getElementById("strokePickerPreview");

let strokeColor = strokePicker.value;
let fillColor = fillPicker.value;



strokePicker.addEventListener("input", () => {
    strokeColor = strokePicker.value
    strokePickerPreview.style.background = strokeColor;

    document
        .querySelector(".strokeColorBtn.active")
        ?.classList.remove("active");
})


fillPicker.addEventListener("input", () => {
    fillColor = fillPicker.value;

    fillPickerPreview.classList.remove("transparentColor");
    fillPickerPreview.style.background = fillColor;

    document.querySelector(".fillColorBtn.active")
        ?.classList.remove("active");

    if (state.selectedShape) {
        state.selectedShape.fillColor = fillColor;
        scheduleRender(render)
    }
})


document.querySelectorAll(".strokeColorBtn").forEach(button => {
    button.addEventListener("click", () => {
        document
            .querySelector(".strokeColorBtn.active")
            ?.classList.remove("active");

        button.classList.add("active");

        strokeColor = button.dataset.color

        if (state.selectedShape) {
            state.selectedShape.strokeColor = strokeColor;
            scheduleRender(render)
        }

        strokePickerPreview.style.background = strokeColor;
    })
})


document.querySelectorAll(".fillColorBtn").forEach(button => {
    button.addEventListener("click", () => {
        document
            .querySelector(".fillColorBtn.active")
            ?.classList.remove("active");

        button.classList.add("active");

        fillColor = button.dataset.color

        if (fillColor === "transparent") {
            fillPickerPreview.style.removeProperty("background");
            fillPickerPreview.classList.add("transparentColor")
        } else {
            fillPickerPreview.classList.remove("transparentColor");
            fillPickerPreview.style.background = fillColor;
        }

        if (state.selectedShape) {
            state.selectedShape.fillColor = fillColor;
            scheduleRender(render)
        }
    })
})






//RENDER FUNCTION FOR DRAWING 
function render() {
    ctx.setTransform(
        camera.zoom,
        0,
        0,
        camera.zoom,
        -camera.x * camera.zoom,
        -camera.y * camera.zoom
    );

    ctx.clearRect(
        camera.x,
        camera.y,
        canvas.width / camera.zoom,
        canvas.height / camera.zoom
    );


    state.objects.forEach(shape => {
        drawShape(shape, ctx);
    });

    if (state.gridToggle) {
        drawGrid(ctx, canvas, camera);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// RESIXZING CANVAS
function resizeCanvas() {
    canvas.width = canvasArea.clientWidth;
    canvas.height = canvasArea.clientHeight;
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;
    cacheCanvas.width = canvas.width
    cacheCanvas.height = canvas.height

    scheduleRender(render)
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.querySelectorAll(".strokeBtn").forEach(button => {
    button.addEventListener("click", () => {
        state.selectedStroke = button.dataset.stroke

        if (state.selectedShape) {
            state.selectedShape.selectedStroke = state.selectedStroke
            scheduleRender(render)
        }

        document.querySelector(".strokeBtn.active")
            ?.classList.remove("active")

        button.classList.add('active')
    })
})

document.querySelectorAll(".strokeWidthBtn").forEach(button => {
    button.addEventListener("click", () => {
        state.selectedStrokeWidth = Number(button.dataset.strokewidth)

        if (state.selectedShape) {
            state.selectedShape.strokeWidth = state.selectedStrokeWidth
            scheduleRender(render)
        }


        document.querySelector(".strokeWidthBtn.active")
            ?.classList.remove("active")

        button.classList.add("active")
    })
})



//BUTTON CLICK HANDLER
document.querySelectorAll(".toolBarTopBtn").forEach(button => {
    button.addEventListener("click", () => {

        const selectedTool = button.dataset.tool
        updateToolBar(selectedTool)


        if (selectedTool === "undo") {
            undo(state.objects, render);
            return;
        }

        if (selectedTool === "redo") {
            redo(state.objects, render);
            return;
        }

        state.tool = selectedTool

        document
            .querySelector(".toolBarTopBtn.active")
            ?.classList.remove("active");

        button.classList.add("active");
    })

})



//MOUSE HANDLING HERE
canvas.addEventListener("pointerdown", (e) => mouseDown(e, canvas))
canvas.addEventListener("pointerup", mouseUp)
canvas.addEventListener("pointermove", mouseMove)
canvas.addEventListener("dblclick", mouseDoubleClick)
canvas.addEventListener("pointercancel", mouseUp);

function mouseDown(e, canvas) {
    if (state.tool === "hand") {
        state.isPanning = true;

        state.panStartX = e.offsetX;
        state.panStartY = e.offsetY;

        canvas.style.cursor = "grabbing";
        return;
    }
    const mouse = screenToWorld(e.offsetX, e.offsetY, camera);
    canvas.setPointerCapture(e.pointerId);

    if (state.tool === "eraser") {
        saveState(state.objects)
        state.isErasing = true
    }

    if (state.tool === "pointer") {




        state.selectedShape = state.objects.find(shape => shape.selected)

        if (state.selectedShape?.editMode) {
            const handle = getClickedHandle(state.selectedShape, mouse.x, mouse.y)
            if (handle) {
                saveState(state.objects)
                state.isResizing = true

                state.resizeHandle = handle
                state.startX = mouse.x;
                state.startY = mouse.y;

                return;
            }

        }

        const clickedShape = getClickedShape(mouse.x, mouse.y)

        if (clickedShape && clickedShape.type === "text") {
            if (!clickedShape.selected) {
                clickedShape.selected = true;
                state.selectedShape = clickedShape;
                scheduleRender(render)
                return;
            }

        }

        if (clickedShape && !state.isResizing) {
            saveState(state.objects)
            state.isDragging = true
            state.dragShape = clickedShape

            if (clickedShape.type === "line" || clickedShape.type === "arrow") {
                state.dragOffsetX = mouse.x
                state.dragOffsetY = mouse.y
            } else {
                state.dragOffsetX = mouse.x - state.dragShape.x
                state.dragOffsetY = mouse.y - state.dragShape.y
            }

        }



        if (clickedShape) {
            setLayerOption(true)
            updateToolBar(clickedShape.type)

            if (clickedShape !== state.selectedShape) {
                state.objects.forEach(shape => {
                    shape.selected = false,
                        shape.editMode = false
                })


                clickedShape.selected = true;
            }

            state.selectedShape = clickedShape;

        } else {
            state.objects.forEach(shape => {
                shape.selected = false,
                    shape.editMode = false
            });


            state.selectedShape = null
        }

        scheduleRender(render)
    }




    if (state.tool === "rectangle") {
        state.isDrawing = true

        state.currentShape = {
            type: "rectangle",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType,
            edgeStyle: state.edgeStyle
        }
    }

    if (state.tool === "circle") {
        state.isDrawing = true

        state.currentShape = {
            type: "ellipse",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "line") {
        state.isDrawing = true

        state.currentShape = {
            type: "line",
            x1: mouse.x,
            y1: mouse.y,
            x2: mouse.x,
            y2: mouse.y,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "diamond") {
        state.isDrawing = true

        state.currentShape = {
            type: "diamond",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "triangle") {
        state.isDrawing = true

        state.currentShape = {
            type: "triangle",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "arrow") {
        state.isDrawing = true

        state.currentShape = {
            type: "arrow",
            x1: mouse.x,
            y1: mouse.y,
            x2: mouse.x,
            y2: mouse.y,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "pencil") {
        state.isDrawing = true

        state.currentShape = {
            type: "pencil",
            points: [{ x: mouse.x, y: mouse.y, pressure: e.pressure }],
            strokeColor: strokeColor,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType,
            pressureToggle: state.pressure
        }
    }


    if (state.tool === "text") {

        state.currentShape = {
            type: "text",
            x: mouse.x,
            y: mouse.y,
            text: "",
            fontSize: 24,
            fontFamily: state.selectedFont,
            strokeColor: state.strokeColor,
            selected: false,
            editMode: true
        }

        state.objects.push(state.currentShape);
        state.selectedShape = state.currentShape;
        state.currentShape = null;

        startTextEditing(state.selectedShape, camera, ctx, render);
        scheduleRender(render)
    }

}



function mouseMove(e) {
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



function mouseUp(e) {
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










function getClickedShape(mouseX, mouseY) {
    for (let i = state.objects.length - 1; i >= 0; i--) {
        const shape = state.objects[i]
        const left = Math.min(shape.x, shape.x + shape.width);
        const right = Math.max(shape.x, shape.x + shape.width);

        const top = Math.min(shape.y, shape.y + shape.height);
        const bottom = Math.max(shape.y, shape.y + shape.height);
        const hitPadding = 10



        switch (shape.type) {
            case "rectangle":
            case "ellipse":
            case "diamond":
            case "triangle":
            case "text":
                if (
                    mouseX >= left - hitPadding &&
                    mouseX <= right + hitPadding &&
                    mouseY >= top - hitPadding &&
                    mouseY <= bottom + hitPadding
                ) {
                    return shape;
                }
                break;

            case "line":
            case "arrow":
                if (
                    distanceToLine(
                        mouseX,
                        mouseY,
                        shape.x1,
                        shape.y1,
                        shape.x2,
                        shape.y2
                    ) <= 8
                ) {
                    return shape;
                }

            case "pencil":
                if (!shape.points) break;
                for (let i = 1; i < shape.points.length; i++) {

                    const p1 = shape.points[i - 1];
                    const p2 = shape.points[i];

                    if (
                        distanceToLine(
                            mouseX,
                            mouseY,
                            p1.x,
                            p1.y,
                            p2.x,
                            p2.y
                        ) <= 8
                    ) {
                        return shape;
                    }
                }

        }

    }
}




//gneeric function to draw shape 
function drawShape(shape, ctx) {
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

function getClickedHandle(shape, mouseX, mouseY) {
    const padding = 8


    const left = Math.min(shape.x, shape.x + shape.width) - padding;
    const right = Math.max(shape.x, shape.x + shape.width) + padding;

    const top = Math.min(shape.y, shape.y + shape.height) - padding;
    const bottom = Math.max(shape.y, shape.y + shape.height) + padding;

    const midX = (left + right) / 2;
    const midY = (top + bottom) / 2;


    const handles = [
        { name: "nw", x: left, y: top },
        { name: "n", x: midX, y: top },
        { name: "ne", x: right, y: top },

        { name: "w", x: left, y: midY },
        { name: "e", x: right, y: midY },

        { name: "sw", x: left, y: bottom },
        { name: "s", x: midX, y: bottom },
        { name: "se", x: right, y: bottom },
    ];



    const half = 10;

    switch (shape.type) {
        case "rectangle":
        case "ellipse":
        case "diamond":
        case "triangle":
        case "text":
            for (const handle of handles) {
                if (
                    mouseX >= handle.x - half &&
                    mouseX <= handle.x + half &&
                    mouseY >= handle.y - half &&
                    mouseY <= handle.y + half
                ) {
                    return handle.name
                }
            }

            break
        case "line":
        case "arrow":
            return getClickedLineHandle(shape, mouseX, mouseY)
            break
    }

    return null
}






function resizeShape(shape, handle, mouseX, mouseY) {
    switch (handle) {
        case "se":
            shape.width = mouseX - shape.x;
            shape.height = mouseY - shape.y
            break

        case "e":
            shape.width = mouseX - shape.x
            break

        case "s":
            shape.height = mouseY - shape.y
            break

        case "nw":
            shape.width += shape.x - mouseX
            shape.height += shape.y - mouseY

            shape.x = mouseX
            shape.y = mouseY
            break

        case "n":
            shape.height += shape.y - mouseY
            shape.y = mouseY
            break

        case "w":
            shape.width += shape.x - mouseX
            shape.x = mouseX
            break

        case "ne":
            shape.width = mouseX - shape.x
            shape.height += shape.y - mouseY
            shape.y = mouseY
            break

        case "sw":
            shape.width += shape.x - mouseX;
            shape.x = mouseX;

            shape.height = mouseY - shape.y;
            break;
    }


    if (shape.width < 0) {
        shape.x += shape.width;
        shape.width = Math.abs(shape.width)

        switch (state.resizeHandle) {
            case "e": state.resizeHandle = "w"; break
            case "w": state.resizeHandle = "e"; break
            case "ne": state.resizeHandle = "nw"; break
            case "nw": state.resizeHandle = "ne"; break
            case "se": state.resizeHandle = "sw"; break
            case "sw": state.resizeHandle = "se"; break
        }
    }

    if (shape.height < 0) {
        shape.y += shape.height
        shape.height = Math.abs(shape.height)

        switch (state.resizeHandle) {
            case "n": state.resizeHandle = "s"; break
            case "s": state.resizeHandle = "n"; break
            case "ne": state.resizeHandle = "se"; break
            case "se": state.resizeHandle = "ne"; break
            case "nw": state.resizeHandle = "sw"; break
            case "sw": state.resizeHandle = "nw"; break
        }
    }
}





function mouseDoubleClick(e) {
    const mouse = screenToWorld(e.offsetX, e.offsetY, camera);
    const shape = getClickedShape(mouse.x, mouse.y)

    state.objects.forEach(s => {
        s.selected = false
        s.editMode = false
    })

    if (shape && state.tool === "pointer") {
        shape.selected = true
        shape.editMode = true


        state.selectedShape = shape;
        if (shape.type === "text") {
            startTextEditing(shape, camera, ctx, render);
        }

    }


    scheduleRender(render)
}



function getClickedLineHandle(shape, mouseX, mouseY) {
    const size = 10

    if (
        mouseX >= shape.x1 - size &&
        mouseX <= shape.x1 + size &&
        mouseY >= shape.y1 - size &&
        mouseY <= shape.y1 + size
    ) {
        return "start"
    }


    if (
        mouseX >= shape.x2 - size &&
        mouseX <= shape.x2 + size &&
        mouseY >= shape.y2 - size &&
        mouseY <= shape.y2 + size
    ) {
        return "end"
    }

}








document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo(state.objects, render);
    }

    if ((e.ctrlKey && e.key.toLowerCase() === "y") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        redo(state.objects, render);
    }
})






window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    if ((e.key === "Delete" || e.key === "Backspace") && state.selectedShape) {
        deleteSelectedShape()
    }
})

function deleteSelectedShape() {
    const index = state.objects.indexOf(state.selectedShape)

    if (index < 0) return

    saveState(state.objects)

    state.objects.splice(index, 1)

    state.selectedShape.editMode = false
    state.selectedShape = null


    scheduleRender(render)
}


//COPY PASTE SHAPE 



window.addEventListener("keydown", (e) => {
    if (!state.selectedShape) return;

    let step
    if (e.shiftKey) {
        step = 10
    } else {
        step = 1
    }

    switch (e.key) {
        case "ArrowUp":
            state.selectedShape.y -= step
            break

        case "ArrowDown":
            state.selectedShape.y += step
            break

        case "ArrowLeft":
            state.selectedShape.x -= step
            break

        case "ArrowRight":
            state.selectedShape.x += step
            break

        default:
            return
    }

    saveState(state.objects)
    scheduleRender(render)
})




function zoomCanvas(e) {
    if (state.tool !== "hand") return

    e.preventDefault()

    const mouseX = e.offsetX
    const mouseY = e.offsetY

    const worldX = mouseX / camera.zoom + camera.x
    const worldY = mouseY / camera.zoom + camera.y

    const zoomSpeed = 0.03;
    const zoomFactor = Math.exp(-e.deltaY * zoomSpeed);

    camera.zoom *= zoomFactor;

    camera.zoom = Math.max(0.1, Math.min(camera.zoom, 10));
    updateZoomDisplay()


    camera.x = worldX - mouseX / camera.zoom;
    camera.y = worldY - mouseY / camera.zoom;


    scheduleRender(render)

}


function updateZoomDisplay() {
    zoomValue.textContent = `${Math.round(camera.zoom * 100)}%`;
}

zoomInBtn.addEventListener("click", () => {
    camera.zoom *= 1.1
    camera.zoom = Math.min(camera.zoom, 10)

    updateZoomDisplay()
    scheduleRender(render)
})


zoomOutBtn.addEventListener("click", () => {
    camera.zoom /= 1.1
    camera.zoom = Math.max(camera.zoom, 0.1)

    updateZoomDisplay()
    scheduleRender(render)
})


//CLIPBOARD

setupClipbaord({
    render,
    getSelectedShape: () => state.selectedShape,
    setSelectedShape: (shape) => state.selectedShape = shape,
    setEditMode: (value) => editMode = value
})







function renderCurrentShape() {
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