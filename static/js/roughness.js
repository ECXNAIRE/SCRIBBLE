

//HELPER FUNCTION 
export function randomOffset(seed, amount) {
    const r = seededRandom(seed);
    return (r - 0.5) * amount * 2;;
}


function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function roughLine(ctx, x1, y1, x2, y2, shape, sloppiness) {
   
    ctx.strokeStyle = shape.strokeColor
    ctx.lineWidth = shape.strokeWidth
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineDashOffset = 0;

    for (let pass = 0; pass < 2; pass++) {

        ctx.beginPath();

        ctx.moveTo(
            x1 + randomOffset(shape.seed + pass * 1000, sloppiness),
            y1 + randomOffset(shape.seed + pass * 1000 + 1, sloppiness)
        );

        const steps = 8;

        for (let i = 1; i <= steps; i++) {

            const t = i / steps;

            const x =
                x1 + (x2 - x1) * t +
                randomOffset(shape.seed + pass * 1000 + i * 2, sloppiness);

            const y =
                y1 + (y2 - y1) * t +
                randomOffset(shape.seed + pass * 1000 + i * 2 + 1, sloppiness);

            ctx.lineTo(x, y);
        }

        ctx.stroke()
    }
}



export function roughEllipse(ctx, shape, sloppiness) {

    ctx.strokeStyle = shape.strokeColor
    ctx.lineWidth = shape.strokeWidth


    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2


    const rx = Math.abs(shape.width / 2)
    const ry = Math.abs(shape.height / 2)


    const segments = Math.max(32, Math.floor(Math.max(rx, ry) / 2))

    for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath()

        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2

            const x =
                cx +
                rx * Math.cos(angle) +
                randomOffset(shape.seed + pass * 1000 + i * 2, sloppiness);

            const y =
                cy +
                ry * Math.sin(angle) +
                randomOffset(shape.seed + pass * 1000 + i * 2 + 1, sloppiness);

            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        }

        ctx.closePath()
        ctx.stroke()
    }
}



export function roughArc(ctx, cx, cy, radius, startAngle, endAngle, shape, sloppiness, counterClockwise = false) {
    ctx.strokeStyle = shape.strokeColor
    ctx.lineWidth = shape.strokeWidth
    ctx.lineJoin = "round"
    ctx.lineCap = "round"

    for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath()

        const steps = 10
        let delta = endAngle - startAngle;

        if (!counterClockwise && delta < 0) {
            delta += Math.PI * 2;
        }

        if (counterClockwise && delta > 0) {
            delta -= Math.PI * 2;
        }

        for (let i = 0; i <= steps; i++) {
            const t = i / steps

             const angle = startAngle + delta * t;

            const x = cx + Math.cos(angle) * radius + randomOffset(shape.seed + pass * 1000 + i * 2, sloppiness)

            const y = cy + Math.sin(angle) * radius + randomOffset(shape.seed + pass * 1000 + i * 2 + 1, sloppiness)


            if (i === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        }

        ctx.stroke()
    }
}