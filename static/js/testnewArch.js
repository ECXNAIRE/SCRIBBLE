import { roughLine, roughArc } from "./roughness.js";

export class Path {
    constructor() {
        this.commands = []
    }


    moveTo(x, y) {
        this.commands.push({
            type: "moveTo",
            x,
            y
        });
    }

    lineTo(x, y) {
        this.commands.push({
            type: "lineTo",
            x,
            y
        });
    }

    arc(cx, cy, radius, startAngle, endAngle, counterClockwise = false) {
        this.commands.push({
            type: "arc",
            cx,
            cy,
            radius,
            startAngle,
            endAngle,
            counterClockwise
        });
    }

    close() {
        this.commands.push({
            type: "close"
        })
    }
}





export function drawPath(ctx, path, shape, sloppiness) {


    let currentX = 0;
    let currentY = 0;

    for (const cmd of path.commands) {

        switch (cmd.type) {

            case "moveTo":
                currentX = cmd.x;
                currentY = cmd.y;
                break;

            case "lineTo":

                roughLine(
                    ctx,
                    currentX,
                    currentY,
                    cmd.x,
                    cmd.y,
                    shape,
                    sloppiness
                );

                currentX = cmd.x;
                currentY = cmd.y;

                break;

            case "arc":

                roughArc(
                    ctx,
                    cmd.cx,
                    cmd.cy,
                    cmd.radius,
                    cmd.startAngle,
                    cmd.endAngle,
                    shape,
                    sloppiness,
                    cmd.counterClockwise
                );

                currentX =
                    cmd.cx + Math.cos(cmd.endAngle) * cmd.radius;

                currentY =
                    cmd.cy + Math.sin(cmd.endAngle) * cmd.radius;

                break;

            case "close":
                roughLine(
                    ctx,
                    currentX,
                    currentY,
                    path.commands[0].x,
                    path.commands[0].y,
                    shape,
                    sloppiness
                );
                break;
        }
    }
}