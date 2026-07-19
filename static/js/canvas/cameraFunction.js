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