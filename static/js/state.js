export const state = {
    isPanning :false,
    panStartX : 0,
    panStartY :0,
    spacePressed: false,
    tool: "pointer", //done
    objects: [], //done
    isDrawing: false, //done
    startX: 0, //done
    startY: 0,
    currentX: 0,
    currentY: 0,
    currentShape : null, //done
    isResizing : false,
    resizeHandle: null,
    selectedShape: null, //done
    editMode : false,
    isDragging : false,
    dragOffsetX : 0,
    dragOffsetY : 0,
    dragShape : null,
    selectedStroke : "stroke1",
    selectedStrokeWidth :2,
    selectedFillType : "solid",
    shiftPressed : false,
    isErasing :false,
    edgeStyle : 0,
    gridToggle : false,
    cursorX : 0,
    cursorY : 0,
    selectedFont : "sans-serif",
    pressure : "false"


}