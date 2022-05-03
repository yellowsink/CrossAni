import { load, unload } from ".";
import { EASE, JUMP } from "./generator";

load();
// @ts-expect-error
window.EASE = EASE;
// @ts-expect-error
window.JUMP = JUMP;
// @ts-expect-error
window.unloadCrossani = unload;
