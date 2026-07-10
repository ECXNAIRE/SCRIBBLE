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

ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#000";
ctx.fillStyle = "#000";



//RENDER FUNCTION FOR DRAWING 
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    objects.forEach(drawShape)

    if (currentShape && tool === "rectangle") {
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


}



function mouseMove(e) {

    if (isResizing) {
        resizeShape(selectedShape, resizeHandle, e.offsetX, e.offsetY);
        render();
        return;
    }


    if (!isDrawing) return

    if (tool === "rectangle") {
        currentShape.width = e.offsetX - startX
        currentShape.height = e.offsetY - startY
    }



    render()
}



function mouseUp(e) {

    if (isResizing) {
        isResizing = false;
        resizeHandle = null;
    }



    if (!isDrawing) return

    isDrawing = false

    objects.push(currentShape)

    currentShape = null

    render()
}






//HELPER FUNCTION TO DRAW RECTANGLE
function drawRectangle(rect) {
    ctx.beginPath();

    ctx.rect(
        rect.x,
        rect.y,
        rect.width,
        rect.height
    );

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();


    if (rect.selected && rect.editMode) {
        selectionBox(rect)
    }

    ctx.stroke();
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
        }
    }
}




//gneeric function to draw shape 
function drawShape(shape) {
    switch (shape.type) {
        case "rectangle":
            drawRectangle(shape)
    }
}





//selection Box
function selectionBox(rect) {
    const padding = 6
    const handleSize = 8

    const left = Math.min(rect.x, rect.x + rect.width) - padding
    const top = Math.min(rect.y, rect.y + rect.height) - padding

    const width = Math.abs(rect.width) + padding * 2
    const height = Math.abs(rect.height) + padding * 2

    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top, width, height);


    ctx.fillStyle = "#FFFFFF"
    ctx.strokeStyle = "#3B82F6"

    drawHandle(left, top, handleSize)
    drawHandle(left + width, top, handleSize)
    drawHandle(left, top + height, handleSize)
    drawHandle(left + width, top + height, handleSize)
    drawHandle(left + width / 2, top, handleSize)
    drawHandle(left, top + height / 2, handleSize)
    drawHandle(left + width, top + height / 2, handleSize)
    drawHandle(left + width / 2, top + height, handleSize)
}



function drawHandle(x, y, size) {
    ctx.beginPath();
    ctx.rect(
        x - size / 2,
        y - size / 2,
        size,
        size
    )

    ctx.fill();
    ctx.stroke()
}



function getClickedHandle(shape, mouseX, mouseY) {
    const padding = 6


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