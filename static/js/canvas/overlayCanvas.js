import { state } from "../state.js";

export const overlayCanvas = document.getElementById("overlayCanvas")
export const overlayCtx = overlayCanvas.getContext("2d")

let cursorNeedsUpdate = false;
let cursorVisible = false




export function setCursorVisible(value) {
    cursorVisible = value;

    if (!value) {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
}


export function drawBrushCursor(tool) {

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)

    if (tool !== "pencil" && tool !== "eraser") return

    overlayCtx.beginPath();

    if (cursorVisible) {
        if (tool === "pencil") {
            overlayCtx.arc(
                state.cursorX,
                state.cursorY,
                state.selectedStrokeWidth / 2,
                0,
                Math.PI * 2
            );
        } else if (tool === "eraser") {
            overlayCtx.arc(
                state.cursorX,
                state.cursorY,
                4,
                0,
                Math.PI * 2
            );
        }

        overlayCtx.strokeStyle = "black";
        overlayCtx.lineWidth = 1;

        overlayCtx.stroke();
    }
}


export function updateCursor(tool) {
    if (cursorNeedsUpdate) return;

    cursorNeedsUpdate = true;

    requestAnimationFrame(() => {
        drawBrushCursor(tool);
        cursorNeedsUpdate = false;
    });
}