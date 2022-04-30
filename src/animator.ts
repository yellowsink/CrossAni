import { generateTransition } from "./generator";
import { eventOrTimeout, getOrInitStore, updateStyles } from "./util";

/** Pops the first transition off the queue instantly */
function popFirst(elem: HTMLElement) {
  const [state, created] = getOrInitStore(elem);
  const transition = state.queue.shift();
  if (created || transition === undefined) return false;

  // update styles
  if (transition.reset) state.curr = transition.state;
  else Object.assign(state.curr, transition.state);

  return true;
}

/** Pops all transitions off the queue instantly and applies relevant CSS */
export function popAll(elem: HTMLElement) {
  while (popFirst(elem)) {}
  updateStyles(elem);
}

/* export function cancelAnimating(elem: HTMLElement) {
  const [state] = getOrInitStore(elem);
  state.CANCEL = state.queue[0];
  // hopefully this cuts off?
  elem.style.transition = "none";
} */

export function startAnimating(elem: HTMLElement) {
  const [state] = getOrInitStore(elem);
  const transition = state.queue[0];
  if (!transition) return;

  /* if (state.CANCEL === transition) {
    state.CANCEL = undefined;
    return;
  } */

  if (transition.cutOff) {
    //cancelAnimating(elem);
    popAll(elem);
  }

  // generates the style transition: property string
  // needs to be run before updating state.curr or some values may not work correctly
  const transitionString = generateTransition(state.curr, transition);

  // update styles
  if (transition.reset) state.curr = transition.state;
  else Object.assign(state.curr, transition.state);

  // run transition
  elem.style.transition = transitionString;
  updateStyles(elem);

  const promise = state.transitionPromises.get(transition);
  if (!promise) throw new Error("promise was missing from state");

  const [, res, rej] = promise;

  // listen for finish
  eventOrTimeout(
    elem,
    () => {
      state.queue.shift();
      startAnimating(elem);
      res();
    },
    () => {
      state.queue.shift();
      startAnimating(elem);
      rej("transitionend did not fire within 100ms of transition end");
    },
    transition.ms + 100
  );
}
