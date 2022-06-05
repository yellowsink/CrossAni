import { generateTransition } from "./generator";
import { getOrInitStore, updateStyles } from "./util";

/** Pops the first transition off the queue instantly */
function popFirst(elem: HTMLElement | SVGElement) {
  const state = getOrInitStore(elem);
  const transition = state.queue.shift();
  if (transition === undefined) return false;

  // update styles
  if (transition.reset) state.curr = transition.state ?? {};
  else Object.assign(state.curr, transition.state);

  // resolve
  state.transitionPromises.shift()?.[2]();

  return true;
}

/** Pops all transitions off the queue instantly and applies relevant CSS */
export function popAll(elem: HTMLElement | SVGElement) {
  while (popFirst(elem)) {}
  updateStyles(elem);
}

export const abortAnimation = (elem: HTMLElement | SVGElement) =>
  (elem.style.transition = "none");

export function startAnimating(elem: HTMLElement | SVGElement) {
  const state = getOrInitStore(elem);
  const transition = state.queue[0];
  if (!transition) return;

  // generates the style transition: property string
  // needs to be run before updating state.curr or some values may not work correctly
  const transitionString = generateTransition(state, transition);

  // update styles
  if (transition.reset) state.curr = { ...transition.state };
  else Object.assign(state.curr, transition.state);

  state.lastMs = transition.ms ?? state.lastMs;
  state.lastEase = transition.easing ?? state.lastEase;

  // run transition
  elem.style.transition = transitionString;
  updateStyles(elem);

  setTimeout(() => {
    state.queue.shift();
    state.transitionPromises.shift()?.[2]();

    startAnimating(elem);
  }, state.lastMs);
}
