const fillSection = document.getElementById("fillSection")
const sloppinessSection = document.getElementById("sloppinessSection")
const fillTypeSection = document.getElementById("fillTypeSection")
const edgeSection = document.getElementById("edgeSection")
const layerSection = document.getElementById("layerToggleSection")
const strokeWidthSection = document.getElementById("strokeWidthSection")
const fontSection = document.getElementById("fontSection")
const strokeColorSection = document.getElementById("strokeColorSection")
const pressureSelectionSection = document.getElementById("pressureSelectionSection")
const toolBarLeft = document.getElementById("toolBarLeft")

let layerOptionShow = false

fillSection.style.display = "none"
fillTypeSection.style.display = "none"
edgeSection.style.display = "none"
sloppinessSection.style.display = "none"
layerSection.style.display = "none"
strokeWidthSection.style.display = "none"
fontSection.style.display = "none"
strokeColorSection.style.display = "none"
pressureSelectionSection.style.display = "none"

updateLeftToolbar()

export function setLayerOption(value) {
    layerOptionShow = value
}

export function updateToolBar(tool) {

    fillSection.style.display = "none"
    fillTypeSection.style.display = "none"
    edgeSection.style.display = "none"
    sloppinessSection.style.display = "none"
    layerSection.style.display = "none"
    strokeWidthSection.style.display = "none"
    fontSection.style.display = "none"
    strokeColorSection.style.display = "none"
    pressureSelectionSection.style.display = "none"
    updateLeftToolbar()

    switch (tool) {
        case "rectangle":
            fillSection.style.display = "block"
            fillTypeSection.style.display = "block"
            edgeSection.style.display = "block"
            sloppinessSection.style.display = "block"
            if (layerOptionShow === true) {
                layerSection.style.display = "block"
            }
            strokeWidthSection.style.display = "block"
            strokeColorSection.style.display = "block"

            updateLeftToolbar()


            break

        case "triangle":
        case "circle":
        case "diamond":
        case "ellipse":
            fillSection.style.display = "block"
            fillTypeSection.style.display = "block"
            sloppinessSection.style.display = "block"
            if (layerOptionShow === true) {
                layerSection.style.display = "block"
            }
            strokeWidthSection.style.display = "block"
            strokeColorSection.style.display = "block"

            updateLeftToolbar()
            break


        case "line":
        case "arrow":
            sloppinessSection.style.display = "block"
            if (layerOptionShow === true) {
                layerSection.style.display = "block"
            }
            strokeWidthSection.style.display = "block"
            strokeColorSection.style.display = "block"

            updateLeftToolbar()

            break


        case "text":
            strokeColorSection.style.display = "block"
            fontSection.style.display = "block"
            if (layerOptionShow === true) {
                layerSection.style.display = "block"
            }


            updateLeftToolbar()
            break

        case "pencil":
            strokeColorSection.style.display = "block"
            strokeWidthSection.style.display = "block"
            pressureSelectionSection.style.display = "block"

            updateLeftToolbar()

            break
    }
}



export function updateLeftToolbar() {
    const visibleSections = [...toolBarLeft.children].filter(
        child => child.style.display !== "none"
    );

    toolBarLeft.style.display = visibleSections.length ? "flex" : "none";
}