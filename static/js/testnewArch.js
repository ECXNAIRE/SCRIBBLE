import { roughLine } from "./roughness.js";

export class Path {
    constructor() {
        this.commands = []
    }


    //STARTING COORDS
    moveTo(x, y) {
        this.commands.push({
            type:"moveTo",
            x, 
            y
        })
    }

    lineTo(x, y) {
        this.commands.push({
            type: "lineTo",
            x,
            y
        })
    }


    arc(cx, cy, radius, startAngle, endAngle) {
        this.commands.push({
            type: "arc",
            cx,
            cy,
            radius,
            startAngle,
            endAngle
        })
    }

    close() {
        this.commands.push({
            type: "close"
        })
    }
}




//HARCODED RECT FOR TESTING

const path = new Path();

path.moveTo(100, 100)
path.lineTo(300, 100)
path.lineTo(300, 200)
path.lineTo(100, 200)
path.close()

console.log(path.commands)



export function drawPath(ctx, path) {
    ctx.beginPath()

    for(const cmd of path.commands) {
        switch(cmd.type) {
            case "moveTo":
                ctx.moveTo(cmd.x, cmd.y)
                break

            case "lineTo":
                ctx.lineTo(cmd.x, cmd.y)
                break
            
            case "arc":
                ctx.arc(
                    cmd.cx,
                    cmd.cy,
                    cmd.radius,
                    cmd.startAngle,
                    cmd.endAngle
                )
                break

            case "close":
                ctx.closePath()
                break
        }

        
    }


    ctx.stroke()
}