import { state } from "../state.js";
import { ctx } from "../canvas/canvas.js";



export function resizeShape(shape, handle, mouseX, mouseY) {

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

        switch (state.resizeHandle) {
            case "e": state.resizeHandle = "w"; break
            case "w": state.resizeHandle = "e"; break
            case "ne": state.resizeHandle = "nw"; break
            case "nw": state.resizeHandle = "ne"; break
            case "se": state.resizeHandle = "sw"; break
            case "sw": state.resizeHandle = "se"; break
        }
    }

    if (shape.height < 0) {
        shape.y += shape.height
        shape.height = Math.abs(shape.height)

        switch (state.resizeHandle) {
            case "n": state.resizeHandle = "s"; break
            case "s": state.resizeHandle = "n"; break
            case "ne": state.resizeHandle = "se"; break
            case "se": state.resizeHandle = "ne"; break
            case "nw": state.resizeHandle = "sw"; break
            case "sw": state.resizeHandle = "nw"; break
        }
    }
}





export function resizeText(shape, handle, mouseX, mouseY) {
    const t = state.textResize

    const MIN_FONT_SIZE = 8;
    const MAX_FONT_SIZE = 300;

    let newWidth;

    switch (t.handle) {

        case "se":
        case "ne":
            newWidth = t.startWidth + (mouseX - t.startMouseX);
            break;

        case "sw":
        case "nw":
            newWidth = t.startWidth - (mouseX - t.startMouseX);
            break;
    }

    newWidth = Math.max(1, newWidth);

    const scale = newWidth / t.startWidth;

    shape.fontSize = t.startFontSize * scale;
    shape.fontSize = Math.max(
        MIN_FONT_SIZE,
        Math.min(MAX_FONT_SIZE, shape.fontSize)
    )
    ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;

    shape.width = ctx.measureText(shape.text || " ").width;
    shape.height = shape.fontSize;


    switch (t.handle) {
        case 'se':
            shape.x = t.anchorX
            shape.y = t.anchorY
            break

        case "sw":
            shape.x = t.anchorX - shape.width
            shape.y = t.anchorY
            break

        case "ne":
            shape.x = t.anchorX
            shape.y = t.anchorY - shape.height
            break

        case "nw":
            shape.x = t.anchorX - shape.width
            shape.y = t.anchorY - shape.height
            break
    }
}