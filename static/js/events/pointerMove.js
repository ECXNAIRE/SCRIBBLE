import { state } from "../states";
import { screenToWorld } from "../canvas/cameraFunction.js ";
import { updateCursor } from "../canvas/overlayCanvasFn.js";
import { scheduleRender } from "../helpers/scheduleRender.js";
import { getClickedShape, getClickedHandle } from "../pointer/hitTest.js";
import { resizeShape } from "../pointer/resize.js";