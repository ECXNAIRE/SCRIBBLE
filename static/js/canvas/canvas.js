import { scheduleRender } from "../helpers/scheduleRender.js"
import { state } from "../state.js"



state.dpr = window.devicePixelRatio || 1

export const overlayCanvas = document.getElementById("overlayCanvas")
export const overlayCtx = overlayCanvas.getContext("2d")
export const canvas = document.getElementById("canvas")
export const ctx = canvas.getContext("2d")
export const canvasArea = document.getElementById("canvasArea")
export const cacheCanvas = document.getElementById("cacheCanvas")
export const cacheCtx = cacheCanvas.getContext("2d")


export function resizeCanvas(render) {
    canvas.width = canvasArea.clientWidth * state.dpr;
    canvas.height = canvasArea.clientHeight * state.dpr;
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;
    cacheCanvas.width = canvas.width
    cacheCanvas.height = canvas.height

    scheduleRender(render)
}
