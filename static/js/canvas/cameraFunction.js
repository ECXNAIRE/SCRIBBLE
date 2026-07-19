export const camera = {
    x: 0,
    y: 0,
    zoom: 1
}



export function screenToWorld(x, y, camera) {
    return {
        x: x / camera.zoom + camera.x,
        y: y / camera.zoom + camera.y
    }
}

export function worldToScreen(x, y, camera) {
    return {
        x: (x - camera.x) * camera.zoom,
        y: (y - camera.y) * camera.zoom
    }
}