import { selectionBox } from "../helpers/handle&selectionbox.js";
import { distanceToLine, lineSelectionBox } from "../helpers/lineTools.js";
import { roughEllipse, roughLine, roughArc } from "../helpers/strokeEditor.js";
import { drawHachure } from "../helpers/fillType.js";
import { Path, drawPath } from "../helpers/pathArch.js";
//RECTANGLE

export function drawRectangle(shape, ctx, sloppiness) {
    const path = new Path()
    const maxRadius = Math.min(
        Math.abs(shape.width),
        Math.abs(shape.height)
    ) / 2;


    const x1 = Math.min(shape.x, shape.x + shape.width);
    const y1 = Math.min(shape.y, shape.y + shape.height);

    const x2 = Math.max(shape.x, shape.x + shape.width);
    const y2 = Math.max(shape.y, shape.y + shape.height);

    const r = Math.min(shape.edgeStyle, maxRadius);

    if (shape.fill) {
        if (shape.fillType === "solid") {
            ctx.beginPath();
            ctx.moveTo(x1 + r, y1);
            ctx.lineTo(x2 - r, y1);
            ctx.arc(x2 - r, y1 + r, r, -Math.PI / 2, 0);
            ctx.lineTo(x2, y2 - r);
            ctx.arc(x2 - r, y2 - r, r, 0, Math.PI / 2);
            ctx.lineTo(x1 + r, y2);
            ctx.arc(x1 + r, y2 - r, r, Math.PI / 2, Math.PI);
            ctx.lineTo(x1, y1 + r);
            ctx.arc(x1 + r, y1 + r, r, Math.PI, Math.PI * 1.5);
            ctx.closePath();
            ctx.fillStyle = shape.fillColor;
            ctx.fill();
        } else if (shape.fillType === "hachure") {
            drawHachure(ctx,
                () => {
                    ctx.beginPath();
                    ctx.moveTo(x1 + r, y1);
                    ctx.lineTo(x2 - r, y1);
                    ctx.arc(x2 - r, y1 + r, r, -Math.PI / 2, 0);
                    ctx.lineTo(x2, y2 - r);
                    ctx.arc(x2 - r, y2 - r, r, 0, Math.PI / 2);
                    ctx.lineTo(x1 + r, y2);
                    ctx.arc(x1 + r, y2 - r, r, Math.PI / 2, Math.PI);
                    ctx.lineTo(x1, y1 + r);
                    ctx.arc(x1 + r, y1 + r, r, Math.PI, Math.PI * 1.5);
                    ctx.closePath();
                },
                {
                    left: Math.min(shape.x, shape.x + shape.width),
                    right: Math.max(shape.x, shape.x + shape.width),
                    top: Math.min(shape.y, shape.y + shape.height),
                    bottom: Math.max(shape.y, shape.y + shape.height)
                }, shape, sloppiness)
        }
    }
    path.moveTo(x1 + r, y1);

    path.lineTo(x2 - r, y1);
    path.arc(x2 - r, y1 + r, r, -Math.PI / 2, 0);
    path.lineTo(x2, y2 - r);
    path.arc(x2 - r, y2 - r, r, 0, Math.PI / 2);
    path.lineTo(x1 + r, y2);
    path.arc(x1 + r, y2 - r, r, Math.PI / 2, Math.PI);
    path.lineTo(x1, y1 + r);
    path.arc(x1 + r, y1 + r, r, Math.PI, Math.PI * 1.5);

    path.close();

    drawPath(ctx, path, shape, sloppiness);


    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

}









//ELLIPSE
export function drawEllipse(shape, ctx, sloppiness) {
    const cx = shape.x + shape.width / 2;
    const cy = shape.y + shape.height / 2;

    const rx = Math.abs(shape.width / 2);
    const ry = Math.abs(shape.height / 2);


    if (shape.fill) {

        if (shape.fillType === "solid") {

            ctx.beginPath();
            ctx.ellipse(
                cx,
                cy,
                rx,
                ry,
                0,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = shape.fillColor;
            ctx.fill();
        }

        else if (shape.fillType === "hachure") {
            drawHachure(
                ctx,
                () => {
                    ctx.beginPath();

                    ctx.ellipse(
                        cx,
                        cy,
                        rx,
                        ry,
                        0,
                        0,
                        Math.PI * 2
                    );
                },
                {
                    left: Math.min(shape.x, shape.x + shape.width),
                    right: Math.max(shape.x, shape.x + shape.width),
                    top: Math.min(shape.y, shape.y + shape.height),
                    bottom: Math.max(shape.y, shape.y + shape.height)
                },
                shape,
                sloppiness
            );
        }
    }

    if (sloppiness === 0) {
        ctx.beginPath();

        ctx.ellipse(
            cx,
            cy,
            rx,
            ry,
            0,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = shape.strokeColor
        ctx.lineWidth = shape.strokeWidth
        ctx.stroke()
    } else roughEllipse(ctx, shape, sloppiness)

    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

}




//line
export function drawLine(shape, ctx, sloppiness) {


    ctx.beginPath();


    roughLine(
        ctx,
        shape.x1,
        shape.y1,
        shape.x2,
        shape.y2,
        shape,
        sloppiness
    );

    if (shape.selected && shape.editMode) {
        lineSelectionBox(shape, ctx)
    }

}



//DIAMOND

export function drawDiamond(shape, ctx, sloppiness) {
    ctx.beginPath();

    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2


    const top = { x: cx, y: shape.y }
    const right = { x: shape.x + shape.width, y: cy }
    const bottom = { x: cx, y: shape.y + shape.height }
    const left = { x: shape.x, y: cy }

    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath();

    if (shape.fill) {
        if (shape.fillType === "solid") {
            ctx.fillStyle = shape.fillColor;
            ctx.fill();
        } else if (shape.fillType === "hachure") {
            drawHachure(
                ctx,
                () => {
                    ctx.beginPath();
                    ctx.moveTo(top.x, top.y);
                    ctx.lineTo(right.x, right.y);
                    ctx.lineTo(bottom.x, bottom.y);
                    ctx.lineTo(left.x, left.y);
                    ctx.closePath();
                },
                {
                    left: Math.min(shape.x, shape.x + shape.width),
                    right: Math.max(shape.x, shape.x + shape.width),
                    top: Math.min(shape.y, shape.y + shape.height),
                    bottom: Math.max(shape.y, shape.y + shape.height)
                },
                shape,
                sloppiness
            );
        }
    }


    roughLine(
        ctx,
        top.x,
        top.y,
        right.x,
        right.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx,
        right.x,
        right.y,
        bottom.x,
        bottom.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx,
        bottom.x,
        bottom.y,
        left.x,
        left.y,
        shape,
        sloppiness
    )

    roughLine(
        ctx,
        left.x,
        left.y,
        top.x,
        top.y,
        shape,
        sloppiness
    )

    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }
}



///TRIANGLE

export function drawTriangle(shape, ctx, sloppiness) {

    ctx.beginPath()


    const top = { x: shape.x + shape.width / 2, y: shape.y }
    const right = { x: shape.x + shape.width, y: shape.y + shape.height }
    const left = { x: shape.x, y: shape.y + shape.height }

    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath()

    if (shape.fill) {
        if (shape.fillType === "solid") {
            ctx.fillStyle = shape.fillColor;
            ctx.fill();
        } else if (shape.fillType === "hachure") {

            drawHachure(
                ctx,
                () => {
                    ctx.beginPath();
                    ctx.moveTo(top.x, top.y);
                    ctx.lineTo(right.x, right.y);
                    ctx.lineTo(left.x, left.y);
                    ctx.closePath();
                },
                {
                    left: Math.min(shape.x, shape.x + shape.width),
                    right: Math.max(shape.x, shape.x + shape.width),
                    top: Math.min(shape.y, shape.y + shape.height),
                    bottom: Math.max(shape.y, shape.y + shape.height)
                },
                shape,
                sloppiness
            );

        }
    }
    const path = new Path();

    path.moveTo(top.x, top.y)
    path.lineTo(right.x, right.y)
    path.lineTo(left.x, left.y)
    path.lineTo(top.x, top.y)
    path.close();

    drawPath(ctx, path, shape, sloppiness);

    if (shape.selected && shape.editMode) {
        selectionBox(shape, ctx)
    }

}






export function drawArrow(shape, ctx, sloppiness) {
    const { x1, y1, x2, y2 } = shape

    const headLength = 15

    const angle = Math.atan2(y2 - y1, x2 - x1)


    roughLine(
        ctx,
        x1,
        y1,
        x2,
        y2,
        shape,
        sloppiness
    );


    const leftX = x2 - headLength * Math.cos(angle - Math.PI / 6)
    const leftY = y2 - headLength * Math.sin(angle - Math.PI / 6)

    const rightX = x2 - headLength * Math.cos(angle + Math.PI / 6)
    const rightY = y2 - headLength * Math.sin(angle + Math.PI / 6)

    roughLine(
        ctx,
        x2,
        y2,
        leftX,
        leftY,
        shape,
        sloppiness
    );

    roughLine(
        ctx,
        x2,
        y2,
        rightX,
        rightY,
        shape,
        sloppiness
    );


    if (shape.selected && shape.editMode) {
        lineSelectionBox(shape, ctx)
    }

}




export function drawPencil(shape, ctx, sloppiness) {

    const points = shape.points

    if (points.length < 2) return


    ctx.strokeStyle = shape.strokeColor
    ctx.lineCap = "round"
    ctx.lineJoin = "round"



    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const current = points[i]
        const next = points[i + 1]


        const midX = (current.x + next.x) / 2
        const midY = (current.y + next.y) / 2

        let pressure

        if (shape.pressureToggle === "false") {
            pressure = 0.4
        } else {
            pressure = current.pressure
        }


        ctx.lineWidth = calculatePressureWidth(pressure, shape.strokeWidth)

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.quadraticCurveTo(
            current.x,
            current.y,
            midX,
            midY
        );
        ctx.stroke()
    }
}


function calculatePressureWidth(pressure, baseWidth) {
    pressure = Math.pow(pressure, 0.5)

    const minWidth = baseWidth * 0.005;
    const maxWidth = baseWidth * 3

    return minWidth +
        (maxWidth - minWidth) * pressure;

}

export function drawText(shape, ctx) {
    ctx.save()
    ctx.font = `${shape.fontSize}px ${shape.fontFamily}`
    ctx.fillStyle = shape.strokeColor
    ctx.textBaseline = "top"


    ctx.fillText(shape.text, shape.x, shape.y)

    if (shape.selected) {
        selectionBox(shape, ctx)
    }

    ctx.restore()
}


export function startTextEditing(shape) {

    document.querySelectorAll("input.text-editor").forEach(i => i.remove());

    const screenX = (shape.x - camera.x) * camera.zoom;
    const screenY = (shape.y - camera.y) * camera.zoom;
    const input = document.createElement("input")

    input.type = "text"
    input.className = "text-editor"
    input.value = shape.text

    input.style.position = "absolute"
    input.style.left = `${screenX}px`;
    input.style.top = `${screenY}px`;


    input.style.fontSize = `${shape.fontSize * camera.zoom}px`
    input.style.fontFamily = shape.fontFamily
    input.style.color = shape.strokeColor


    input.style.border = "none"
    input.style.outline = "none"
    input.style.background = "transparent"
    input.style.padding = "0";
    input.style.margin = "0";
    input.style.height = `${(shape.fontSize + 8) * camera.zoom}px`;
    input.style.width = "20px";


    canvasArea.appendChild(input)

    function updateWidth() {
        ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
        const width = ctx.measureText(input.value || " ").width;

        input.style.width = `${Math.max(20, width + 8) * camera.zoom}px`;
    }

    updateWidth()
    setTimeout(() => {
        input.focus();
    }, 500);


    input.addEventListener('input', () => {

        shape.text = input.value

        ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
        shape.width = ctx.measureText(shape.text || " ").width;
        shape.height = shape.fontSize;


        scheduleRender()
        updateWidth()
    })


    input.addEventListener("blur", () => {

        shape.text = input.value;
        shape.editMode = false;


        input.remove();
        scheduleRender();
    });



    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()

            shape.selected = false
            selectedShape = null

            input.blur()
        }
    })
}

