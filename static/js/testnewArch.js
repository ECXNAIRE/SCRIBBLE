import { roughLine } from "./roughness.js";

export class Path {
    constructor() {
        this.commands = []
    }


    //STARTING COORDS
    roughLine(x1, y1, x2, y2, shape, sloppiness){
        this.commands.push({
            type: "roughLine",
            x1,
            y1,
            x2,
            y2,
            shape,
            sloppiness
        })
    }

    close() {
        this.commands.push({
            type: "close"
        })
    }
}




//HARCODED RECT FOR TESTING




export function drawPath(ctx, path) {
    ctx.beginPath()

    for(const cmd of path.commands) {
        switch(cmd.type) {
            case "roughLine":
                roughLine(
                    ctx,
                    cmd.x1,
                    cmd.y1,
                    cmd.x2,
                    cmd.y2,
                    cmd.shape,
                    cmd.sloppiness
                )

                break

            case "close":
                ctx.closePath()
                break
        }

        
    }


    ctx.stroke()
}