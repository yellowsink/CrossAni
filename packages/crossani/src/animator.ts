import { generateTransition, updateTransition } from "./transCssManager";
import { getOrInitStore, updateStyles } from "./util";
import { enqueue } from "./queue";
import { Transition } from "./types";

/** Pops the first transition off the queue instantly */
function popFirst(elem: HTMLElement | SVGElement) {
  const state = getOrInitStore(elem);
  const transition = state.queue.shift();
  if (transition === undefined) return false;

  // update styles
  if (transition.reset) state.curr = transition.state ?? {};
  else Object.assign(state.curr, transition.state);

  // resolve
  state.transitionPromises.get(transition)?.[1]();
  state.transitionPromises.delete(transition);

  return true;
}

/** Pops all transitions off the queue instantly and applies relevant CSS */
export function popAll(elem: HTMLElement | SVGElement) {
  while (popFirst(elem)) {}
  updateStyles(elem);
}

export const abortAnimation = (elem: HTMLElement | SVGElement) =>
  (elem.style.transition = "none");

export function startAnimating(
  elem: HTMLElement | SVGElement,
  transition?: Transition
) {
  const state = getOrInitStore(elem);
  if (!transition?.detached) transition = state.queue[0];
  if (!transition) return;

  updateTransition(state, transition);

  // update styles
  if (transition.reset) state.curr = { ...transition.state };
  else Object.assign(state.curr, transition.state);

  // run transition
  elem.style.transition = generateTransition(state);
  updateStyles(elem);

  state.lastMs = transition.ms ?? state.lastMs;
  state.lastEase = transition.easing ?? state.lastEase;

  enqueue(() => {
    state.transitionPromises.get(transition!)?.[1]();
    state.transitionPromises.delete(transition!);
    if (transition!.detached) return;
    state.queue.shift();

    startAnimating(elem);
  }, state.lastMs + 1); // lmao
}
