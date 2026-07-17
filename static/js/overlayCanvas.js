export const overlayCanvas = document.getElementById("overlayCanvas")
export const overlayCtx = overlayCanvas.getContext("2d")
let cursorNeedsUpdate = false;

export function drawBrushCursor(tool, cursorX, cursorY, selectedStrokeWidth) {

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)

    if (tool !== "pencil" && tool !== "eraser") return

    overlayCtx.beginPath();

    if (tool === "pencil") {
        overlayCtx.arc(
            cursorX,
            cursorY,
            selectedStrokeWidth / 2,
            0,
            Math.PI * 2
        );
    } else if(tool === "eraser") {
        overlayCtx.arc(
            cursorX,
            cursorY,
            4,
            0,
            Math.PI * 2
        );
    }

    overlayCtx.strokeStyle = "black";
    overlayCtx.lineWidth = 1;

    overlayCtx.stroke();
}


export function updateCursor(tool, cursorX, cursorY, selectedStrokeWidth) {
    if (cursorNeedsUpdate) return;

    cursorNeedsUpdate = true;

    requestAnimationFrame(() => {
        drawBrushCursor(tool, cursorX, cursorY, selectedStrokeWidth);
        cursorNeedsUpdate = false;
    });
}