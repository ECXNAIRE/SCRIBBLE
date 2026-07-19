import { scheduleRender } from "../helpers/scheduleRender.js"
let undoStack = []
let redoStack = []


export function saveState(objects) {
    undoStack.push(structuredClone(objects))

    if (undoStack.length > 100) {
        undoStack.shift()
    }

    redoStack = []
}


export function undo(objects, render) {
    if (undoStack.length === 0) return

    redoStack.push(structuredClone(objects))

    const previous = undoStack.pop();

    objects.length = 0;
    objects.push(...previous);

    scheduleRender(render)
}


export function redo(objects, render) {
    if (redoStack.length === 0) return
    undoStack.push(structuredClone(objects))

    const next = redoStack.pop();

    objects.length = 0;
    objects.push(...next);

    scheduleRender(render)
}