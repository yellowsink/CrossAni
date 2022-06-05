import { EASE } from "./generator";
import { stateStore } from "./shared";
import { ElementState, Transition } from "./types";

/** Converts a CSSStyleDeclaration to a Record<string, string> */
export function cloneStyles(styles: CSSStyleDeclaration) {
  // CSSStyleDeclaration is actually an array of props!
  // on blink, there is also the props as keys, so we filter these out
  const entries = Object.entries(styles)
    .filter(([k]) => !Object.is(parseInt(k), NaN)) // comparing NaN is never true moment
    .map(([, p]) => [p, styles[p as any]]);
  return Object.fromEntries(entries);
}

/** Gets a store or inits if needed */
export function getOrInitStore(elem: HTMLElement | SVGElement) {
  const state = stateStore.get(elem);
  if (state) return state;

  const newState: ElementState = {
    curr: {},
    orig: cloneStyles(elem.style),
    queue: [],
    transitionPromises: [],
    lastEase: EASE.ease,
    lastMs: 100,
  };

  sanitiseStyleObject(newState.orig);

  // new element
  stateStore.set(elem, newState);
  return newState;
}

/** Updates the style tag according to the latest transition state etc */
export function updateStyles(elem: HTMLElement | SVGElement) {
  const state = getOrInitStore(elem);

  elem.style.cssText = `transition:${elem.style.transition}`;
  Object.assign(elem.style, state.orig, state.curr);
}

/** Queues a transition. Returns true if the element is not currently animati */
export function queueTransition(
  elem: HTMLElement | SVGElement,
  transition: Transition
): [boolean, Promise<void>] {
  const state = getOrInitStore(elem);
  state.queue.push(transition);

  let resolve: () => void;
  const promise = new Promise<void>((res) => (resolve = res));

  state.transitionPromises.push([transition, promise, () => resolve()]);

  return [state.queue.length === 1, promise];
}

function sanitiseStyleObject(obj: Record<string, string>) {
  delete obj.transition;
  delete obj["transition-delay"];
  delete obj["transition-duration"];
  delete obj["transition-property"];
  delete obj["transition-timing-function"];
}

/** removes transition properties from states */
export function sanitiseTransitions(elem: HTMLElement | SVGElement) {
  if (!elem.transitions) return;

  for (const transition of Object.values(elem.transitions)) {
    if (!transition?.state) continue;
    sanitiseStyleObject(transition.state);
  }
}

/** Waits for an element to finish transitioning before running callback, always run abortAnimation first */
export const whenTransitionAborts = (
  elem: HTMLElement | SVGElement,
  callback: () => void
) => {
  // see comment above usage in index.ts

  const animateOnceStopped = () =>
    requestAnimationFrame(
      elem.style.transitionProperty === "none" ? callback : animateOnceStopped
    );

  requestAnimationFrame(animateOnceStopped);
};
