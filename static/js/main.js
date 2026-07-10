let tool = "pointer"
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const canvasArea = document.getElementById("canvasArea")
let objects = []
let isMouseDrawing = false
let startX
let startY
let currentX
let currentY


ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#000";
ctx.fillStyle = "#000";



//RENDER FUNCTION FOR DRAWING 
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
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
canvas.addEventListener("mousedown", handleMouse)
canvas.addEventListener("mouseup", handleMouse)
canvas.addEventListener("mousemove", handleMouse)


function handleMouse(e){
    console.log(e.offsetX, e.offsetY)
}