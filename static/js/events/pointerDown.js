import { state } from "../state.js";
import { saveState } from "../toolBarTop/history.js";
import { getClickedShape, getClickedHandle } from "../pointer/hitTest.js";
import { scheduleRender } from "../helpers/scheduleRender.js";
import { screenToWorld, camera } from "../canvas/cameraFunction.js";
import { setLayerOption, updateToolBar } from "../leftToolBar/updateToolBar.js";
import { canvas, ctx } from "../canvas/canvas.js";
import { startTextEditing } from "../toolBarTop/shapes.js";



export function mouseDown(e, render) {

    if (state.tool === "hand") {
        state.isPanning = true;

        state.panStartX = e.offsetX;
        state.panStartY = e.offsetY;

        canvas.style.cursor = "grabbing";
        return;
    }
    const mouse = screenToWorld(e.offsetX, e.offsetY, camera);
    canvas.setPointerCapture(e.pointerId);

    if (state.tool === "eraser") {
        saveState(state.objects)
        state.isErasing = true
    }

    if (state.tool === "pointer") {

        if (state.selectedShape?.selected) {
            const handle = getClickedHandle(state.selectedShape, mouse.x, mouse.y)
            if (handle) {
                saveState(state.objects)

                if (state.selectedShape.type === "text") {
                    state.initialTextWidth = state.selectedShape.width;
                    state.initialTextFontSize = state.selectedShape.fontSize;
                }
                state.isResizing = true

                state.resizeHandle = handle
                state.startX = mouse.x;
                state.startY = mouse.y;

                return;
            }

        }

        const clickedShape = getClickedShape(mouse.x, mouse.y)



        if (clickedShape && clickedShape.type === "text") {
            state.objects.forEach(shape => {
                shape.selected = false,
                    shape.editMode = false
            })
            if (!clickedShape.selected) {
                clickedShape.selected = true;
                state.selectedShape = clickedShape;
                scheduleRender(render)
            }

        }

        if (clickedShape && !state.isResizing) {
            saveState(state.objects)
            state.isDragging = true
            state.dragShape = clickedShape

            if (clickedShape.type === "line" || clickedShape.type === "arrow") {
                state.dragOffsetX = mouse.x
                state.dragOffsetY = mouse.y
            } else {
                state.dragOffsetX = mouse.x - state.dragShape.x
                state.dragOffsetY = mouse.y - state.dragShape.y
            }

        }



        if (clickedShape) {
            setLayerOption(true)
            updateToolBar(clickedShape.type)

            if (clickedShape !== state.selectedShape) {
                state.objects.forEach(shape => {
                    shape.selected = false,
                        shape.editMode = false
                })


                clickedShape.selected = true;
            }

            state.selectedShape = clickedShape;

        } else {
            state.objects.forEach(shape => {
                shape.selected = false,
                    shape.editMode = false
            });


            state.selectedShape = null
        }

        scheduleRender(render)
    }




    if (state.tool === "rectangle") {
        state.isDrawing = true


        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "rectangle",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: state.strokeColor,
            fillColor: state.fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType,
            edgeStyle: state.edgeStyle
        }
    }

    if (state.tool === "circle") {
        state.isDrawing = true

        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "ellipse",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: state.strokeColor,
            fillColor: state.fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "line") {
        state.isDrawing = true

        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "line",
            x1: mouse.x,
            y1: mouse.y,
            x2: mouse.x,
            y2: mouse.y,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: state.strokeColor,
            fillColor: state.fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "diamond") {
        state.isDrawing = true

        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "diamond",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: state.strokeColor,
            fillColor: state.fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "triangle") {
        state.isDrawing = true

        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "triangle",
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: state.strokeColor,
            fillColor: state.fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "arrow") {
        state.isDrawing = true

        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "arrow",
            x1: mouse.x,
            y1: mouse.y,
            x2: mouse.x,
            y2: mouse.y,
            selected: false,
            editMode: false,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeColor: state.strokeColor,
            fillColor: state.fillColor,
            fill: true,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType
        }
    }

    if (state.tool === "pencil") {
        state.isDrawing = true

        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "pencil",
            points: [{ x: mouse.x, y: mouse.y, pressure: e.pressure }],
            strokeColor: state.strokeColor,
            selectedStroke: state.selectedStroke,
            seed: Math.random() * 100000,
            strokeWidth: state.selectedStrokeWidth,
            fillType: state.selectedFillType,
            pressureToggle: state.pressure
        }
    }


    if (state.tool === "text") {

        state.startX = mouse.x
        state.startY = mouse.y

        state.currentShape = {
            type: "text",
            x: mouse.x,
            y: mouse.y,
            text: "",
            fontSize: 24,
            fontFamily: state.selectedFont,
            strokeColor: state.strokeColor,
            selected: false,
            editMode: true
        }

        state.objects.push(state.currentShape);
        state.selectedShape = state.currentShape;
        state.currentShape = null;

        startTextEditing(state.selectedShape, camera, ctx, render);
        scheduleRender(render)
    }

}

