import { drawEllipse, drawRectangle, drawLine, drawDiamond, drawTriangle, drawArrow, drawPencil } from "./shapes.js"
import { Path, drawPath } from "./testnewArch.js"
import { distanceToLine } from "./lineTools.js"
import { selectionBox } from "./handle&selectionbox.js"
import { drawGrid } from "./grid.js"
import { overlayCanvas, drawBrushCursor, updateCursor, overlayCtx } from "./overlayCanvas.js"
import { screenToWorld } from "./cameraFunction.js"


const fillSection = document.getElementById("fillSection")
const sloppinessSection = document.getElementById("sloppinessSection")
const fillTypeSection = document.getElementById("fillTypeSection")
const edgeSection = document.getElementById("edgeSection")
const layerSection = document.getElementById("layerToggleSection")


const camera = {
    x: 0,
    y: 0,
    zoom: 1
}

let isPanning = false
let panStartX = 0;
let panStartY = 0;
let spacePressed = false;
let tool = "pointer"
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const canvasArea = document.getElementById("canvasArea")
let objects = []
let isDrawing = false
let startX
let startY
let currentX
let currentY
let currentShape
let isResizing = false
let resizeHandle
let selectedShape
let editMode = false
let isDragging = false
let dragOffsetX = 0
let dragOffsetY = 0
let dragShape = null
let undoStack = []
let redoStack = []
let selectedStroke = "stroke1"
let selectedStrokeWidth = 2
let selectedFillType = "solid"
let shiftPressed = false
let isErasing = false
let edgeStyle = 0
let layerOptionShow = false
let gridToggle = false
let clipboard = null
let cursorX = 0;
let cursorY = 0;



let gridToggleBtn = document.getElementById("gridToggleBtn")

gridToggleBtn.addEventListener("click", () => {
    gridToggle = !gridToggle;

    if (gridToggle) {
        gridToggleBtn.classList.add("active");
    } else {
        gridToggleBtn.classList.remove("active");
    }

    render();
});

document.querySelectorAll(".layerToggleBtn").forEach(button => {
    button.addEventListener("click", () => {
        const doFunction = button.dataset.function
        const index = objects.indexOf(selectedShape)

        if (index < 0) return


        if (doFunction === "top") {
            objects.splice(index, 1)
            objects.push(selectedShape)

        } else if (doFunction === "up") {
            if (index < objects.length - 1) {
                [objects[index], objects[index + 1]] =
                    [objects[index + 1], objects[index]];
            }

        } else if (doFunction === "down") {
            if (index > 0) {
                [objects[index], objects[index - 1]] =
                    [objects[index - 1], objects[index]];
            }

        } else if (doFunction === "bottom") {
            objects.splice(index, 1);
            objects.unshift(selectedShape);

        }


        render()
    })
})


document.querySelectorAll(".edgeStyleBtn").forEach(button => {
    button.addEventListener("click", () => {
        edgeStyle = Number(button.dataset.edgestyle)
        document
            .querySelector(".edgeStyleBtn.active")
            ?.classList.remove("active")

        button.classList.add("active")

        if (selectedShape) {
            selectedShape.edgeStyle = edgeStyle
            render()
        }

    })
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        shiftPressed = true
    }
})

window.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
        shiftPressed = false
    }
})

document.querySelectorAll(".fillTypeBtn").forEach(button => {
    button.addEventListener("click", () => {

        selectedFillType = button.dataset.filltype
        document
            .querySelector(".fillTypeBtn.active")
            ?.classList.remove("active")

        button.classList.add("active")

        if (selectedShape) {
            selectedShape.fillType = selectedFillType
            render()
        }


        console.log(selectedFillType)
    })
})

const strokePicker = document.getElementById("strokeColorPicker")
const fillPicker = document.getElementById("fillColorPicker")

let strokeColor = strokePicker.value;
let fillColor = fillPicker.value;

strokePicker.addEventListener("input", () => {
    strokeColor = strokePicker.value
    document
        .querySelector(".strokeColorBtn.active")
        ?.classList.remove("active");
})


fillPicker.addEventListener("input", () => {
    fillColor = fillPicker.value
    document
        .querySelector(".fillColorBtn.active")
        ?.classList.remove("active");
})


document.querySelectorAll(".strokeColorBtn").forEach(button => {
    button.addEventListener("click", () => {
        document
            .querySelector(".strokeColorBtn.active")
            ?.classList.remove("active");

        button.classList.add("active");

        strokeColor = button.dataset.color

        if (selectedShape) {
            selectedShape.strokeColor = strokeColor;
            render()
        }
        strokePicker.value = strokeColor
    })
})


document.querySelectorAll(".fillColorBtn").forEach(button => {
    button.addEventListener("click", () => {
        document
            .querySelector(".fillColorBtn.active")
            ?.classList.remove("active");

        button.classList.add("active");

        fillColor = button.dataset.color

        if (selectedShape) {
            selectedShape.fillColor = fillColor;
            render()
        }
        fillPicker.value = fillColor
    })
})






//RENDER FUNCTION FOR DRAWING 
function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(-camera.x, -camera.y);
    ctx.scale(camera.zoom, camera.zoom);


    objects.forEach(shape => {
        drawShape(shape);
    });


    ctx.restore();
}

objects.push({
    type: "rectangle",
    x: 500,
    y: 500,
    width: 100,
    height: 100,

    strokeColor: "black",
    strokeWidth: 2,

    seed: 1,
    selectedStroke: "stroke1",

    fill: true,
    fillColor: "red",
    fillType: "solid",
    edgeStyle: 0
});
render();

// RESIXZING CANVAS
function resizeCanvas() {
    canvas.width = canvasArea.clientWidth;
    canvas.height = canvasArea.clientHeight;
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;

    render()
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.querySelectorAll(".strokeBtn").forEach(button => {
    button.addEventListener("click", () => {
        selectedStroke = button.dataset.stroke

        if (selectedShape) {
            selectedShape.selectedStroke = selectedStroke
            render()
        }

        console.log(selectedStroke)

        document.querySelector(".strokeBtn.active")
            ?.classList.remove("active")

        button.classList.add('active')
    })
})

document.querySelectorAll(".strokeWidthBtn").forEach(button => {
    button.addEventListener("click", () => {
        selectedStrokeWidth = Number(button.dataset.strokewidth)

        if (selectedShape) {
            selectedShape.strokeWidth = selectedStrokeWidth
            render()
        }

        console.log(selectedStrokeWidth)

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
            undo();
            return;
        }

        if (selectedTool === "redo") {
            redo();
            return;
        }

        tool = selectedTool

        document
            .querySelector(".toolBarTopBtn.active")
            ?.classList.remove("active");

        button.classList.add("active");
        console.log(tool)
    })

})



//MOUSE HANDLING HERE
canvas.addEventListener("pointerdown", mouseDown)
canvas.addEventListener("pointerup", mouseUp)
canvas.addEventListener("pointermove", mouseMove)
canvas.addEventListener("dblclick", mouseDoubleClick)
canvas.addEventListener("pointercancel", mouseUp);

function mouseDown(e) {
    console.log("MOUSE DOWN", e.button, spacePressed);
    if (tool === "hand") {
        isPanning = true;

        panStartX = e.offsetX;
        panStartY = e.offsetY;

        canvas.style.cursor = "grabbing";
        return;
    }
    const mouse = screenToWorld(e.offsetX, e.offsetY, camera);
    canvas.setPointerCapture(e.pointerId);

    if (tool === "eraser") {
        saveState()
        isErasing = true
    }

    if (tool === "pointer") {




        selectedShape = objects.find(shape => shape.selected)

        if (selectedShape?.editMode) {
            const handle = getClickedHandle(selectedShape, mouse.x, mouse.y)
            if (handle) {
                saveState()
                isResizing = true

                resizeHandle = handle
                startX = mouse.x;
                startY = mouse.y;

                return;
            }

        }

        const clickedShape = getClickedShape(mouse.x, mouse.y)

        if (clickedShape && !isResizing) {
            saveState()
            isDragging = true
            dragShape = clickedShape

            if (clickedShape.type === "line" || clickedShape.type === "arrow") {
                dragOffsetX = mouse.x
                dragOffsetY = mouse.y
            } else {
                dragOffsetX = mouse.x - dragShape.x
                dragOffsetY = mouse.y - dragShape.y
            }

        }



        if (clickedShape) {
            layerOptionShow = true
            updateToolBar(clickedShape.type)

            if (clickedShape !== selectedShape) {
                objects.forEach(shape => {
                    shape.selected = false,
                        shape.editMode = false
                })


                clickedShape.selected = true;
            }

        } else {
            objects.forEach(shape => {
                shape.selected = false,
                    shape.editMode = false
            });


            selectedShape = null
        }

        render();
    }




    if (tool === "rectangle") {
        isDrawing = true

        startX = mouse.x
        startY = mouse.y

        currentShape = {
            type: "rectangle",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: selectedStrokeWidth,
            fillType: selectedFillType,
            edgeStyle: edgeStyle
        }
    }

    if (tool === "circle") {
        isDrawing = true

        startX = mouse.x
        startY = mouse.y
        currentShape = {
            type: "ellipse",
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: selectedStrokeWidth,
            fillType: selectedFillType
        }
    }

    if (tool === "line") {
        isDrawing = true

        startX = mouse.x
        startY = mouse.y
        currentShape = {
            type: "line",
            x1: mouse.x,
            y1: mouse.y,
            x2: mouse.x,
            y2: mouse.y,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: selectedStrokeWidth,
            fillType: selectedFillType
        }
    }

    if (tool === "diamond") {
        isDrawing = true

        startX = mouse.x
        startY = mouse.y
        currentShape = {
            type: "diamond",
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: selectedStrokeWidth,
            fillType: selectedFillType
        }
    }

    if (tool === "triangle") {
        isDrawing = true

        startX = mouse.x
        startY = mouse.y

        currentShape = {
            type: "triangle",
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: selectedStrokeWidth,
            fillType: selectedFillType
        }
    }

    if (tool === "arrow") {
        isDrawing = true

        startX = mouse.x
        startY = mouse.y
        currentShape = {
            type: "arrow",
            x1: mouse.x,
            y1: mouse.y,
            x2: mouse.x,
            y2: mouse.y,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: strokeColor,
            fillColor: fillColor,
            fill: true,
            strokeWidth: selectedStrokeWidth,
            fillType: selectedFillType
        }
    }

    if (tool === "pencil") {
        isDrawing = true

        currentShape = {
            type: "pencil",
            points: [{ x: mouse.x, y: mouse.y, pressure: e.pressure }],
            strokeColor: strokeColor,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000,
            strokeWidth: selectedStrokeWidth,
            fillType: selectedFillType
        }
    }

}



function mouseMove(e) {
    if (isPanning) {

        const dx = e.offsetX - panStartX;
        const dy = e.offsetY - panStartY;

        console.log("DELTA:", dx, dy);


        const panSpeed = 0.5;

        camera.x -= dx * panSpeed;
        camera.y -= dy * panSpeed;

        panStartX = e.offsetX;
        panStartY = e.offsetY;

        render();
        return;
    }

    const mouse = screenToWorld(e.offsetX, e.offsetY, camera);
    cursorX = e.offsetX;
    cursorY = e.offsetY;

    updateCursor(tool, cursorX, cursorY, selectedStrokeWidth)

    if (tool === "pencil" || tool === "eraser") {
        canvas.style.cursor = "none";
        render();
    }

    if (tool == "eraser" && isErasing) {
        const hoveredShape = getClickedShape(mouse.x, mouse.y)

        if (hoveredShape) {
            const index = objects.indexOf(hoveredShape);

            if (!(index < 0)) {
                objects.splice(index, 1);
                render();
            }

        }

        return
    }

    if (tool === "pointer") {
        const hoveredShape = getClickedShape(mouse.x, mouse.y)
        const hoveredHandle = hoveredShape
            ? getClickedHandle(hoveredShape, mouse.x, mouse.y)
            : null

        if (hoveredHandle) {
            canvas.style.cursor = "crosshair"
        } else if (hoveredShape) {
            canvas.style.cursor = "grab"
        } else (
            canvas.style.cursor = "default"
        )
    }


    if (isResizing) {
        canvas.style.cursor = "crosshair";
    }

    if (isDrawing && tool !== 'pencil') {
        canvas.style.cursor = "crosshair"
    }

    if (isResizing) {
        if (selectedShape.type === "line" || selectedShape.type === "arrow") {
            if (resizeHandle === "start") {
                selectedShape.x1 = mouse.x;
                selectedShape.y1 = mouse.y;
            }

            if (resizeHandle === "end") {
                selectedShape.x2 = mouse.x;
                selectedShape.y2 = mouse.y;
            }
        } else {
            resizeShape(selectedShape, resizeHandle, mouse.x, mouse.y);
        }

        render();
        return;
    }

    if (isDragging) {
        canvas.style.cursor = "grabbing"
        if (dragShape.type === "line" || dragShape.type === "arrow") {
            const dx = mouse.x - dragOffsetX
            const dy = mouse.y - dragOffsetY

            dragShape.x1 += dx
            dragShape.y1 += dy
            dragShape.x2 += dx
            dragShape.y2 += dy


            dragOffsetX = mouse.x
            dragOffsetY = mouse.y
        } else {
            dragShape.x = mouse.x - dragOffsetX
            dragShape.y = mouse.y - dragOffsetY
        }

        render()
        return
    }

    if (tool !== "pointer" && tool !== "pencil" && tool !== "text" && tool !== "undo" && tool !== "redo" && tool !== "download" && tool !== "setting" && tool !== "eraser") {
        canvas.style.cursor = "crosshair"
    }


    if (!isDrawing) return

    if (tool === "rectangle" || tool === "circle" || tool === "diamond" || tool === "triangle") {

        let width = mouse.x - startX
        let height = mouse.y - startY

        if (shiftPressed) {
            let size = Math.max(Math.abs(width), Math.abs(height))

            width = width < 0 ? -size : size
            height = height < 0 ? -size : size
        }

        currentShape.width = width
        currentShape.height = height
    }

    if (tool === "line" || tool === "arrow") {
        currentShape.x2 = mouse.x
        currentShape.y2 = mouse.y
    }

    if (tool === "pencil") {

        const last = currentShape.points[currentShape.points.length - 1]
        let smoothPressure
        let x = mouse.x;
        let y = mouse.y;

        if (last) {
            const dx = mouse.x - last.x
            const dy = mouse.y - last.y
            if (Math.hypot(dx, dy) < 1.5) {
                return;
            }

            const distance = Math.hypot(dx, dy)
            smoothPressure = last.pressure * 0.65 + e.pressure * 0.35


            x = last.x * 0.3 + mouse.x * 0.7
            y = last.y * 0.3 + mouse.y * 0.7
        } else {
            smoothPressure = e.pressure
        }
        currentShape.points.push({
            x,
            y,
            pressure: smoothPressure
        })

        render()
        return
    }



    render()
}



function mouseUp(e) {
    canvas.releasePointerCapture(e.pointerId);

    if (isPanning) {
        isPanning = false;
        canvas.style.cursor = "default";
        return;
    }

    if (isResizing) {
        isResizing = false;
        resizeHandle = null;
        canvas.style.cursor = "default";
        return
    }

    if (isDragging) {
        isDragging = false;
        dragShape = null
        return
    }

    if (isErasing) {
        isErasing = false
        return
    }



    if (!isDrawing) return

    saveState()

    isDrawing = false

    objects.push(currentShape)
    currentShape = null

    render()
}










function getClickedShape(mouseX, mouseY) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const shape = objects[i]
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
function drawShape(shape) {
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

        switch (resizeHandle) {
            case "e": resizeHandle = "w"; break
            case "w": resizeHandle = "e"; break
            case "ne": resizeHandle = "nw"; break
            case "nw": resizeHandle = "ne"; break
            case "se": resizeHandle = "sw"; break
            case "sw": resizeHandle = "se"; break
        }
    }

    if (shape.height < 0) {
        shape.y += shape.height
        shape.height = Math.abs(shape.height)

        switch (resizeHandle) {
            case "n": resizeHandle = "s"; break
            case "s": resizeHandle = "n"; break
            case "ne": resizeHandle = "se"; break
            case "se": resizeHandle = "ne"; break
            case "nw": resizeHandle = "sw"; break
            case "sw": resizeHandle = "nw"; break
        }
    }
}





function mouseDoubleClick(e) {
    const mouse = screenToWorld(e.offsetX, e.offsetY, camera);
    const shape = getClickedShape(mouse.x, mouse.y)

    objects.forEach(s => {
        s.selected = false
        s.editMode = false
    })

    if (shape) {
        shape.selected = true
        shape.editMode = true
    }


    render()
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





function saveState() {
    undoStack.push(structuredClone(objects))

    if (undoStack.length > 100) {
        undoStack.shift()
    }

    redoStack = []
}


function undo() {
    if (undoStack.length === 0) return

    redoStack.push(structuredClone(objects))

    objects = undoStack.pop()

    render()
}


function redo() {
    if (redoStack.length === 0) return
    undoStack.push(structuredClone(objects))

    objects = redoStack.pop()

    render()
}


document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
    }

    if ((e.ctrlKey && e.key.toLowerCase() === "y") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        redo();
    }
})





function updateToolBar(tool) {
    fillSection.style.display = "none"
    fillTypeSection.style.display = "none"
    edgeSection.style.display = "none"
    sloppinessSection.style.display = "none"
    layerSection.style.display = "none"


    switch (tool) {
        case "rectangle":
            fillSection.style.display = "block"
            fillTypeSection.style.display = "block"
            edgeSection.style.display = "block"
            sloppinessSection.style.display = "block"
            if (layerOptionShow === true) {
                layerSection.style.display = "block"
            }


            break

        case "triangle":
        case "circle":
        case "diamond":
            fillSection.style.display = "block"
            fillTypeSection.style.display = "block"
            sloppinessSection.style.display = "block"
            if (layerOptionShow === true) {
                layerSection.style.display = "block"
            }

            break


        case "line":
        case "arrow":
            sloppinessSection.style.display = "block"
            if (layerOptionShow === true) {
                layerSection.style.display = "block"
            }


            break

    }
}



window.addEventListener("keydown", (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && selectedShape) {
        deleteSelectedShape()
    }
})

function deleteSelectedShape() {
    const index = objects.indexOf(selectedShape)

    if (index < 0) return

    saveState()

    objects.splice(index, 1)

    selectedShape.editMode = false
    selectedShape = null


    render()
}


//COPY PASTE SHAPE 

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
        if (!selectedShape) return;
        clipboard = structuredClone(selectedShape);


    }
})

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "v" && clipboard !== null) {
        const newShape = structuredClone(clipboard);

        newShape.x += 20;
        newShape.y += 20;

        objects.push(newShape);

        selectedShape = newShape;
        editMode = true;

        render();
    }
})



window.addEventListener("keydown", (e) => {
    if (!selectedShape) return;

    let step
    if (e.shiftKey) {
        step = 10
    } else {
        step = 1
    }

    switch (e.key) {
        case "ArrowUp":
            selectedShape.y -= step
            break

        case "ArrowDown":
            selectedShape.y += step
            break

        case "ArrowLeft":
            selectedShape.x -= step
            break

        case "ArrowRight":
            selectedShape.x += step
            break

        default:
            return
    }

    saveState()
    render()
})



