import { state } from "../state.js";




export function syncToolBar(shape) {
    switch (shape.type) {
        case "rectangle":
            state.selectedStrokeWidth = shape.strokeWidth
            state.strokeColor = shape.strokeColor
            state.selectedStroke = shape.selectedStroke
            state.edgeStyle = shape.edgeStyle
            state.selectedFillType = shape.fillType
            state.fillColor = shape.fillColor

        case "triangle":
        case "ellipse":
        case "diamond":
            state.selectedStrokeWidth = shape.strokeWidth
            state.strokeColor = shape.strokeColor
            state.selectedStroke = shape.selectedStroke
            state.selectedFillType = shape.fillType
            state.fillColor = shape.fillColor

            
    }



    document.querySelector(".strokeBtn.active")
        ?.classList.remove("active");

    document.querySelector(
        `.strokeBtn[data-stroke="${state.selectedStroke}"]`
    )?.classList.add("active");


    document.querySelector(".strokeWidthBtn.active")
        ?.classList.remove("active");

    document.querySelector(
        `.strokeWidthBtn[data-strokewidth="${shape.strokeWidth}"]`
    )?.classList.add("active");


    document.querySelector(".fillTypeBtn.active")
        ?.classList.remove("active");

    document.querySelector(
        `.fillTypeBtn[data-filltype="${shape.fillType}"]`
    )?.classList.add("active");


    document.querySelector(".edgeStyleBtn.active")
        ?.classList.remove("active");

    document.querySelector(
        `.edgeStyleBtn[data-edgestyle="${shape.edgeStyle}"]`
    )?.classList.add("active");

}



