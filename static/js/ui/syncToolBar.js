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

            break

        case "triangle":
        case "ellipse":
        case "diamond":
            state.selectedStrokeWidth = shape.strokeWidth
            state.strokeColor = shape.strokeColor
            state.selectedStroke = shape.selectedStroke
            state.selectedFillType = shape.fillType
            state.fillColor = shape.fillColor

            break

        case "line":
        case "arrow":
            state.selectedStrokeWidth = shape.strokeWidth
            state.strokeColor = shape.strokeColor
            state.selectedStroke = shape.selectedStroke
            break


        case "text":
            state.strokeColor = shape.strokeColor
            state.selectedFont = shape.fontFamily
            break

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


    document.querySelector(".fontStyleBtn.active")
        ?.classList.remove("active");

    document.querySelector(
        `.fontStyleBtn[data-fontstyle="${state.selectedFont}"]`
    )?.classList.add("active");


    const strokePicker = document.getElementById("strokeColorPicker")
    const fillPicker = document.getElementById("fillColorPicker")
    const strokePickerPreview = document.getElementById("strokePickerPreview")
    const fillPickerPreview = document.getElementById("fillPickerPreview")



    strokePicker.value = state.strokeColor
    strokePickerPreview.style.background = state.strokeColor


    if (state.fillColor === "transparent") {
        fillPickerPreview.classList.add("transparentColor")
        fillPickerPreview.style.removeProperty("background")
    } else {
        fillPicker.value = state.fillColor;
        fillPickerPreview.classList.remove("transparentColor");
        fillPickerPreview.style.background = state.fillColor;
    }


    document.querySelector(".strokeColorBtn.active")
        ?.classList.remove("active")
    document.querySelector(
        `.strokeColorBtn[data-color="${state.strokeColor}"]`
    )?.classList.add("active")


    document.querySelector(".fillColorBtn.active")
        ?.classList.remove("active");
    document.querySelector(
        `.fillColorBtn[data-color="${state.fillColor}"]`
    )?.classList.add("active");

}



