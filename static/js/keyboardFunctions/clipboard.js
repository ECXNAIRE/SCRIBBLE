import { scheduleRender } from "../helpers/scheduleRender.js";

let clipboard = null


export function setupClipbaord({
    objects,
    render,
    getSelectedShape,
    setSelectedShape,
    setEditMode
}) {
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === "c") {
            const selectedShape = getSelectedShape()
            if (!selectedShape) return;
            clipboard = structuredClone(selectedShape);


        }
    })

    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === "v" && clipboard !== null) {
            const newShape = structuredClone(clipboard);

            newShape.x += 20;
            newShape.y += 20;

            objects.push(newShape);
            objects.forEach(shape => {
                shape.selected = false,
                shape.editMode = false
            });

            newShape.selected = true
            newShape.editMode = true

            setSelectedShape(newShape);
            setEditMode(true);

            scheduleRender(render)
        }
    })

}