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
let currentRectangle


ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#000";
ctx.fillStyle = "#000";



//RENDER FUNCTION FOR DRAWING 
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    objects.forEach(drawRectangle)

    if(currentRectangle) {
        drawRectangle(currentRectangle)
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
    if(tool === "rectangle") {
        isDrawing = true

        startX = e.offsetX
        startY = e.offsetY

        currentRectangle = {
            type: "rectangle",
            x: startX,
            y: startY,
            width: 0,
            height: 0
        }
    }
}



function mouseMove(e) {
    if(!isDrawing) return

    currentRectangle.width = e.offsetX - startX
    currentRectangle.height = e.offsetY - startY

    render()
}



function mouseUp(e) {
    if(!isDrawing) return

    isDrawing = false


    objects.push(currentRectangle)

    currentRectangle = null

    render()
}






//HELPER FUNCTION TO DRAW RECTANGLE
function drawRectangle(rectangle) {

    ctx.strokeRect(
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height
    );

}