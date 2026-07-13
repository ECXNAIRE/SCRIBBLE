import { drawEllipse, drawRectangle, drawLine } from "./shapes.js"
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




//BUTTON CLICK HANDLER
document.querySelectorAll("#toolBarTop button").forEach(button => {
    button.addEventListener("click", () => {
        document
            .querySelector("#toolBarTop button.active")
            ?.classList.remove("active");

        button.classList.add("active");
        tool = button.dataset.tool
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

                isResizing = true
                resizeHandle = handle
                startX = e.offsetX;
                startY = e.offsetY;

                return;
            }
        }



        const clickedShape = getClickedShape(e.offsetX, e.offsetY)

        if (clickedShape && !isResizing) {
            isDragging = true

            dragShape = clickedShape

            dragOffsetX = e.offsetX - dragShape.x
            dragOffsetY = e.offsetY - dragShape.y
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
            editMode: false
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
            editMode: false
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
            editMode: false
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
        resizeShape(selectedShape, resizeHandle, e.offsetX, e.offsetY);
        render();
        return;
    }

    if (isDragging) {
        canvas.style.cursor = "grabbing"
        dragShape.x = e.offsetX - dragOffsetX
        dragShape.y = e.offsetY - dragOffsetY
        render()
        return
    }

    if (tool !== "pointer" && tool !== "pencil" && tool !== "text" && tool !== "undo" && tool !== "redo" && tool !== "download" && tool !== "setting") {
        canvas.style.cursor = "crosshair"
    }


    if (!isDrawing) return

    if (tool === "rectangle" || tool === "circle") {
        currentShape.width = e.offsetX - startX
        currentShape.height = e.offsetY - startY
    }

    if (tool === "line") {
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
    }

    if (isDragging) {
        isDragging = false;
        dragShape = null
    }



    if (!isDrawing) return

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
                if (
                    mouseX >= left - hitPadding &&
                    mouseX <= right + hitPadding &&
                    mouseY >= top - hitPadding &&
                    mouseY <= bottom + hitPadding
                ) {
                    return shape;
                }
                break;


            case "ellipse":
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
            drawRectangle(shape, ctx)
            break

        case "ellipse":
            drawEllipse(shape, ctx)
            break

        case "line":
            drawLine(shape, ctx)

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


    if (shape.type === "line") {
        return null;
    }

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



    const handleSize = 8;
    const half = handleSize / 2


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





function distanceToLine(px, py, x1, y1, x2, y2) {
    const a = px - x1
    const b = py - y1
    const c = x2 - x1
    const d = y2 - y1


    const dot = a * c + b * d
    const lenSq = c * c + d * d

    let t = dot / lenSq


    t = Math.max(0, Math.min(1, t))


    const closestX = x1 + t * c
    const closestY = y2 + t * d

    const dx = px - closestX
    const dy = py - closestY

    return Math.sqrt(dx * dx + dy * dy)
}