import { renderState } from "./renderstate.js";

export function scheduleRender(render) {
    if (renderState.needsRender) return

    renderState.needsRender = true;


    requestAnimationFrame(() => {
        renderState.needsRender = false;
        render();
    });
}

