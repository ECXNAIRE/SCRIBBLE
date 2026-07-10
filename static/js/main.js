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

function mouseDown(e) {

    if (tool === "pointer") {
        const clickedShape = getClickedShape(e.offsetX, e.offsetY)

        objects.forEach(shape => shape.selected = false);

        if (clickedShape) {
            clickedShape.selected = true;
        }

        render();
        return;
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
            selected: false
        }
    }
}



function mouseMove(e) {
    if (!isDrawing) return

    if (tool === "rectangle") {
        currentShape.width = e.offsetX - startX
        currentShape.height = e.offsetY - startY
    }



    render()
}



function mouseUp(e) {
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


    if (rect.selected) {
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




        switch (shape.type) {
            case "rectangle":
                if (
                    mouseX >= left &&
                    mouseX <= right &&
                    mouseY >= top &&
                    mouseY <= bottom
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
}



function drawHandle(x, y, size) {
    ctx.beginPath();
    ctx.rect(
        x- size / 2,
        y - size / 2,
        size,
        size
    )

    ctx.fill();
    ctx.stroke()
}