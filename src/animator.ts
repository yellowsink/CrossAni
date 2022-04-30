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

export function startAnimating(elem: HTMLElement) {
  const [state] = getOrInitStore(elem);
  const transition = state.queue[0];
  if (!transition) return;

  if (transition.cutOff) {
    //cancelAnimating(elem);
    popAll(elem);
  }

  // generates the style transition: property string
  // needs to be run before updating state.curr or some values may not work correctly
  const transitionString = generateTransition(state.curr, transition);

  // update styles
  if (transition.reset) state.curr = { ...transition.state };
  else Object.assign(state.curr, transition.state);

  // run transition
  elem.style.transition = transitionString;
  updateStyles(elem);

  let timedout = false;
  // listen for finish
  eventOrTimeout(
    elem,
    () => {
      // just incase an animation finished >20ms late
      if (timedout) return;

      state.queue.shift();
      startAnimating(elem);
      state.transitionPromises.shift()?.[2]();

      timedout = true;
    },
    // give the transition 20ms of room to end early
    transition.ms + 20
  );
}
