import { ElementState, Transition } from "./types";

export const EASE = {
  cubicBezier: (...points: number[]) =>
    `cubic-bezier(${points
      // typescript please god
      .map((p) => p.toString())
      .reduce((curr, next) => curr + "," + next)})`,

  // "cubicBezier(.25, .1, .25, 1)"
  ease: "ease",
  // "cubicBezier(.42, 0, 1, 1)"
  in: "ease-in",
  // "cubicBezier(0, 0, .58, 1)"
  out: "ease-out",
  // "cubicBezier(.42, 0, .58, 1)"
  inOut: "ease-in-out",
  // "cubicBezier(0, 0, 1, 1)"
  linear: "linear",

  steps: (n: number, term: JumpTypes) => `steps(${n},${term})`,

  startSteps: (n: number) => EASE.steps(n, JUMP.start),
  endSteps: (n: number) => EASE.steps(n, JUMP.end),
};

/** @internal */
type JumpTypes = "start" | "end" | "jump-none" | "jump-both";

/** @internal */
interface Jumps {
  start: "start";
  end: "end";
  none: "jump-none";
  both: "jump-both";
}

export const JUMP: Jumps = {
  start: "start", // "jump-start"
  end: "end", // "jump-end"
  none: "jump-none",
  both: "jump-both",
};

export function updateTransition(state: ElementState, trans: Transition) {
  for (const prop in trans.state)
    if (!state.running.has(prop))
      state.running.set(prop, [
        trans.ms ?? state.lastMs,
        prop,
        trans.easing ?? state.lastEase,
      ]);
}

/* export const finishTransition = (state: ElementState, trans: Transition) =>
  Object.keys(trans.state ?? {}).forEach((p) => state.running.delete(p)); */

export const generateTransition = (state: ElementState) =>
  Array.from(state.running.values())
    .map(([ms, prop, ease]) => `${prop} ${ms ?? state.lastMs}ms ${ease ?? state.lastEase}`)
    .join(",");