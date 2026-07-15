import { drawEllipse, drawRectangle, drawLine, drawDiamond, drawTriangle, drawArrow } from "./shapes.js"

import { distanceToLine } from "./lineTools.js"
import { selectionBox } from "./handle&selectionbox.js"

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

const strokePicker = document.getElementById("strokeColorPicker")
const fillPicker = document.getElementById("fillColorPicker")

let strokeColor = strokePicker.value;
let fillColor = fillPicker.value;

strokePicker.addEventListener("input", () => {
    strokeColor = strokePicker.value
})


fillPicker.addEventListener("input", () => {
    strokeColor = fillPicker.value
})


document.querySelectorAll(".strokeColorBtn").forEach(button => {
    button.addEventListener("click", () => {
        strokeColor = button.dataset.color

        strokePicker.value = strokeColor
    })
})


document.querySelectorAll(".fillColorBtn").forEach(button => {
    button.addEventListener("click", () => {
        fillColor = button.dataset.color

        fillPicker.value = fillColor
    })
})







ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#000";
ctx.fillStyle = "#000";




//RENDER FUNCTION FOR DRAWING 
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    objects.forEach(drawShape)

    if (currentShape) {
        drawShape(currentShape)
    }
}




// RESIXZING CANVAS
function resizeCanvas() {
    canvas.width = canvasArea.clientWidth;
    canvas.height = canvasArea.clientHeight;

    render()
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.querySelectorAll(".strokeBtn").forEach(button => {
    button.addEventListener("click", () => {
        selectedStroke = button.dataset.stroke

        console.log(selectedStroke)

        document.querySelector(".strokeBtn.active")
            ?.classList.remove("active")

        button.classList.add('active')
    })
})



//BUTTON CLICK HANDLER
document.querySelectorAll("#toolBarTop button").forEach(button => {
    button.addEventListener("click", () => {

        const selectedTool = button.dataset.tool
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
            .querySelector("#toolBarTop button.active")
            ?.classList.remove("active");

        button.classList.add("active");
        console.log(tool)
    })

})



//MOUSE HANDLING HERE
canvas.addEventListener("mousedown", mouseDown)
canvas.addEventListener("mouseup", mouseUp)
canvas.addEventListener("mousemove", mouseMove)
canvas.addEventListener("dblclick", mouseDoubleClick)

function mouseDown(e) {

    if (tool === "pointer") {




        selectedShape = objects.find(shape => shape.selected)

        if (selectedShape?.editMode) {
            const handle = getClickedHandle(selectedShape, e.offsetX, e.offsetY)
            if (handle) {
                saveState()
                isResizing = true

                resizeHandle = handle
                startX = e.offsetX;
                startY = e.offsetY;

                return;
            }
        }



        const clickedShape = getClickedShape(e.offsetX, e.offsetY)

        if (clickedShape && !isResizing) {
            saveState()
            isDragging = true
            dragShape = clickedShape

            if (clickedShape.type === "line" || clickedShape.type === "arrow") {
                dragOffsetX = e.offsetX
                dragOffsetY = e.offsetY
            } else {
                dragOffsetX = e.offsetX - dragShape.x
                dragOffsetY = e.offsetY - dragShape.y
            }

        }



        if (clickedShape) {

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
        }

        render();
    }




    if (tool === "rectangle") {
        isDrawing = true

        startX = e.offsetX
        startY = e.offsetY

        currentShape = {
            type: "rectangle",
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000
        }
    }

    if (tool === "circle") {
        isDrawing = true

        startX = e.offsetX
        startY = e.offsetY
        currentShape = {
            type: "ellipse",
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000
        }
    }

    if (tool === "line") {
        isDrawing = true

        startX = e.offsetX
        startY = e.offsetY
        currentShape = {
            type: "line",
            x1: e.offsetX,
            y1: e.offsetY,
            x2: e.offsetX,
            y2: e.offsetY,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000
        }
    }

    if (tool === "diamond") {
        isDrawing = true

        startX = e.offsetX
        startY = e.offsetY
        currentShape = {
            type: "diamond",
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000
        }
    }

    if (tool === "triangle") {
        isDrawing = true

        startX = e.offsetX
        startY = e.offsetY

        currentShape = {
            type: "triangle",
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000
        }
    }

    if (tool === "arrow") {
        isDrawing = true

        startX = e.offsetX
        startY = e.offsetY
        currentShape = {
            type: "arrow",
            x1: e.offsetX,
            y1: e.offsetY,
            x2: e.offsetX,
            y2: e.offsetY,
            selected: false,
            editMode: false,
            selectedStroke: selectedStroke,
            seed: Math.random() * 100000
        }
    }

}



function mouseMove(e) {

    if (tool === "pointer") {
        const hoveredShape = getClickedShape(e.offsetX, e.offsetY)
        const hoveredHandle = hoveredShape
            ? getClickedHandle(hoveredShape, e.offsetX, e.offsetY)
            : null

        if (hoveredHandle) {
            canvas.style.cursor = "crosshair"
        } else if (hoveredShape) {
            canvas.style.cursor = "grab"
        } else (
            canvas.style.cursor = "default"
        )
    }


    if (isResizing || isDrawing) {
        canvas.style.cursor = "crosshair";
    }

    if (isResizing) {
        if (selectedShape.type === "line" || selectedShape.type === "arrow") {
            if (resizeHandle === "start") {
                selectedShape.x1 = e.offsetX;
                selectedShape.y1 = e.offsetY;
            }

            if (resizeHandle === "end") {
                selectedShape.x2 = e.offsetX;
                selectedShape.y2 = e.offsetY;
            }
        } else {
            resizeShape(selectedShape, resizeHandle, e.offsetX, e.offsetY);
        }

        render();
        return;
    }

    if (isDragging) {
        canvas.style.cursor = "grabbing"
        if (dragShape.type === "line" || dragShape.type === "arrow") {
            const dx = e.offsetX - dragOffsetX
            const dy = e.offsetY - dragOffsetY

            dragShape.x1 += dx
            dragShape.y1 += dy
            dragShape.x2 += dx
            dragShape.y2 += dy


            dragOffsetX = e.offsetX
            dragOffsetY = e.offsetY
        } else {
            dragShape.x = e.offsetX - dragOffsetX
            dragShape.y = e.offsetY - dragOffsetY
        }

        render()
        return
    }

    if (tool !== "pointer" && tool !== "pencil" && tool !== "text" && tool !== "undo" && tool !== "redo" && tool !== "download" && tool !== "setting") {
        canvas.style.cursor = "crosshair"
    }


    if (!isDrawing) return

    if (tool === "rectangle" || tool === "circle" || tool === "diamond" || tool === "triangle") {
        currentShape.width = e.offsetX - startX
        currentShape.height = e.offsetY - startY
    }

    if (tool === "line" || tool === "arrow") {
        currentShape.x2 = e.offsetX
        currentShape.y2 = e.offsetY
    }



    render()
}



function mouseUp(e) {

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
    const shape = getClickedShape(e.offsetX, e.offsetY)

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
