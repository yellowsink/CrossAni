import { unload } from ".";
import { EASE, JUMP } from "./generator";

// @ts-expect-error
window.EASE = EASE;
// @ts-expect-error
window.JUMP = JUMP;
// @ts-expect-error
window.unloadCrossani = unload;
